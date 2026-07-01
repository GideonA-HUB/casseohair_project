from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0004_category_image_optional'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='length',
            field=models.CharField(
                blank=True,
                choices=[
                    ('8', '8"'), ('10', '10"'), ('12', '12"'), ('14', '14"'), ('16', '16"'),
                    ('18', '18"'), ('20', '20"'), ('22', '22"'), ('24', '24"'),
                    ('26', '26"'), ('28', '28"'), ('30', '30"'), ('32', '32"'),
                    ('34', '34"'), ('36', '36"'), ('40', '40"'),
                ],
                max_length=5,
            ),
        ),
    ]
