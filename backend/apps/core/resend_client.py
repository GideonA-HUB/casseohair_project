import logging
import threading

from django.conf import settings
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)

BRAND_PINK = '#E62E72'
BRAND_PINK_DARK = '#801337'


def get_email_context(extra=None):
    """Build shared template context with site settings and social links."""
    from apps.site_config.models import SiteSettings

    site = SiteSettings.get_settings()
    site_url = getattr(settings, 'SITE_URL', 'https://www.casseohair.com').rstrip('/')
    ctx = {
        'site_name': getattr(settings, 'SITE_NAME', 'CasseoHair'),
        'site_url': site_url,
        'logo_url': f'{site_url}/logo.png',
        'brand_pink': BRAND_PINK,
        'brand_pink_dark': BRAND_PINK_DARK,
        'instagram_url': site.instagram_url or 'https://www.instagram.com/casseohair?igsh=dHgxaG5maWVucXZl',
        'tiktok_url': site.tiktok_url or 'https://www.tiktok.com/@casseo_hair',
        'contact_email': site.contact_email or 'casseohair@gmail.com',
        'whatsapp_url': 'https://wa.me/2348135380528',
    }
    if extra:
        ctx.update(extra)
    return ctx


def send_html_email(to, subject, template_name, context=None):
    """
    Send an HTML email via Resend API.
    Returns True on success, False if API key missing (dev).
    """
    recipients = [to] if isinstance(to, str) else list(to)

    if not settings.RESEND_API_KEY:
        logger.warning('[EMAIL SKIPPED] RESEND_API_KEY not set. To: %s | Subject: %s', recipients, subject)
        return False

    ctx = get_email_context(context)
    html = render_to_string(template_name, ctx)

    import resend

    resend.api_key = settings.RESEND_API_KEY
    resend.Emails.send({
        'from': settings.DEFAULT_FROM_EMAIL,
        'to': recipients,
        'subject': subject,
        'html': html,
    })
    logger.info('Email sent to %s: %s', recipients, subject)
    return True


def send_html_email_async(to, subject, template_name, context=None):
    """Fire-and-forget email send so API responses are not blocked."""

    def _worker():
        try:
            send_html_email(to, subject, template_name, context)
        except Exception:
            logger.exception('Async email failed. To: %s | Subject: %s', to, subject)

    threading.Thread(target=_worker, daemon=True).start()
