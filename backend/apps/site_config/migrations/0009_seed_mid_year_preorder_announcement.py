from datetime import date

from django.db import migrations


DEFAULT_MARQUEE = (
    'CasseoHair presents Mid Year Preorder Sales — bringing factory prices to your doorstep '
    'with 30% off website orders, 20% off WhatsApp orders, and free wigging. '
    'Running July 20th – 25th, 2026. Please read our Terms of Service before ordering.'
)


def seed_mid_year_preorder(apps, schema_editor):
    SaleAnnouncement = apps.get_model('site_config', 'SaleAnnouncement')
    if SaleAnnouncement.objects.exists():
        return
    SaleAnnouncement.objects.create(
        title='Mid Year Preorder Sales',
        badge_text='PREORDER SALE',
        headline='Bringing factory prices to your doorstep',
        offer_website='30% OFF WEBSITE ORDERS',
        offer_whatsapp='20% OFF WHATSAPP ORDERS',
        offer_extra='FREE WIGGING',
        marquee_text=DEFAULT_MARQUEE,
        cta_label='Shop the Sale',
        cta_url='/shop',
        start_date=date(2026, 7, 20),
        end_date=date(2026, 7, 25),
        is_active=True,
        order=0,
    )


def unseed(apps, schema_editor):
    SaleAnnouncement = apps.get_model('site_config', 'SaleAnnouncement')
    SaleAnnouncement.objects.filter(title='Mid Year Preorder Sales').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('site_config', '0008_sale_announcement'),
    ]

    operations = [
        migrations.RunPython(seed_mid_year_preorder, unseed),
    ]
