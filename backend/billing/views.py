import uuid

import requests
from django.conf import settings
from django.urls import reverse
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment, Semester, user_has_active_access, user_is_on_trial, user_trial_days_remaining
from .serializers import SemesterSerializer


class PaymentStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        semester = Semester.get_current()
        on_trial = user_is_on_trial(request.user)
        return Response({
            'has_access': user_has_active_access(request.user),
            'semester': SemesterSerializer(semester).data if semester else None,
            'on_trial': on_trial,
            'trial_days_remaining': user_trial_days_remaining(request.user) if on_trial else None,
        })


class CheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not (settings.PAYONEER_API_USERNAME and settings.PAYONEER_PAYMENT_TOKEN
                and settings.PAYONEER_DIVISION and settings.PAYONEER_NOTIFICATION_TOKEN):
            return Response({'detail': 'Payments are not configured yet.'}, status=503)

        semester = Semester.get_current()
        if not semester:
            return Response({'detail': 'No semester is available for purchase right now.'}, status=400)

        if Payment.objects.filter(user=request.user, semester=semester, status=Payment.PAID).exists():
            return Response({'detail': 'You already have access for this semester.'}, status=400)

        # Ours, not Payoneer's — this is what the notification echoes back so we can
        # find the right Payment row without depending on the shape of the LIST response.
        transaction_id = f'kbyg-{uuid.uuid4().hex}'
        notification_url = request.build_absolute_uri(
            f"{reverse('billing-notify')}?token={settings.PAYONEER_NOTIFICATION_TOKEN}"
        )

        payload = {
            'transactionId': transaction_id,
            'integration': 'HOSTED',
            'operationType': 'CHARGE',
            'division': settings.PAYONEER_DIVISION,
            'country': settings.PAYONEER_DEFAULT_COUNTRY,
            'customer': {
                'number': str(request.user.id),
                'email': request.user.ub_email,
            },
            'payment': {
                'amount': semester.price_cents / 100,
                'currency': 'USD',
                'reference': f'KnowBeforeYouGo access — {semester.name}',
            },
            'callback': {
                'returnUrl': f'{settings.FRONTEND_URL}/subscribe/success',
                'cancelUrl': f'{settings.FRONTEND_URL}/subscribe',
                'notificationUrl': notification_url,
            },
        }

        try:
            response = requests.post(
                f'{settings.PAYONEER_API_BASE_URL}/api/lists',
                json=payload,
                auth=(settings.PAYONEER_API_USERNAME, settings.PAYONEER_PAYMENT_TOKEN),
                timeout=15,
            )
            response.raise_for_status()
            redirect_url = response.json().get('redirect', {}).get('url')
        except (requests.RequestException, ValueError):
            redirect_url = None

        if not redirect_url:
            return Response({'detail': 'Could not start payment. Please try again.'}, status=502)

        Payment.objects.update_or_create(
            user=request.user,
            semester=semester,
            defaults={'payoneer_transaction_id': transaction_id, 'status': Payment.PENDING},
        )

        return Response({'checkout_url': redirect_url})


class PayoneerNotificationView(APIView):
    """Receives the async notification Payoneer Checkout POSTs after a payment attempt.

    Always returns 200 for recognized requests — Payoneer retries on anything else,
    and there's nothing more for them to do once we've recorded the outcome.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if not settings.PAYONEER_NOTIFICATION_TOKEN:
            return Response(status=503)
        if request.GET.get('token') != settings.PAYONEER_NOTIFICATION_TOKEN:
            return Response(status=403)

        payload = request.data or request.POST
        transaction_id = payload.get('transactionId')
        if not transaction_id:
            return Response(status=200)

        if payload.get('interactionCode') == 'PROCEED' and payload.get('statusCode') == 'charged':
            Payment.objects.filter(payoneer_transaction_id=transaction_id).update(
                status=Payment.PAID,
                payoneer_short_id=payload.get('shortId', ''),
                paid_at=timezone.now(),
            )
        elif payload.get('interactionCode') not in ('PROCEED', None):
            Payment.objects.filter(payoneer_transaction_id=transaction_id).update(status=Payment.FAILED)

        return Response(status=200)
