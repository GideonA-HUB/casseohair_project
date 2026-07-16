from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_product_length_8_inches'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='density',
            field=models.CharField(
                blank=True,
                help_text='Hair weight in grams, e.g. 50g, 100g, 200g, 250g, 300g',
                max_length=50,
                verbose_name='Grams',
            ),
        ),
    ]
