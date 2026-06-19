from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import AdminLoginView, AdminLogoutView, AdminProfileView, AdminMetricsView

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('logout/', AdminLogoutView.as_view(), name='admin-logout'),
    path('profile/', AdminProfileView.as_view(), name='admin-profile'),
    path('metrics/', AdminMetricsView.as_view(), name='admin-metrics'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
