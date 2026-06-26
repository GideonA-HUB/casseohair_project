# Generated migration for terms agreement fields on Order

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='agreed_to_terms',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='order',
            name='terms_agreed_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
