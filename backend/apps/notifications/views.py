from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminUser

from .models import Notification
from .serializers import NotificationSerializer


class AdminNotificationListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.all()[:50]


class AdminNotificationMarkReadView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk)
        except Notification.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)


class AdminNotificationMarkAllReadView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        Notification.objects.filter(is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read.'})


class AdminUnreadCountView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        count = Notification.objects.filter(is_read=False).count()
        return Response({'count': count})
