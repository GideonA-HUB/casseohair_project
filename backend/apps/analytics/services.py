import csv
import io
from datetime import timedelta
from decimal import Decimal

from django.db.models import Count, Sum
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone

from apps.orders.models import Order, OrderItem
from apps.products.models import Product


class AnalyticsService:
    @classmethod
    def get_dashboard_metrics(cls):
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=today_start.weekday())
        month_start = today_start.replace(day=1)
        year_start = today_start.replace(month=1, day=1)

        paid_orders = Order.objects.filter(is_paid=True)

        def revenue_since(dt):
            return paid_orders.filter(paid_at__gte=dt).aggregate(
                total=Sum('total')
            )['total'] or Decimal('0')

        def orders_since(dt):
            return paid_orders.filter(paid_at__gte=dt).count()

        return {
            'total_sales': str(paid_orders.aggregate(t=Sum('total'))['t'] or 0),
            'daily_sales': str(revenue_since(today_start)),
            'weekly_sales': str(revenue_since(week_start)),
            'monthly_sales': str(revenue_since(month_start)),
            'yearly_sales': str(revenue_since(year_start)),
            'total_orders': Order.objects.count(),
            'pending_orders': Order.objects.filter(status='pending').count(),
            'delivered_orders': Order.objects.filter(status='delivered').count(),
            'total_revenue': str(paid_orders.aggregate(t=Sum('total'))['t'] or 0),
            'daily_orders': orders_since(today_start),
            'weekly_orders': orders_since(week_start),
            'monthly_orders': orders_since(month_start),
        }

    @classmethod
    def get_sales_trend(cls, days=30):
        since = timezone.now() - timedelta(days=days)
        data = (
            Order.objects.filter(is_paid=True, paid_at__gte=since)
            .annotate(date=TruncDate('paid_at'))
            .values('date')
            .annotate(revenue=Sum('total'), orders=Count('id'))
            .order_by('date')
        )
        return [
            {
                'date': entry['date'].isoformat() if entry['date'] else None,
                'revenue': str(entry['revenue'] or 0),
                'orders': entry['orders'],
            }
            for entry in data
        ]

    @classmethod
    def get_top_products(cls, limit=10):
        items = (
            OrderItem.objects.filter(order__is_paid=True)
            .values('product_name', 'product_slug')
            .annotate(
                total_sold=Sum('quantity'),
                revenue=Sum('subtotal'),
            )
            .order_by('-total_sold')[:limit]
        )
        return [
            {
                'name': item['product_name'],
                'slug': item['product_slug'],
                'total_sold': item['total_sold'],
                'revenue': str(item['revenue'] or 0),
            }
            for item in items
        ]

    @classmethod
    def get_product_performance(cls):
        products = Product.objects.filter(is_active=True, is_archived=False).order_by('-views_count')[:20]
        return [
            {
                'id': p.id,
                'name': p.name,
                'slug': p.slug,
                'views': p.views_count,
                'stock': p.stock,
                'price': str(p.current_price),
            }
            for p in products
        ]

    @classmethod
    def export_orders_csv(cls, period='monthly'):
        now = timezone.now()
        if period == 'daily':
            since = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == 'weekly':
            since = now - timedelta(days=7)
        elif period == 'yearly':
            since = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            since = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        orders = Order.objects.filter(created_at__gte=since).order_by('-created_at')
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            'Order Number', 'Customer', 'Email', 'Phone', 'Total',
            'Status', 'Paid', 'Created At',
        ])
        for order in orders:
            writer.writerow([
                order.order_number, order.full_name, order.email, order.phone,
                order.total, order.status, order.is_paid,
                order.created_at.strftime('%Y-%m-%d %H:%M'),
            ])
        return output.getvalue()
