from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('site_config', '0004_whychooseitem_sitesettings_why_choose_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesettings',
            name='about_subtitle',
            field=models.CharField(
                blank=True,
                default='Luxury Hair, Delivered with Care',
                help_text='Subtitle shown below the About page heading',
                max_length=255,
            ),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='ceo_bio',
            field=models.TextField(blank=True, help_text='Short biography shown on the About page'),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='ceo_name',
            field=models.CharField(blank=True, help_text='CEO / Founder display name', max_length=120),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='ceo_photo',
            field=models.ImageField(blank=True, null=True, upload_to='about/'),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='ceo_title',
            field=models.CharField(blank=True, default='Founder & CEO', max_length=120),
        ),
    ]
