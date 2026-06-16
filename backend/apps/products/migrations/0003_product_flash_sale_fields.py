from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('products', '0002_productreview'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='flash_sale_end_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='is_flash_sale',
            field=models.BooleanField(default=False),
        ),
    ]
