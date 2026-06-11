from django.contrib import admin
from django.utils.html import format_html

from .models import (
    AdminActivityLog,
    ContactSubmission,
    HeroImage,
    NewsletterSubscriber,
    SiteAsset,
    SiteSettings,
    Testimonial,
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
        ('About', {'fields': ('about_title', 'about_content', 'mission', 'vision', 'brand_story')}),
        ('Policies', {'fields': ('privacy_policy', 'terms_of_service', 'refund_policy')}),
        ('Commerce', {'fields': ('delivery_fee', 'currency', 'currency_symbol', 'is_vat_inclusive', 'vat_rate')}),
        ('Instagram Feed', {'fields': ('instagram_feed_enabled', 'instagram_access_token')}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'rating', 'is_featured', 'is_active', 'order']
    list_filter = ['is_featured', 'is_active']
    list_editable = ['order', 'is_active', 'is_featured']


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
