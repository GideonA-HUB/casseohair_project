from django.contrib.auth.models import User
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.orders.models import Order
from apps.products.models import Product, ProductReview
from apps.site_config.models import AdminActivityLog, NewsletterSubscriber

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


class AdminMetricsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        today = now.date()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        year_ago = now - timedelta(days=365)

        total_orders = Order.objects.count()
        total_revenue = Order.objects.aggregate(total=Sum('total'))['total'] or 0

        today_orders = Order.objects.filter(created_at__date=today).count()
        today_revenue = Order.objects.filter(created_at__date=today).aggregate(total=Sum('total'))['total'] or 0

        week_orders = Order.objects.filter(created_at__gte=week_ago).count()
        week_revenue = Order.objects.filter(created_at__gte=week_ago).aggregate(total=Sum('total'))['total'] or 0

        month_orders = Order.objects.filter(created_at__gte=month_ago).count()
        month_revenue = Order.objects.filter(created_at__gte=month_ago).aggregate(total=Sum('total'))['total'] or 0

        year_orders = Order.objects.filter(created_at__gte=year_ago).count()
        year_revenue = Order.objects.filter(created_at__gte=year_ago).aggregate(total=Sum('total'))['total'] or 0

        pending_reviews = ProductReview.objects.filter(is_approved=False).count()
        active_products = Product.objects.filter(is_active=True, is_archived=False).count()
        newsletter_subscribers = NewsletterSubscriber.objects.filter(is_active=True).count()

        # Daily sales — last 7 days
        daily_sales = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_orders = Order.objects.filter(created_at__date=day)
            daily_sales.append({
                'label': day.strftime('%a'),
                'date': day.isoformat(),
                'orders': day_orders.count(),
                'revenue': float(day_orders.aggregate(total=Sum('total'))['total'] or 0),
            })

        # Monthly sales — last 6 months
        monthly_sales = []
        for i in range(5, -1, -1):
            month_date = (now.replace(day=1) - timedelta(days=i * 30)).replace(day=1)
            next_month = (month_date.replace(day=28) + timedelta(days=4)).replace(day=1)
            month_orders_qs = Order.objects.filter(created_at__gte=month_date, created_at__lt=next_month)
            monthly_sales.append({
                'label': month_date.strftime('%b %Y'),
                'orders': month_orders_qs.count(),
                'revenue': float(month_orders_qs.aggregate(total=Sum('total'))['total'] or 0),
            })

        # Order status distribution
        status_counts = Order.objects.values('status').annotate(count=Count('id')).order_by('-count')
        order_status_distribution = [
            {'status': entry['status'], 'count': entry['count']}
            for entry in status_counts
        ]
        if not order_status_distribution:
            order_status_distribution = [{'status': 'pending', 'count': 0}]

        return Response({
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'today_orders': today_orders,
            'today_revenue': float(today_revenue),
            'week_orders': week_orders,
            'week_revenue': float(week_revenue),
            'month_orders': month_orders,
            'month_revenue': float(month_revenue),
            'year_orders': year_orders,
            'year_revenue': float(year_revenue),
            'pending_reviews': pending_reviews,
            'active_products': active_products,
            'newsletter_subscribers': newsletter_subscribers,
            'daily_sales': daily_sales,
            'monthly_sales': monthly_sales,
            'order_status_distribution': order_status_distribution,
        })
