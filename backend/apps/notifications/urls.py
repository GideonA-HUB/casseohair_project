from django.urls import path

from .views import (
    AdminNotificationListView,
    AdminNotificationMarkAllReadView,
    AdminNotificationMarkReadView,
    AdminUnreadCountView,
)

urlpatterns = [
    path('admin/list/', AdminNotificationListView.as_view(), name='admin-notifications'),
    path('admin/unread-count/', AdminUnreadCountView.as_view(), name='admin-unread-count'),
    path('admin/<int:pk>/read/', AdminNotificationMarkReadView.as_view(), name='admin-notification-read'),
    path('admin/mark-all-read/', AdminNotificationMarkAllReadView.as_view(), name='admin-mark-all-read'),
]
