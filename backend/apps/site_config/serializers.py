from rest_framework import serializers

from apps.core.media import absolute_media_url

from .models import ContactSubmission, HeroImage, NewsletterSubscriber, SiteAsset, SiteSettings, Testimonial


class SiteAssetSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = SiteAsset
        fields = ['id', 'asset_type', 'image', 'alt_text', 'is_active']

    def get_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            'site_name', 'tagline', 'meta_description', 'meta_keywords',
            'contact_email', 'contact_phone', 'whatsapp_number', 'address',
            'instagram_url', 'facebook_url', 'twitter_url', 'tiktok_url', 'youtube_url',
            'about_title', 'about_content', 'mission', 'vision', 'brand_story',
            'privacy_policy', 'terms_of_service', 'refund_policy',
            'delivery_fee', 'currency', 'currency_symbol',
            'is_vat_inclusive', 'vat_rate', 'instagram_feed_enabled',
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    company_logo = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'role', 'content', 'rating', 'image', 'company_logo']

    def get_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)

    def get_company_logo(self, obj):
        return absolute_media_url(self.context.get('request'), obj.company_logo)


class HeroImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = HeroImage
        fields = ['id', 'image', 'alt_text', 'order', 'is_active']

    def get_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['name', 'email', 'phone', 'message']


class NewsletterSubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['email']

    def create(self, validated_data):
        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=validated_data['email'],
            defaults={'is_active': True},
        )
        if not created and not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save()
        return subscriber
