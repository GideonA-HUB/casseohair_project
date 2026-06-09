from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminUser

from .services import AnalyticsService


class DashboardMetricsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response(AnalyticsService.get_dashboard_metrics())


class SalesTrendView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        return Response(AnalyticsService.get_sales_trend(days=days))


class TopProductsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        return Response(AnalyticsService.get_top_products(limit=limit))


class ExportOrdersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        period = request.query_params.get('period', 'monthly')
        csv_content = AnalyticsService.export_orders_csv(period=period)
        response = HttpResponse(csv_content, content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="orders_{period}.csv"'
        return response
