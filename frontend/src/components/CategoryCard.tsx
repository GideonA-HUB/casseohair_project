import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  variant?: 'hero' | 'grid';
  index?: number;
}

const categoryImageClass =
  'w-full h-full object-cover object-[center_top] transition-transform duration-500 group-hover:scale-105';

export default function CategoryCard({ category, variant = 'grid', index = 0 }: CategoryCardProps) {
  const count = category.product_count;

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to={`/shop/category/${category.slug}`}
          className="block relative rounded-luxury overflow-hidden aspect-[16/10] lg:aspect-[21/9] lg:max-h-[180px] xl:max-h-[200px] shadow-luxury group bg-brand-gray-100"
        >
          {category.image ? (
            <img src={category.image} alt={category.name} className={categoryImageClass} loading="lazy" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-pink/20 to-brand-black/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 lg:p-5 text-white">
            <h2 className="text-xl lg:text-2xl font-display font-semibold">{category.name}</h2>
            <p className="text-sm text-white/85 mt-1">{count} Items Available</p>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/shop/category/${category.slug}`}
        className="block relative rounded-card overflow-hidden aspect-square lg:aspect-[4/3] lg:max-h-[140px] xl:max-h-[155px] shadow-card group bg-brand-gray-100"
      >
        {category.image ? (
          <img src={category.image} alt={category.name} className={categoryImageClass} loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-pink/15 to-brand-gray-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
          <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 p-3 text-white">
          <h3 className="text-sm font-semibold">{category.name}</h3>
          <p className="text-xs text-white/75">{count} Items</p>
        </div>
      </Link>
    </motion.div>
  );
}
