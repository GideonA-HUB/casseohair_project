from django.urls import path

from .views import AdminOrderDetailView, AdminOrderListView, CheckoutView, OrderDetailView

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='order-detail'),
    path('admin/list/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/<str:order_number>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
]
