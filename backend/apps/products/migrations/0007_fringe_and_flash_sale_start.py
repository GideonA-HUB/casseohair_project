from django.db import migrations, models
import django.utils.timezone


def seed_flash_sale_start(apps, schema_editor):
    Product = apps.get_model('products', 'Product')
    now = django.utils.timezone.now()
    Product.objects.filter(
        is_flash_sale=True,
        flash_sale_start_at__isnull=True,
    ).update(flash_sale_start_at=now)


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0006_rename_density_to_grams_label'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='flash_sale_start_at',
            field=models.DateTimeField(
                blank=True,
                help_text='When this product’s flash sale becomes active on the storefront.',
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name='product',
            name='flash_sale_end_at',
            field=models.DateTimeField(
                blank=True,
                help_text='When this product’s flash sale ends on the storefront.',
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name='product',
            name='lace_type',
            field=models.CharField(
                blank=True,
                choices=[
                    ('hd_lace', 'HD Lace'),
                    ('transparent_lace', 'Transparent Lace'),
                    ('swiss_lace', 'Swiss Lace'),
                    ('frontal', 'Frontal'),
                    ('closure', 'Closure'),
                    ('fringe', 'Fringe'),
                    ('full_lace', 'Full Lace'),
                    ('glueless', 'Glueless'),
                    ('none', 'None'),
                ],
                max_length=30,
            ),
        ),
        migrations.RunPython(seed_flash_sale_start, migrations.RunPython.noop),
    ]
