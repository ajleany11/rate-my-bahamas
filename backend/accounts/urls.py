from django.urls import path

from .views import (
    GoogleLoginView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    PasswordResetVerifyView,
    RegisterView,
    VerifyEmailView,
    google_redirect_callback,
)

urlpatterns = [
    path('google/', GoogleLoginView.as_view(), name='google-login'),
    path('google/redirect/', google_redirect_callback, name='google-redirect-callback'),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/verify/', PasswordResetVerifyView.as_view(), name='password-reset-verify'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
