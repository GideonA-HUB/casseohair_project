import uuid

import requests
from django.conf import settings
from django.utils import timezone

from apps.core.email_utils import send_payment_confirmation_email
from apps.notifications.services import NotificationService
from apps.orders.models import Order

from .models import Payment


class PaystackService:
    BASE_URL = 'https://api.paystack.co'

    @classmethod
    def initialize_payment(cls, order: Order, callback_url: str) -> dict:
        reference = f'CH-PS-{uuid.uuid4().hex[:12].upper()}'
        payment = Payment.objects.create(
            order=order,
            provider='paystack',
            reference=reference,
            amount=order.total,
            currency='NGN',
        )

        headers = {
            'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
            'Content-Type': 'application/json',
        }
        payload = {
            'email': order.email,
            'amount': int(order.total * 100),
            'reference': reference,
            'callback_url': callback_url,
            'metadata': {
                'order_number': order.order_number,
                'custom_fields': [
                    {'display_name': 'Order Number', 'variable_name': 'order_number', 'value': order.order_number},
                ],
            },
        }

        response = requests.post(f'{cls.BASE_URL}/transaction/initialize', json=payload, headers=headers, timeout=30)
        data = response.json()

        if data.get('status'):
            payment.provider_response = data
            payment.save()
            return {
                'authorization_url': data['data']['authorization_url'],
                'reference': reference,
                'access_code': data['data']['access_code'],
            }
        payment.status = 'failed'
        payment.provider_response = data
        payment.save()
        raise ValueError(data.get('message', 'Payment initialization failed'))

    @classmethod
    def verify_payment(cls, reference: str) -> Payment:
        headers = {'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}'}
        response = requests.get(f'{cls.BASE_URL}/transaction/verify/{reference}', headers=headers, timeout=30)
        data = response.json()

        try:
            payment = Payment.objects.select_related('order').get(reference=reference)
        except Payment.DoesNotExist:
            raise ValueError('Payment not found')

        payment.provider_response = data

        if data.get('status') and data['data']['status'] == 'success':
            payment.status = 'success'
            payment.verified_at = timezone.now()
            payment.save()
            cls._complete_order(payment)
        else:
            payment.status = 'failed'
            payment.save()

        return payment

    @classmethod
    def _complete_order(cls, payment: Payment):
        order = payment.order
        if order.is_paid:
            return

        order.is_paid = True
        order.status = 'paid'
        order.payment_reference = payment.reference
        order.paid_at = timezone.now()
        order.save()

        for item in order.items.select_related('product'):
            if item.product:
                item.product.stock = max(0, item.product.stock - item.quantity)
                item.product.save(update_fields=['stock'])

        send_payment_confirmation_email(order)
        NotificationService.notify_payment_received(order)


class FlutterwaveService:
    BASE_URL = 'https://api.flutterwave.com/v3'

    @classmethod
    def initialize_payment(cls, order: Order, callback_url: str) -> dict:
        reference = f'CH-FW-{uuid.uuid4().hex[:12].upper()}'
        payment = Payment.objects.create(
            order=order,
            provider='flutterwave',
            reference=reference,
            amount=order.total,
            currency='NGN',
        )

        headers = {
            'Authorization': f'Bearer {settings.FLUTTERWAVE_SECRET_KEY}',
            'Content-Type': 'application/json',
        }
        payload = {
            'tx_ref': reference,
            'amount': str(order.total),
            'currency': 'NGN',
            'redirect_url': callback_url,
            'customer': {
                'email': order.email,
                'phonenumber': order.phone,
                'name': order.full_name,
            },
            'customizations': {
                'title': settings.SITE_NAME,
                'description': f'Order {order.order_number}',
            },
            'meta': {'order_number': order.order_number},
        }

        response = requests.post(f'{cls.BASE_URL}/payments', json=payload, headers=headers, timeout=30)
        data = response.json()

        if data.get('status') == 'success':
            payment.provider_response = data
            payment.save()
            return {
                'authorization_url': data['data']['link'],
                'reference': reference,
            }
        payment.status = 'failed'
        payment.provider_response = data
        payment.save()
        raise ValueError(data.get('message', 'Payment initialization failed'))

    @classmethod
    def verify_payment(cls, reference: str) -> Payment:
        headers = {'Authorization': f'Bearer {settings.FLUTTERWAVE_SECRET_KEY}'}
        response = requests.get(
            f'{cls.BASE_URL}/transactions/verify_by_reference?tx_ref={reference}',
            headers=headers,
            timeout=30,
        )
        data = response.json()

        try:
            payment = Payment.objects.select_related('order').get(reference=reference)
        except Payment.DoesNotExist:
            raise ValueError('Payment not found')

        payment.provider_response = data

        if data.get('status') == 'success' and data['data']['status'] == 'successful':
            payment.status = 'success'
            payment.verified_at = timezone.now()
            payment.save()
            flw_ref = data.get('data', {}).get('flw_ref') or data.get('data', {}).get('id')
            if flw_ref:
                payment.reference = str(flw_ref)
                payment.save(update_fields=['reference'])
            PaystackService._complete_order(payment)
        else:
            payment.status = 'failed'
            payment.save()

        return payment
