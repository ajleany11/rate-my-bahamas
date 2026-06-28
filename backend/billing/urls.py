from django.urls import path

from .views import CheckoutSessionView, PaymentStatusView, StripeWebhookView

urlpatterns = [
    path('checkout/', CheckoutSessionView.as_view(), name='billing-checkout'),
    path('status/', PaymentStatusView.as_view(), name='billing-status'),
    path('webhook/', StripeWebhookView.as_view(), name='billing-webhook'),
]
