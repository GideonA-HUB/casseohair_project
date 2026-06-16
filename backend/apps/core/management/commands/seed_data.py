import os
from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from apps.products.models import Category, Product
from apps.site_config.models import SiteSettings, Testimonial, WhyChooseItem


class Command(BaseCommand):
    help = 'Seed initial data for CasseoHair'

    def handle(self, *args, **options):
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

        categories_data = [
            'Bone Straight', 'Pixel Curls', 'Deep Wave', 'Water Wave',
            'Body Wave', 'Kinky Curly', 'Jerry Curl', 'HD Lace Wigs',
            'Raw Vietnamese Hair', 'Raw Indian Hair',
        ]

        for i, name in enumerate(categories_data):
            Category.objects.get_or_create(
                name=name,
                defaults={'order': i, 'is_featured': i < 3},
            )
        self.stdout.write(self.style.SUCCESS(f'{len(categories_data)} categories created'))

        if Product.objects.exists():
            self.stdout.write('Products already exist, skipping product seed')
        else:
            bone_straight = Category.objects.get(name='Bone Straight')
            products = [
                {
                    'name': 'Luxury Vietnamese Bone Straight 20"',
                    'price': Decimal('185000'),
                    'length': '20',
                    'lace_type': 'hd_lace',
                    'density': '200%',
                    'is_featured': True,
                    'is_bestseller': True,
                    'category': bone_straight,
                },
                {
                    'name': 'Premium Pixel Curls 18"',
                    'price': Decimal('220000'),
                    'sale_price': Decimal('195000'),
                    'length': '18',
                    'lace_type': 'transparent_lace',
                    'density': '180%',
                    'is_new_arrival': True,
                    'is_featured': True,
                    'category': Category.objects.get(name='Pixel Curls'),
                },
                {
                    'name': 'Deep Wave HD Lace Frontal 22"',
                    'price': Decimal('250000'),
                    'length': '22',
                    'lace_type': 'frontal',
                    'density': '250%',
                    'is_bestseller': True,
                    'category': Category.objects.get(name='Deep Wave'),
                },
                {
                    'name': 'Raw Indian Hair Body Wave 24"',
                    'price': Decimal('175000'),
                    'length': '24',
                    'lace_type': 'closure',
                    'density': '200%',
                    'is_new_arrival': True,
                    'category': Category.objects.get(name='Body Wave'),
                },
            ]

            for p in products:
                Product.objects.create(
                    description=f'Premium luxury {p["name"]}. Sourced globally, crafted for elegance.',
                    short_description=f'Authentic luxury hair - {p["name"]}',
                    stock=15,
                    color='Natural Black',
                    **p,
                )
            self.stdout.write(self.style.SUCCESS(f'{len(products)} sample products created'))

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
