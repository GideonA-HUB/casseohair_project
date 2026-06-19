from django.urls import path

from .views import AdminOrderDetailView, AdminOrderListView, AdminOrderStatusUpdateView, CheckoutView, OrderDetailView

urlpatterns = [
    path('admin/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/<int:pk>/status/', AdminOrderStatusUpdateView.as_view(), name='admin-order-status'),
    path('admin/<str:order_number>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='order-detail'),
]
