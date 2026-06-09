from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminUser
from apps.notifications.services import NotificationService

from .models import Order
from .serializers import CheckoutSerializer, OrderSerializer, OrderStatusUpdateSerializer


class CheckoutView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, order_number):
        try:
            order = Order.objects.prefetch_related('items').get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(order).data)


class AdminOrderListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = OrderSerializer
    filterset_fields = ['status', 'is_paid', 'payment_method']
    search_fields = ['order_number', 'email', 'full_name', 'phone']
    ordering_fields = ['created_at', 'total']
    ordering = ['-created_at']

    def get_queryset(self):
        return Order.objects.prefetch_related('items').all()


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Order.objects.prefetch_related('items').all()
    lookup_field = 'order_number'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return OrderStatusUpdateSerializer
        return OrderSerializer

    def perform_update(self, serializer):
        old_status = self.get_object().status
        order = serializer.save()
        if old_status != order.status:
            NotificationService.notify_order_status_change(order)
            if order.status == 'delivered':
                order.delivered_at = timezone.now()
                order.save(update_fields=['delivered_at'])
            elif order.status == 'shipped':
                order.shipped_at = timezone.now()
                order.save(update_fields=['shipped_at'])
            elif order.status == 'cancelled':
                order.cancelled_at = timezone.now()
                order.save(update_fields=['cancelled_at'])
