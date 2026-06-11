from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Product, ProductImage, ProductVideo, ProductReview


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'order', 'preview']
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:60px;border-radius:4px;" />', obj.image.url)
        return '-'
    preview.short_description = 'Preview'


class ProductVideoInline(admin.TabularInline):
    model = ProductVideo
    extra = 0
    fields = ['video', 'title', 'order']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_featured', 'is_active', 'order', 'product_count']
    list_filter = ['is_featured', 'is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'price', 'sale_price', 'stock',
        'is_featured', 'is_bestseller', 'is_new_arrival', 'is_active',
    ]
    list_filter = [
        'category', 'is_featured', 'is_bestseller', 'is_new_arrival',
        'is_active', 'is_archived', 'lace_type', 'length',
    ]
    search_fields = ['name', 'sku', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductVideoInline]
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'category', 'sku', 'short_description', 'description'),
        }),
        ('Pricing & Stock', {
            'fields': ('price', 'sale_price', 'stock'),
        }),
        ('Attributes', {
            'fields': ('length', 'density', 'lace_type', 'color'),
        }),
        ('Flags', {
            'fields': ('is_featured', 'is_bestseller', 'is_new_arrival', 'is_active', 'is_archived'),
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',),
        }),
    )
    actions = ['mark_featured', 'mark_bestseller', 'archive_products']

    @admin.action(description='Mark as featured')
    def mark_featured(self, request, queryset):
        queryset.update(is_featured=True)

    @admin.action(description='Mark as bestseller')
    def mark_bestseller(self, request, queryset):
        queryset.update(is_bestseller=True)

    @admin.action(description='Archive selected products')
    def archive_products(self, request, queryset):
        queryset.update(is_archived=True, is_active=False)


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['name', 'product', 'rating', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_approved', 'created_at']
    search_fields = ['name', 'email', 'comment', 'product__name']
    list_editable = ['is_approved']
    readonly_fields = ['created_at', 'updated_at']
    actions = ['approve_reviews', 'reject_reviews']

    @admin.action(description='Approve selected reviews')
    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)

    @admin.action(description='Reject selected reviews')
    def reject_reviews(self, request, queryset):
        queryset.update(is_approved=False)
