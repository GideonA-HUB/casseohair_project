from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['reference', 'order', 'provider', 'amount', 'status', 'verified_at', 'created_at']
    list_filter = ['provider', 'status', 'created_at']
    search_fields = ['reference', 'order__order_number']
    readonly_fields = ['provider_response', 'verified_at', 'created_at', 'updated_at']
