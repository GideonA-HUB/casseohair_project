from django.urls import path

from .views import AdminPaymentListView, InitializePaymentView, PaymentPublicKeysView, VerifyPaymentView

urlpatterns = [
    path('initialize/', InitializePaymentView.as_view(), name='payment-initialize'),
    path('verify/', VerifyPaymentView.as_view(), name='payment-verify'),
    path('keys/', PaymentPublicKeysView.as_view(), name='payment-keys'),
    path('admin/list/', AdminPaymentListView.as_view(), name='admin-payment-list'),
]
