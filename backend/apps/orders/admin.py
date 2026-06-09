from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'price', 'quantity', 'subtotal']
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'full_name', 'email', 'total', 'status',
        'is_paid', 'payment_method', 'created_at',
    ]
    list_filter = ['status', 'is_paid', 'payment_method', 'created_at']
    search_fields = ['order_number', 'email', 'full_name', 'phone']
    readonly_fields = [
        'order_number', 'subtotal', 'delivery_fee', 'total',
        'payment_reference', 'paid_at', 'created_at', 'updated_at',
    ]
    inlines = [OrderItemInline]
    fieldsets = (
        ('Order Info', {'fields': ('order_number', 'status', 'is_paid', 'paid_at')}),
        ('Customer', {'fields': ('full_name', 'email', 'phone')}),
        ('Delivery', {'fields': ('address', 'city', 'state', 'country', 'order_notes')}),
        ('Payment', {'fields': ('payment_method', 'payment_reference')}),
        ('Totals', {'fields': ('subtotal', 'delivery_fee', 'total')}),
        ('Refund', {'fields': ('refund_amount', 'refund_reason'), 'classes': ('collapse',)}),
        ('Timestamps', {'fields': ('shipped_at', 'delivered_at', 'cancelled_at', 'created_at', 'updated_at')}),
    )
