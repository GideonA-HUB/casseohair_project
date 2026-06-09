from django.urls import path

from .views import (
    AdminContactListView,
    AdminNewsletterListView,
    ContactSubmitView,
    NewsletterSubscribeView,
    SiteAssetsView,
    SiteSettingsView,
    TestimonialListView,
)

urlpatterns = [
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('assets/', SiteAssetsView.as_view(), name='site-assets'),
    path('testimonials/', TestimonialListView.as_view(), name='testimonials'),
    path('contact/', ContactSubmitView.as_view(), name='contact-submit'),
    path('newsletter/', NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),
    path('admin/contacts/', AdminContactListView.as_view(), name='admin-contacts'),
    path('admin/newsletter/', AdminNewsletterListView.as_view(), name='admin-newsletter'),
]
