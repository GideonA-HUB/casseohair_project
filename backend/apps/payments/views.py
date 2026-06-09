from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminUser
from apps.orders.models import Order
from apps.orders.serializers import OrderSerializer

from .models import Payment
from .serializers import PaymentInitSerializer, PaymentSerializer
from .services import FlutterwaveService, PaystackService


class InitializePaymentView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = PaymentInitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            order = Order.objects.get(order_number=serializer.validated_data['order_number'])
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if order.is_paid:
            return Response({'detail': 'Order already paid.'}, status=status.HTTP_400_BAD_REQUEST)

        callback_url = f"{settings.FRONTEND_URL}/checkout/verify"
        provider = serializer.validated_data['provider']

        try:
            if provider == 'paystack':
                result = PaystackService.initialize_payment(order, callback_url)
            else:
                result = FlutterwaveService.initialize_payment(order, callback_url)
            return Response(result)
        except ValueError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class VerifyPaymentView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        reference = request.data.get('reference')
        provider = request.data.get('provider', 'paystack')

        if not reference:
            return Response({'detail': 'Reference is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if provider == 'paystack':
                payment = PaystackService.verify_payment(reference)
            else:
                payment = FlutterwaveService.verify_payment(reference)
        except ValueError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'payment': PaymentSerializer(payment).data,
            'order': OrderSerializer(payment.order).data,
        })


class PaymentPublicKeysView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({
            'paystack_public_key': settings.PAYSTACK_PUBLIC_KEY,
            'flutterwave_public_key': settings.FLUTTERWAVE_PUBLIC_KEY,
        })


class AdminPaymentListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        payments = Payment.objects.select_related('order').all()[:50]
        return Response(PaymentSerializer(payments, many=True).data)
