from rest_framework import serializers

from apps.core.media import absolute_media_url

from .models import Category, Product, ProductImage, ProductVideo, ProductReview


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']

    def get_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)


class ProductVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVideo
        fields = ['id', 'video', 'title', 'order']


class CategoryListSerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'product_count', 'is_featured', 'order',
        ]

    def get_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)


class CategoryDetailSerializer(CategoryListSerializer):
    class Meta(CategoryListSerializer.Meta):
        fields = CategoryListSerializer.Meta.fields + [
            'meta_title', 'meta_description', 'created_at',
        ]


class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    current_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name',
            'short_description', 'price', 'sale_price', 'current_price',
            'is_on_sale', 'discount_percentage', 'length', 'density',
            'lace_type', 'color', 'stock', 'in_stock', 'is_featured',
            'is_bestseller', 'is_new_arrival', 'primary_image',
            'average_rating', 'review_count',
        ]

    def get_primary_image(self, obj):
        img = obj.primary_image
        if img:
            return absolute_media_url(self.context.get('request'), img.image)
        return None

    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return None

    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ProductDetailSerializer(ProductListSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    videos = ProductVideoSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + [
            'description', 'sku', 'images', 'videos',
            'meta_title', 'meta_description', 'views_count', 'created_at',
        ]


class ProductAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ['id', 'product', 'name', 'rating', 'comment', 'is_approved', 'created_at']
        read_only_fields = ['is_approved', 'created_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value


class ProductReviewListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ['id', 'name', 'rating', 'comment', 'created_at']
