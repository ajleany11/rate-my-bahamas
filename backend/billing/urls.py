from django.urls import path

from .views import CheckoutSessionView, PaymentStatusView, PayoneerNotificationView

urlpatterns = [
    path('checkout/', CheckoutSessionView.as_view(), name='billing-checkout'),
    path('status/', PaymentStatusView.as_view(), name='billing-status'),
    path('notify/', PayoneerNotificationView.as_view(), name='billing-notify'),
]
