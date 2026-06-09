from django.db.models import Q
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminUser

from .filters import ProductFilter
from .models import Category, Product
from .serializers import (
    CategoryDetailSerializer,
    CategoryListSerializer,
    ProductAdminSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategoryListSerializer


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategoryDetailSerializer
    lookup_field = 'slug'


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'category__name', 'color', 'lace_type']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_archived=False).select_related('category').prefetch_related('images')


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_archived=False).select_related('category').prefetch_related('images', 'videos')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Product.objects.filter(pk=instance.pk).update(views_count=instance.views_count + 1)
        serializer = self.get_response_serializer(instance)
        return Response(serializer.data)

    def get_response_serializer(self, instance):
        return self.get_serializer(instance)


class FeaturedProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, is_archived=False, is_featured=True
        ).select_related('category').prefetch_related('images')[:12]


class BestsellerProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, is_archived=False, is_bestseller=True
        ).select_related('category').prefetch_related('images')[:12]


class NewArrivalProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, is_archived=False, is_new_arrival=True
        ).select_related('category').prefetch_related('images')[:12]


class ProductSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'results': [], 'count': 0})

        products = Product.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(category__name__icontains=query) |
            Q(color__icontains=query) |
            Q(lace_type__icontains=query),
            is_active=True,
            is_archived=False,
        ).select_related('category').prefetch_related('images')[:20]

        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response({'results': serializer.data, 'count': len(serializer.data)})


class AdminProductListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ProductAdminSerializer
    filterset_class = ProductFilter
    search_fields = ['name', 'sku']

    def get_queryset(self):
        return Product.objects.all().select_related('category')


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ProductAdminSerializer
    queryset = Product.objects.all()
