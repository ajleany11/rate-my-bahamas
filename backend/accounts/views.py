from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PendingSignup
from .serializers import (
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    PasswordResetVerifySerializer,
    RegisterSerializer,
    VerifyEmailSerializer,
)

User = get_user_model()


class GoogleLoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        credential = request.data.get('credential')
        if not credential:
            return Response({'detail': 'Google credential required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not settings.GOOGLE_CLIENT_ID:
            return Response({'detail': 'Google login is not configured.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )
        except ValueError:
            return Response({'detail': 'Invalid Google token.'}, status=status.HTTP_400_BAD_REQUEST)

        email = idinfo.get('email')
        if not email:
            return Response({'detail': 'No email associated with this Google account.'}, status=status.HTTP_400_BAD_REQUEST)

        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

        user = User.objects.filter(ub_email__iexact=email).first()
        if user:
            if not user.is_active:
                user.is_active = True
                user.save(update_fields=['is_active'])
        else:
            user = User(
                username=email,
                email=email,
                ub_email=email,
                first_name=first_name,
                last_name=last_name,
                is_ub_student=True,
                is_active=True,
            )
            user.set_unusable_password()
            user.save()
            PendingSignup.objects.filter(ub_email__iexact=email).delete()

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save()
        except Exception:
            return Response(
                {'detail': 'Account created but we could not send the verification email. Please try again shortly.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({'detail': 'Verification code sent to your email.'}, status=status.HTTP_201_CREATED)


class VerifyEmailView(generics.GenericAPIView):
    serializer_class = VerifyEmailSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Email verified. You can now log in.'})


class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'A verification code has been sent to your email.'})


class PasswordResetVerifyView(generics.GenericAPIView):
    serializer_class = PasswordResetVerifySerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reset_token = serializer.save()
        return Response({'reset_token': reset_token})


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Your password has been reset. You can now log in.'}, status=status.HTTP_200_OK)


@csrf_exempt
def google_redirect_callback(request):
    """Receives the cross-origin POST that Google sends in redirect UX mode.

    Google posts `credential` (a signed JWT) here instead of returning it to
    the JavaScript callback, so Django's CSRF middleware would normally block it.
    We verify the token, issue JWT access/refresh tokens, then redirect the
    browser to /auth/callback so the React app can pick them up.
    """
    if request.method != 'POST':
        return HttpResponseRedirect('/')

    credential = request.POST.get('credential')
    if not credential or not settings.GOOGLE_CLIENT_ID:
        return HttpResponseRedirect('/auth/callback?error=google_failed')

    try:
        idinfo = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError:
        return HttpResponseRedirect('/auth/callback?error=google_failed')

    email = idinfo.get('email')
    if not email:
        return HttpResponseRedirect('/auth/callback?error=google_failed')

    first_name = idinfo.get('given_name', '')
    last_name = idinfo.get('family_name', '')

    user = User.objects.filter(ub_email__iexact=email).first()
    if user:
        if not user.is_active:
            user.is_active = True
            user.save(update_fields=['is_active'])
    else:
        user = User(
            username=email,
            email=email,
            ub_email=email,
            first_name=first_name,
            last_name=last_name,
            is_ub_student=True,
            is_active=True,
        )
        user.set_unusable_password()
        user.save()
        PendingSignup.objects.filter(ub_email__iexact=email).delete()

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    return HttpResponseRedirect(f'/auth/callback?access={access_token}&refresh={refresh_token}')
