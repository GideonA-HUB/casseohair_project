from rest_framework import serializers

from .models import Payment


class PaymentInitSerializer(serializers.Serializer):
    order_number = serializers.CharField()
    provider = serializers.ChoiceField(choices=['paystack', 'flutterwave'])


class PaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_number', 'provider', 'reference',
            'amount', 'currency', 'status', 'verified_at', 'created_at',
        ]
