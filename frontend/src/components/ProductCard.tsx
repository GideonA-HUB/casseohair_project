import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarRating from '@/components/StarRating';
import MultiCurrencyPrice from '@/components/MultiCurrencyPrice';
import type { Product } from '@/types';
import { formatPrice, truncateText } from '@/utils/format';
import { useCurrencyStore } from '@/store/currencyStore';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const currencySettings = useCurrencyStore((s) => s.settings);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="luxury-card group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-brand-gray-50">
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-accent/30">
              <span className="text-4xl">✦</span>
            </div>
          )}
          {product.is_on_sale && (
            <span className="absolute top-3 left-3 bg-brand-pink text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              -{product.discount_percentage}%
            </span>
          )}
          {product.is_new_arrival && (
            <span className="absolute top-3 right-3 bg-brand-black text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              New
            </span>
          )}
          {product.is_flash_sale && (
            <span className="absolute bottom-3 left-3 bg-brand-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
              Flash Sale
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 space-y-2">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-brand-accent leading-snug line-clamp-2 group-hover:text-brand-pink transition-colors">
            {truncateText(product.name, 50)}
          </h3>
        </Link>
        {(product.review_count ?? 0) > 0 && product.average_rating != null && (
          <div className="flex items-center gap-1.5">
            <StarRating value={product.average_rating} size="sm" />
            <span className="text-xs text-brand-accent/40">({product.review_count})</span>
          </div>
        )}
        <div className="space-y-1">
          <MultiCurrencyPrice amountNgn={product.current_price} settings={currencySettings} />
          {product.is_on_sale && (
            <span className="text-xs text-brand-accent/40 line-through block">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <Link
          to={`/product/${product.slug}`}
          className="block w-full text-center btn-ghost text-xs py-2.5 mt-1"
        >
          Select Options
        </Link>
      </div>
    </motion.div>
  );
}
