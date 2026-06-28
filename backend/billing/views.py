import stripe
from django.conf import settings
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment, Semester, user_has_active_access
from .serializers import SemesterSerializer


class PaymentStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        semester = Semester.get_current()
        return Response({
            'has_access': user_has_active_access(request.user),
            'semester': SemesterSerializer(semester).data if semester else None,
        })


class CheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not settings.STRIPE_SECRET_KEY:
            return Response({'detail': 'Payments are not configured yet.'}, status=503)

        semester = Semester.get_current()
        if not semester:
            return Response({'detail': 'No semester is available for purchase right now.'}, status=400)

        if Payment.objects.filter(user=request.user, semester=semester, status=Payment.PAID).exists():
            return Response({'detail': 'You already have access for this semester.'}, status=400)

        stripe.api_key = settings.STRIPE_SECRET_KEY
        session = stripe.checkout.Session.create(
            mode='payment',
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': f'KnowBeforeYouGo access — {semester.name}'},
                    'unit_amount': semester.price_cents,
                },
                'quantity': 1,
            }],
            customer_email=request.user.ub_email,
            success_url=f'{settings.FRONTEND_URL}/subscribe/success',
            cancel_url=f'{settings.FRONTEND_URL}/subscribe',
            metadata={'user_id': str(request.user.id), 'semester_id': str(semester.id)},
        )

        Payment.objects.update_or_create(
            user=request.user,
            semester=semester,
            defaults={'stripe_checkout_session_id': session.id, 'status': Payment.PENDING},
        )

        return Response({'checkout_url': session.url})


class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if not settings.STRIPE_WEBHOOK_SECRET:
            return Response(status=503)

        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')
        try:
            event = stripe.Webhook.construct_event(request.body, sig_header, settings.STRIPE_WEBHOOK_SECRET)
        except (ValueError, stripe.error.SignatureVerificationError):
            return Response(status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            Payment.objects.filter(stripe_checkout_session_id=session['id']).update(
                status=Payment.PAID,
                stripe_payment_intent_id=session.get('payment_intent') or '',
                paid_at=timezone.now(),
            )

        return Response(status=200)
