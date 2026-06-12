from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('site_config', '0003_testimonial_company_logo'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesettings',
            name='why_choose_subtitle',
            field=models.CharField(
                blank=True,
                default='Authentic luxury hair, crafted for elegance',
                max_length=500,
            ),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='why_choose_title',
            field=models.CharField(default='Why Choose CasseoHair', max_length=255),
        ),
        migrations.CreateModel(
            name='WhyChooseItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=120)),
                ('description', models.TextField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='why_choose/')),
                ('alt_text', models.CharField(blank=True, max_length=255)),
                ('order', models.PositiveIntegerField(default=0, help_text='Display order in parallax (0 = first layer, max 6)')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Why Choose Item',
                'verbose_name_plural': 'Why Choose Items',
                'ordering': ['order', 'created_at'],
            },
        ),
    ]
