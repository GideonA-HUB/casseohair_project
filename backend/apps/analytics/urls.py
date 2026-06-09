from django.urls import path

from .views import DashboardMetricsView, ExportOrdersView, SalesTrendView, TopProductsView

urlpatterns = [
    path('dashboard/', DashboardMetricsView.as_view(), name='dashboard-metrics'),
    path('sales-trend/', SalesTrendView.as_view(), name='sales-trend'),
    path('top-products/', TopProductsView.as_view(), name='top-products'),
    path('export/orders/', ExportOrdersView.as_view(), name='export-orders'),
]
