from django.contrib import admin
from django.utils.html import format_html

from .models import (
    AdminActivityLog,
    ContactSubmission,
    HeroImage,
    NewsletterSubscriber,
    SiteAsset,
    SiteSettings,
    CurrencySettings,
    SaleAnnouncement,
    Testimonial,
    WhyChooseItem,
)


@admin.register(SiteAsset)
class SiteAssetAdmin(admin.ModelAdmin):
    list_display = ['asset_type', 'preview', 'is_active', 'updated_at']
    list_filter = ['asset_type', 'is_active']

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:40px;" />', obj.image.url)
        return '-'
    preview.short_description = 'Preview'


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('General', {'fields': ('site_name', 'tagline', 'meta_description', 'meta_keywords')}),
        ('Contact', {'fields': ('contact_email', 'contact_phone', 'whatsapp_number', 'address')}),
        ('Social Media', {'fields': ('instagram_url', 'facebook_url', 'twitter_url', 'tiktok_url', 'youtube_url')}),
        ('About Page', {
            'fields': (
                'about_title', 'about_subtitle', 'brand_story', 'about_content',
                'mission', 'vision',
                'ceo_name', 'ceo_title', 'ceo_bio', 'ceo_photo',
            ),
            'description': 'All content displayed on the public About page (/about).',
        }),
        ('Policies', {'fields': ('privacy_policy', 'terms_of_service', 'refund_policy')}),
        ('Commerce', {'fields': ('delivery_fee', 'currency', 'currency_symbol', 'is_vat_inclusive', 'vat_rate')}),
        ('Instagram Feed', {'fields': ('instagram_feed_enabled', 'instagram_access_token')}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(CurrencySettings)
class CurrencySettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Exchange rates (NGN base)', {
            'fields': ('ngn_per_usd', 'ngn_per_gbp', 'ngn_per_cad'),
            'description': 'All product prices are stored in NGN. These rates convert NGN to international currencies.',
        }),
        ('Delivery fees (NGN)', {
            'fields': ('local_delivery_fee', 'international_delivery_fee'),
            'description': 'Local fee applies to Nigeria. International fee applies to US, UK, and Canada.',
        }),
        ('Meta', {'fields': ('updated_at',)}),
    )
    readonly_fields = ['updated_at']

    def has_add_permission(self, request):
        return not CurrencySettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'rating', 'is_featured', 'is_active', 'order']
    list_filter = ['is_featured', 'is_active']
    list_editable = ['order', 'is_active', 'is_featured']


@admin.register(WhyChooseItem)
class WhyChooseItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'preview', 'order', 'is_active', 'updated_at']
    list_filter = ['is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'description']
    fieldsets = (
        (None, {'fields': ('title', 'description', 'image', 'alt_text')}),
        ('Display', {'fields': ('order', 'is_active')}),
    )

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:48px;border-radius:6px;" />', obj.image.url)
        return '-'
    preview.short_description = 'Preview'


@admin.register(HeroImage)
class HeroImageAdmin(admin.ModelAdmin):
    list_display = ['preview', 'alt_text', 'order', 'is_active', 'updated_at']
    list_filter = ['is_active']
    list_editable = ['order', 'is_active']

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:40px;" />', obj.image.url)
        return '-'
    preview.short_description = 'Preview'


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['name', 'email', 'phone', 'message', 'created_at']


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'is_active', 'subscribed_at']
    list_filter = ['is_active']
    search_fields = ['email']


@admin.register(AdminActivityLog)
class AdminActivityLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'model_name', 'created_at']
    list_filter = ['action', 'created_at']
    readonly_fields = ['user', 'action', 'model_name', 'object_id', 'description', 'ip_address', 'created_at']


@admin.register(SaleAnnouncement)
class SaleAnnouncementAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'badge_text', 'start_date', 'end_date',
        'is_active', 'order', 'updated_at',
    ]
    list_filter = ['is_active', 'start_date', 'end_date']
    list_editable = ['is_active', 'order']
    search_fields = ['title', 'headline', 'marquee_text']
    fieldsets = (
        ('Visibility', {
            'fields': ('is_active', 'order', 'start_date', 'end_date'),
            'description': 'Inactive announcements are hidden. Optional dates auto-hide outside the sale window.',
        }),
        ('Copy', {
            'fields': (
                'title', 'badge_text', 'headline',
                'offer_website', 'offer_whatsapp', 'offer_extra',
                'marquee_text',
            ),
        }),
        ('Images', {
            'fields': ('megaphone_image', 'poster_image'),
            'description': 'Upload the megaphone graphic and/or the preorder poster. Leave blank to use site defaults.',
        }),
        ('Call to action', {
            'fields': ('cta_label', 'cta_url'),
        }),
    )
