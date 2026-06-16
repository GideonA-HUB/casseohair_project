import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductReviews from '@/components/ui/product-reviews';
import StarRating from '@/components/StarRating';
import { productsApi } from '@/api';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getLaceTypeLabel, getLengthLabel } from '@/utils/format';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.get(slug!).then((r) => r.data),
    enabled: !!slug,
    retry: 1,
  });

  if (isLoading) return <LoadingSpinner fullScreen={false} />;
  if (error) {
    return (
      <div className="section-padding text-center py-20">
        <p className="text-brand-accent/50">Something went wrong. Please try again.</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="section-padding text-center py-20">
        <p className="text-brand-accent/50">Product not found</p>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : product.primary_image
    ? [{ id: 0, image: product.primary_image, alt_text: product.name, is_primary: true, order: 0 }]
    : [];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.primary_image,
    offers: {
      '@type': 'Offer',
      price: product.current_price,
      priceCurrency: 'NGN',
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <SEO
        title={product.meta_title || product.name}
        description={product.meta_description || product.short_description}
        image={product.primary_image || undefined}
        type="product"
        schema={productSchema}
      />

      <div className="section-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="lg:max-w-[560px]">
            {images.length > 1 ? (
              <Swiper modules={[Pagination, Navigation]} pagination navigation className="rounded-card overflow-hidden">
                {images.map((img) => (
                  <SwiperSlide key={img.id}>
                    <div className="aspect-[4/5] lg:aspect-[4/4] bg-brand-gray-50">
                      <img src={img.image} alt={img.alt_text || product.name} className="w-full h-full object-cover" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : images.length === 1 ? (
              <div className="aspect-[4/5] lg:aspect-[4/4] rounded-card overflow-hidden bg-brand-gray-50">
                <img src={images[0].image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/5] lg:aspect-[4/4] rounded-card bg-brand-gray-50 flex items-center justify-center text-brand-accent/20 text-6xl">
                ✦
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {product.category_name && (
              <p className="text-xs text-brand-pink font-medium uppercase tracking-wider">
                {product.category_name}
              </p>
            )}
            <h1 className="text-2xl md:text-3xl font-display font-semibold">{product.name}</h1>

            {(product.review_count ?? 0) > 0 && product.average_rating != null && (
              <div className="flex items-center gap-2">
                <StarRating value={product.average_rating} size="md" />
                <span className="text-sm text-brand-accent/60">
                  {product.average_rating} · {product.review_count} review{product.review_count !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold">{formatPrice(product.current_price)}</span>
              {product.is_on_sale && (
                <>
                  <span className="text-lg text-brand-accent/40 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-brand-pink text-white text-xs font-semibold px-2 py-1 rounded-full">
                    -{product.discount_percentage}%
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              {product.length && (
                <span className="px-3 py-1.5 rounded-full bg-brand-gray-50 text-brand-accent/70">
                  Length: {getLengthLabel(product.length)}
                </span>
              )}
              {product.lace_type && (
                <span className="px-3 py-1.5 rounded-full bg-brand-gray-50 text-brand-accent/70">
                  {getLaceTypeLabel(product.lace_type)}
                </span>
              )}
              {product.density && (
                <span className="px-3 py-1.5 rounded-full bg-brand-gray-50 text-brand-accent/70">
                  Density: {product.density}
                </span>
              )}
              {product.color && (
                <span className="px-3 py-1.5 rounded-full bg-brand-gray-50 text-brand-accent/70">
                  Color: {product.color}
                </span>
              )}
            </div>

            <p className={`text-sm font-medium ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
              {product.in_stock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>

            {product.in_stock && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-brand-gray-200 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:text-brand-pink"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:text-brand-pink"
                  >
                    +
                  </button>
                </div>
                <button onClick={handleAddToCart} className="btn-primary flex-1">
                  {added ? 'Added to Bag ✓' : 'Add to Bag'}
                </button>
              </div>
            )}

            <div className="pt-6 border-t border-brand-gray-100">
              <h3 className="font-semibold mb-3">Description</h3>
              <div className="text-sm text-brand-accent/70 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Reviews */}
      <ProductReviews
        productSlug={slug!}
        averageRating={product.average_rating}
        reviewCount={product.review_count}
      />
    </>
  );
}
