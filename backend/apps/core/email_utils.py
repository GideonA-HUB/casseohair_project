from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_order_confirmation_email(order):
    """
    Send order confirmation email to customer
    """
    subject = f"Order Confirmation - {order.order_number}"
    
    context = {
        'order': order,
        'order_items': order.items.all(),
        'site_name': settings.SITE_NAME,
        'site_url': settings.SITE_URL,
        'brand_pink': '#E62E72',
    }
    
    html_message = render_to_string('emails/order_confirmation.html', context)
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_order_notification_email(order):
    """
    Send order notification email to admin/owner
    """
    subject = f"New Order Received - {order.order_number}"
    
    context = {
        'order': order,
        'order_items': order.items.all(),
        'site_name': settings.SITE_NAME,
        'site_url': settings.SITE_URL,
        'admin_email': settings.ADMIN_EMAIL,
        'brand_pink': '#E62E72',
    }
    
    html_message = render_to_string('emails/order_notification.html', context)
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL],
        html_message=html_message,
        fail_silently=False,
    )


def send_newsletter_confirmation_email(subscription):
    """
    Send newsletter subscription confirmation email
    """
    subject = f"Welcome to {settings.SITE_NAME} Newsletter"
    
    context = {
        'subscription': subscription,
        'site_name': settings.SITE_NAME,
        'site_url': settings.SITE_URL,
        'brand_pink': '#E62E72',
    }
    
    html_message = render_to_string('emails/newsletter_confirmation.html', context)
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[subscription.email],
        html_message=html_message,
        fail_silently=False,
    )
