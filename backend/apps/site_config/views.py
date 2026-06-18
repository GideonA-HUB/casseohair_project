from django.http import HttpResponse
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminUser
from apps.notifications.services import EmailService, NotificationService

from .models import (
    ContactSubmission,
    HeroImage,
    NewsletterSubscriber,
    SiteAsset,
    SiteSettings,
    Testimonial,
    WhyChooseItem,
)
from .serializers import (
    ContactSubmissionSerializer,
    HeroImageSerializer,
    NewsletterSubscribeSerializer,
    SiteAssetSerializer,
    SiteSettingsSerializer,
    TestimonialSerializer,
    WhyChooseItemSerializer,
)


class SiteSettingsView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        settings_obj = SiteSettings.get_settings()
        return Response(SiteSettingsSerializer(settings_obj, context={'request': request}).data)


class SiteAssetsView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        assets = SiteAsset.objects.filter(is_active=True)
        data = {}
        for asset in assets:
            request_ctx = {'request': request}
            serializer = SiteAssetSerializer(asset, context=request_ctx)
            data[asset.asset_type] = serializer.data
        return Response(data)


class TestimonialListView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = TestimonialSerializer
    pagination_class = None

    def get_queryset(self):
        return Testimonial.objects.filter(is_active=True, is_featured=True)


class WhyChooseListView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = WhyChooseItemSerializer
    pagination_class = None

    def get_queryset(self):
        return WhyChooseItem.objects.filter(is_active=True)[:7]


class HeroImagesView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = HeroImageSerializer
    pagination_class = None

    def get_queryset(self):
        return HeroImage.objects.filter(is_active=True)[:16]


class ContactSubmitView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = ContactSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()
        EmailService.send_contact_notification(submission)
        NotificationService.notify_contact_submission(submission)
        return Response({'message': 'Thank you for contacting us.'}, status=status.HTTP_201_CREATED)


class NewsletterSubscribeView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = NewsletterSubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = serializer.save()
        EmailService.send_newsletter_welcome(subscriber.email)
        return Response({'message': 'Successfully subscribed.'}, status=status.HTTP_201_CREATED)


class AdminContactListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ContactSubmissionSerializer
    queryset = ContactSubmission.objects.all()


class AdminNewsletterListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = NewsletterSubscribeSerializer
    queryset = NewsletterSubscriber.objects.filter(is_active=True)


class SitemapView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        from apps.products.models import Category, Product

        site_url = request.build_absolute_uri('/').rstrip('/')
        settings_obj = SiteSettings.get_settings()
        urls = [
            {'loc': site_url, 'changefreq': 'daily', 'priority': '1.0'},
            {'loc': f'{site_url}/shop', 'changefreq': 'daily', 'priority': '0.9'},
            {'loc': f'{site_url}/about', 'changefreq': 'monthly', 'priority': '0.7'},
            {'loc': f'{site_url}/contact', 'changefreq': 'monthly', 'priority': '0.7'},
        ]
        for cat in Category.objects.filter(is_active=True):
            urls.append({
                'loc': f'{site_url}/shop/category/{cat.slug}',
                'changefreq': 'weekly',
                'priority': '0.8',
            })
        for product in Product.objects.filter(is_active=True, is_archived=False):
            urls.append({
                'loc': f'{site_url}/product/{product.slug}',
                'changefreq': 'weekly',
                'priority': '0.8',
                'lastmod': product.updated_at.strftime('%Y-%m-%d'),
            })

        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        for entry in urls:
            xml += '  <url>\n'
            xml += f'    <loc>{entry["loc"]}</loc>\n'
            if entry.get('lastmod'):
                xml += f'    <lastmod>{entry["lastmod"]}</lastmod>\n'
            xml += f'    <changefreq>{entry["changefreq"]}</changefreq>\n'
            xml += f'    <priority>{entry["priority"]}</priority>\n'
            xml += '  </url>\n'
        xml += '</urlset>'

        return HttpResponse(xml, content_type='application/xml')


class RobotsTxtView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        site_url = request.build_absolute_uri('/').rstrip('/')
        content = f"""User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /admin-dashboard/

Sitemap: {site_url}/sitemap.xml
"""
        return HttpResponse(content, content_type='text/plain')
