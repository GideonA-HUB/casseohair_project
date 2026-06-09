from django.conf import settings

from apps.orders.models import Order

from .models import Notification


class EmailService:
    @staticmethod
    def _send(to: str, subject: str, html: str):
        if not settings.RESEND_API_KEY:
            print(f'[EMAIL] To: {to} | Subject: {subject}')
            return
        try:
            import resend
            resend.api_key = settings.RESEND_API_KEY
            resend.Emails.send({
                'from': settings.DEFAULT_FROM_EMAIL,
                'to': [to],
                'subject': subject,
                'html': html,
            })
        except Exception as e:
            print(f'Email send failed: {e}')

    @classmethod
    def send_order_received(cls, order: Order):
        items_html = ''.join(
            f'<tr><td>{item.product_name}</td><td>{item.quantity}</td>'
            f'<td>₦{item.subtotal:,.2f}</td></tr>'
            for item in order.items.all()
        )
        html = f'''
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#E62E72;">Order Received - {order.order_number}</h2>
            <p>Dear {order.full_name},</p>
            <p>Thank you for your order at CasseoHair. We have received your order.</p>
            <table style="width:100%;border-collapse:collapse;">
                <tr style="background:#F8F8F8;"><th>Product</th><th>Qty</th><th>Subtotal</th></tr>
                {items_html}
            </table>
            <p><strong>Subtotal:</strong> ₦{order.subtotal:,.2f}</p>
            <p><strong>Delivery:</strong> ₦{order.delivery_fee:,.2f}</p>
            <p><strong>Total:</strong> ₦{order.total:,.2f}</p>
            <p style="color:#E62E72;">Luxury Hair, Delivered with Care.</p>
        </div>
        '''
        cls._send(order.email, f'Order Received - {order.order_number}', html)

    @classmethod
    def send_payment_success(cls, order: Order):
        html = f'''
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#E62E72;">Payment Successful - {order.order_number}</h2>
            <p>Dear {order.full_name},</p>
            <p>Your payment of ₦{order.total:,.2f} has been confirmed.</p>
            <p>We are now processing your luxury hair order.</p>
            <p style="color:#E62E72;">Thank you for choosing CasseoHair.</p>
        </div>
        '''
        cls._send(order.email, f'Payment Successful - {order.order_number}', html)

    @classmethod
    def send_order_confirmed(cls, order: Order):
        html = f'''
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#E62E72;">Order Confirmed - {order.order_number}</h2>
            <p>Dear {order.full_name},</p>
            <p>Your order has been confirmed and is being prepared with care.</p>
        </div>
        '''
        cls._send(order.email, f'Order Confirmed - {order.order_number}', html)

    @classmethod
    def send_order_delivered(cls, order: Order):
        html = f'''
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#E62E72;">Order Delivered - {order.order_number}</h2>
            <p>Dear {order.full_name},</p>
            <p>Your luxury hair order has been delivered. Enjoy your new look!</p>
        </div>
        '''
        cls._send(order.email, f'Order Delivered - {order.order_number}', html)

    @classmethod
    def send_contact_notification(cls, submission):
        html = f'''
        <p><strong>Name:</strong> {submission.name}</p>
        <p><strong>Email:</strong> {submission.email}</p>
        <p><strong>Phone:</strong> {submission.phone}</p>
        <p><strong>Message:</strong> {submission.message}</p>
        '''
        cls._send(settings.ADMIN_EMAIL, f'New Contact: {submission.name}', html)

    @classmethod
    def send_newsletter_welcome(cls, email: str):
        html = '''
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#E62E72;">Welcome to CasseoHair</h2>
            <p>Thank you for subscribing to our newsletter. Stay tuned for exclusive luxury hair collections.</p>
        </div>
        '''
        cls._send(email, 'Welcome to CasseoHair Newsletter', html)

    @classmethod
    def notify_admin_new_order(cls, order: Order):
        html = f'''
        <h2>New Order: {order.order_number}</h2>
        <p>Customer: {order.full_name}</p>
        <p>Total: ₦{order.total:,.2f}</p>
        '''
        cls._send(settings.ADMIN_EMAIL, f'New Order - {order.order_number}', html)


class NotificationService:
    LARGE_ORDER_THRESHOLD = 500000

    @classmethod
    def notify_new_order(cls, order: Order):
        Notification.objects.create(
            notification_type='new_order',
            title=f'New Order: {order.order_number}',
            message=f'{order.full_name} placed an order worth ₦{order.total:,.2f}',
            related_order=order,
            metadata={'total': str(order.total)},
        )
        EmailService.notify_admin_new_order(order)

        if order.total >= cls.LARGE_ORDER_THRESHOLD:
            cls.notify_large_order(order)

    @classmethod
    def notify_payment_received(cls, order: Order):
        Notification.objects.create(
            notification_type='payment_received',
            title=f'Payment Received: {order.order_number}',
            message=f'Payment of ₦{order.total:,.2f} confirmed for {order.full_name}',
            related_order=order,
        )

    @classmethod
    def notify_large_order(cls, order: Order):
        Notification.objects.create(
            notification_type='large_order',
            title=f'Large Order Alert: {order.order_number}',
            message=f'High-value order of ₦{order.total:,.2f} from {order.full_name}',
            related_order=order,
        )

    @classmethod
    def notify_order_status_change(cls, order: Order):
        if order.status == 'confirmed':
            EmailService.send_order_confirmed(order)
        elif order.status == 'delivered':
            EmailService.send_order_delivered(order)

    @classmethod
    def notify_contact_submission(cls, submission):
        Notification.objects.create(
            notification_type='contact_submission',
            title=f'New Contact: {submission.name}',
            message=submission.message[:200],
        )
