from decimal import Decimal

from django.db import migrations, models


def set_international_delivery_fee(apps, schema_editor):
    CurrencySettings = apps.get_model('site_config', 'CurrencySettings')
    CurrencySettings.objects.filter(pk=1).update(international_delivery_fee=Decimal('50000'))


class Migration(migrations.Migration):

    dependencies = [
        ('site_config', '0006_currencysettings'),
    ]

    operations = [
        migrations.AlterField(
            model_name='currencysettings',
            name='international_delivery_fee',
            field=models.DecimalField(
                decimal_places=2,
                default=50000,
                help_text='Flat delivery fee for US, UK, and Canada orders (NGN)',
                max_digits=10,
            ),
        ),
        migrations.RunPython(set_international_delivery_fee, migrations.RunPython.noop),
    ]
