from decimal import Decimal

from django.conf import settings
from rest_framework import serializers

from apps.products.models import Product

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_slug', 'product_image',
            'price', 'quantity', 'length', 'lace_type', 'color', 'subtotal',
        ]
        read_only_fields = ['product_name', 'product_slug', 'product_image', 'price', 'subtotal']


class CartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class CheckoutSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100, default='Nigeria')
    order_notes = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=['paystack', 'flutterwave'])
    items = CartItemSerializer(many=True)

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError('Cart cannot be empty.')
        return items

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        payment_method = validated_data.pop('payment_method')
        subtotal = Decimal('0')
        order_items = []

        for item_data in items_data:
            try:
                product = Product.objects.get(
                    pk=item_data['product_id'],
                    is_active=True,
                    is_archived=False,
                )
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    {'items': f'Product {item_data["product_id"]} not found.'}
                )

            if product.stock < item_data['quantity']:
                raise serializers.ValidationError(
                    {'items': f'Insufficient stock for {product.name}.'}
                )

            price = product.current_price
            item_subtotal = price * item_data['quantity']
            subtotal += item_subtotal

            primary_image = product.primary_image
            image_url = ''
            if primary_image:
                request = self.context.get('request')
                image_url = primary_image.image.url
                if request:
                    image_url = request.build_absolute_uri(image_url)

            order_items.append({
                'product': product,
                'product_name': product.name,
                'product_slug': product.slug,
                'product_image': image_url,
                'price': price,
                'quantity': item_data['quantity'],
                'length': product.length,
                'lace_type': product.lace_type,
                'color': product.color,
                'subtotal': item_subtotal,
            })

        delivery_fee = Decimal(str(settings.DELIVERY_FEE))
        total = subtotal + delivery_fee

        order = Order.objects.create(
            **validated_data,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total=total,
            payment_method=payment_method,
        )

        for item in order_items:
            OrderItem.objects.create(order=order, **item)

        return order


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'full_name', 'email', 'phone',
            'address', 'city', 'state', 'country', 'order_notes',
            'subtotal', 'delivery_fee', 'total', 'status', 'payment_method',
            'payment_reference', 'is_paid', 'paid_at', 'items', 'created_at',
        ]


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'refund_amount', 'refund_reason']


class AdminOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'full_name', 'email', 'phone',
            'address', 'city', 'state', 'country', 'order_notes',
            'subtotal', 'delivery_fee', 'total', 'status', 'payment_method',
            'payment_reference', 'is_paid', 'paid_at', 'shipped_at', 'delivered_at',
            'cancelled_at', 'refund_amount', 'refund_reason', 'items', 'created_at', 'updated_at',
        ]
        read_only_fields = ['order_number', 'created_at', 'updated_at']
