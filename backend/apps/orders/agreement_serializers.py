from rest_framework import serializers

from .models import Order


class TermsAgreementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'full_name', 'email', 'phone',
            'agreed_to_terms', 'terms_agreed_at', 'total', 'status', 'created_at',
        ]
