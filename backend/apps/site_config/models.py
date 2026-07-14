from django.db import models


class SiteAsset(models.Model):
    ASSET_TYPES = [
        ('favicon', 'Favicon'),
        ('logo', 'Logo'),
        ('logo_light', 'Logo Light'),
        ('logo_dark', 'Logo Dark'),
        ('hero_banner', 'Hero Banner'),
        ('about_image', 'About Image'),
    ]

    asset_type = models.CharField(max_length=20, choices=ASSET_TYPES, unique=True)
    image = models.ImageField(upload_to='site_assets/')
    alt_text = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Asset'
        verbose_name_plural = 'Site Assets'

    def __str__(self):
        return f'{self.get_asset_type_display()}'


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default='CasseoHair')
    tagline = models.CharField(max_length=255, default='Luxury Hair & Wig E-Commerce')
    meta_description = models.TextField(blank=True)
    meta_keywords = models.TextField(blank=True)
    contact_email = models.EmailField(default='contact@casseohair.com')
    contact_phone = models.CharField(max_length=20, blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    instagram_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    tiktok_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    about_title = models.CharField(max_length=255, blank=True)
    about_subtitle = models.CharField(
        max_length=255,
        blank=True,
        default='Luxury Hair, Delivered with Care',
        help_text='Subtitle shown below the About page heading',
    )
    about_content = models.TextField(blank=True)
    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    brand_story = models.TextField(blank=True)
    ceo_name = models.CharField(max_length=120, blank=True, help_text='CEO / Founder display name')
    ceo_title = models.CharField(max_length=120, blank=True, default='Founder & CEO')
    ceo_bio = models.TextField(blank=True, help_text='Short biography shown on the About page')
    ceo_photo = models.ImageField(upload_to='about/', blank=True, null=True)
    privacy_policy = models.TextField(blank=True)
    terms_of_service = models.TextField(blank=True)
    refund_policy = models.TextField(blank=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=4000)
    currency = models.CharField(max_length=3, default='NGN')
    currency_symbol = models.CharField(max_length=5, default='₦')
    is_vat_inclusive = models.BooleanField(default=False)
    vat_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    instagram_feed_enabled = models.BooleanField(default=False)
    instagram_access_token = models.CharField(max_length=500, blank=True)
    why_choose_title = models.CharField(max_length=255, default='Why Choose CasseoHair')
    why_choose_subtitle = models.CharField(
        max_length=500,
        blank=True,
        default='Authentic luxury hair, crafted for elegance',
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class CurrencySettings(models.Model):
    """Singleton FX rates and delivery fees — base prices are always in NGN."""

    ngn_per_usd = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        default=1450,
        help_text='NGN per 1 USD (e.g. 1450 means $1 = ₦1,450)',
    )
    ngn_per_gbp = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        default=1920,
        help_text='NGN per 1 GBP (e.g. 1920 means £1 = ₦1,920)',
    )
    ngn_per_cad = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        default=1100,
        help_text='NGN per 1 CAD (e.g. 1100 means C$1 = ₦1,100)',
    )
    local_delivery_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=4000,
        help_text='Flat delivery fee for orders within Nigeria (NGN)',
    )
    international_delivery_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=50000,
        help_text='Flat delivery fee for US, UK, and Canada orders (NGN)',
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Store currency & FX'
        verbose_name_plural = 'Store currency & FX'

    def __str__(self):
        return 'Store currency & FX'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    company_logo = models.ImageField(upload_to='testimonials/logos/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.name


class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} - {self.email}'


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email


class WhyChooseItem(models.Model):
    """Homepage parallax feature card — up to 7 items, managed in Django admin."""
    title = models.CharField(max_length=120)
    description = models.TextField()
    image = models.ImageField(upload_to='why_choose/', blank=True, null=True)
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(
        default=0,
        help_text='Display order in parallax (0 = first layer, max 6)',
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Why Choose Item'
        verbose_name_plural = 'Why Choose Items'

    def __str__(self):
        return self.title


class HeroImage(models.Model):
    image = models.ImageField(upload_to='hero_images/')
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Hero Image'
        verbose_name_plural = 'Hero Images'

    def __str__(self):
        return f'Hero Image {self.order}'


class AdminActivityLog(models.Model):
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('status_change', 'Status Change'),
    ]

    user = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=100, blank=True)
    object_id = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} - {self.action} - {self.created_at}'


class SaleAnnouncement(models.Model):
    """Homepage sale / preorder announcement — images and copy managed in Django admin."""

    title = models.CharField(max_length=120, default='Mid Year Preorder Sales')
    badge_text = models.CharField(max_length=80, blank=True, default='PREORDER SALE')
    headline = models.CharField(
        max_length=160,
        blank=True,
        default='Bringing factory prices to your doorstep',
    )
    offer_website = models.CharField(max_length=80, blank=True, default='30% OFF WEBSITE ORDERS')
    offer_whatsapp = models.CharField(max_length=80, blank=True, default='20% OFF WHATSAPP ORDERS')
    offer_extra = models.CharField(max_length=80, blank=True, default='FREE WIGGING')
    marquee_text = models.TextField(
        default=(
            'CasseoHair presents Mid Year Preorder Sales — bringing factory prices to your doorstep '
            'with 30% off website orders, 20% off WhatsApp orders, and free wigging. '
            'Running July 20th – 25th, 2026. Please read our Terms of Service before ordering.'
        ),
        help_text='Continuous scrolling announcement text shown on the homepage banner.',
    )
    megaphone_image = models.ImageField(
        upload_to='announcements/',
        blank=True,
        null=True,
        help_text='Optional megaphone / shout graphic (left side on desktop).',
    )
    poster_image = models.ImageField(
        upload_to='announcements/',
        blank=True,
        null=True,
        help_text='Optional sale poster graphic (right side / mobile hero).',
    )
    cta_label = models.CharField(max_length=60, blank=True, default='Shop Preorder Looks')
    cta_url = models.CharField(max_length=255, blank=True, default='/shop')
    start_date = models.DateField(null=True, blank=True, help_text='Sale start date (e.g. July 20, 2026)')
    end_date = models.DateField(null=True, blank=True, help_text='Sale end date (e.g. July 25, 2026)')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text='Lower numbers appear first when several are active.')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-updated_at']
        verbose_name = 'Sale announcement'
        verbose_name_plural = 'Sale announcements'

    def __str__(self):
        return self.title

