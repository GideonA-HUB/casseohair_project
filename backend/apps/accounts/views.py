from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.site_config.models import AdminActivityLog

from .permissions import IsAdminUser
from .serializers import AdminLoginSerializer, AdminUserSerializer


class AdminLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        AdminActivityLog.objects.create(
            user=user,
            action='login',
            description='Admin login',
            ip_address=self._get_client_ip(request),
        )
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': AdminUserSerializer(user).data,
        })

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')


class AdminProfileView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response(AdminUserSerializer(request.user).data)


class AdminLogoutView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        AdminActivityLog.objects.create(
            user=request.user,
            action='logout',
            description='Admin logout',
            ip_address=self._get_client_ip(request),
        )
        return Response({'message': 'Logged out successfully.'})

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')
