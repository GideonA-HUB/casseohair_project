import os
from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management import call_command
from django.core.management.base import BaseCommand

from apps.products.models import Product
from apps.site_config.models import SiteSettings, Testimonial, WhyChooseItem


class Command(BaseCommand):
    help = 'Seed initial data for CasseoHair'

    def handle(self, *args, **options):
        # Always remove legacy hair-type categories that were auto-seeded in older deploys.
        call_command('cleanup_legacy_categories')

        if not User.objects.filter(username='admin').exists():
            admin_password = os.environ.get('ADMIN_INITIAL_PASSWORD', 'admin123!')
            User.objects.create_superuser(
                username='admin',
                email='admin@casseohair.com',
                password=admin_password,
            )
            self.stdout.write(self.style.SUCCESS('Admin user created (username: admin)'))
            if admin_password == 'admin123!':
                self.stdout.write(self.style.WARNING('Change the default admin password after first login.'))

        settings, _ = SiteSettings.objects.get_or_create(pk=1)
        settings.site_name = 'CasseoHair'
        settings.tagline = 'Luxury Hair & Wig E-Commerce'
        settings.meta_description = 'Premium luxury wigs and hair extensions. Authentic bone straight, pixel curls, deep wave, HD lace wigs and more.'
        settings.delivery_fee = Decimal('4000')
        settings.currency = 'NGN'
        settings.currency_symbol = '₦'
        settings.is_vat_inclusive = False
        settings.about_title = 'About CasseoHair'
        settings.brand_story = (
            'CasseoHair was born from a passion for authentic luxury hair. '
            'We source the finest wigs and extensions from Vietnam, Cambodia, India, and Burma, '
            'bringing world-class quality to discerning clients across Nigeria and beyond.'
        )
        settings.mission = 'To deliver authentic luxury hair that empowers every woman to feel confident, elegant, and beautiful.'
        settings.vision = 'To become Africa\'s most trusted luxury hair brand, rivaling international premium beauty houses.'
        settings.why_choose_title = 'Why Choose CasseoHair'
        settings.why_choose_subtitle = 'Authentic luxury hair, crafted for elegance'
        settings.contact_email = 'casseohair@gmail.com'
        settings.whatsapp_number = '+2348135380528'
        settings.instagram_url = 'https://www.instagram.com/casseohair?igsh=dHgxaG5maWVucXZl'
        settings.tiktok_url = 'https://www.tiktok.com/@casseo_hair?_r=1&_t=ZN-977lyQmMdao'
        settings.save()
        self.stdout.write(self.style.SUCCESS('Site settings configured'))

        self.stdout.write(
            self.style.WARNING(
                'Categories are managed in Django admin — no demo categories are seeded.'
            )
        )

        if Product.objects.exists():
            self.stdout.write('Products already exist, skipping product seed')
        else:
            self.stdout.write(
                'No products found. Add products in Django admin under your categories '
                '(Straight hairs, Curly Hairs, Wavy/Bouncy Hairs).'
            )

        if not WhyChooseItem.objects.exists():
            why_choose_data = [
                ('Authentic Luxury Hair', 'Genuine premium hair sourced from trusted global suppliers', 0),
                ('Global Sourcing', 'Vietnamese, Cambodian, Indian & Burmese premium collections', 1),
                ('Premium Lace', 'HD Lace, Transparent Lace & Swiss Lace craftsmanship', 2),
                ('Long Lifespan', 'Built to last with proper care and premium construction', 3),
                ('Effortless Elegance', 'Silky textures that move naturally with every step', 4),
                ('Fast Delivery', 'Swift nationwide delivery across Nigeria', 5),
                ('Natural Look', 'Undetectable lace and flawless hairlines every time', 6),
            ]
            for title, description, order in why_choose_data:
                WhyChooseItem.objects.create(
                    title=title,
                    description=description,
                    order=order,
                    is_active=True,
                )
            self.stdout.write(self.style.SUCCESS('Why Choose items created (upload images in Django admin)'))

        if not Testimonial.objects.exists():
            Testimonial.objects.create(
                name='Adaeze O.',
                role='Verified Buyer',
                content='The quality is absolutely stunning. My bone straight wig looks and feels incredibly natural. CasseoHair is the real deal!',
                rating=5,
                is_featured=True,
                order=1,
            )
            Testimonial.objects.create(
                name='Chioma M.',
                role='Loyal Customer',
                content='I\'ve tried many brands but nothing compares. The HD lace melts perfectly and the hair is so soft. Worth every naira.',
                rating=5,
                is_featured=True,
                order=2,
            )
            self.stdout.write(self.style.SUCCESS('Testimonials created'))

        self.stdout.write(self.style.SUCCESS('Seed complete!'))
