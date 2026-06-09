import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { productsApi, siteApi } from '@/api';

const whyChoose = [
  { icon: '✦', title: 'Authentic Luxury Hair', desc: 'Genuine premium hair sourced from trusted global suppliers' },
  { icon: '◈', title: 'Global Sourcing', desc: 'Vietnamese, Cambodian, Indian & Burmese premium collections' },
  { icon: '◇', title: 'Premium Lace', desc: 'HD Lace, Transparent Lace & Swiss Lace craftsmanship' },
  { icon: '◎', title: 'Long Lifespan', desc: 'Built to last with proper care and premium construction' },
  { icon: '▸', title: 'Fast Delivery', desc: 'Swift nationwide delivery across Nigeria' },
];

export default function HomePage() {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.categories().then((r) => r.data),
  });

  const { data: featured = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.featured().then((r) => r.data),
  });

  const { data: newArrivals = [] } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productsApi.newArrivals().then((r) => r.data),
  });

  const { data: bestsellers = [] } = useQuery({
    queryKey: ['bestsellers'],
    queryFn: () => productsApi.bestsellers().then((r) => r.data),
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => siteApi.testimonials().then((r) => r.data),
  });

  const heroCategory = categories.find((c) => c.is_featured) || categories[0];
  const gridCategories = categories.filter((c) => c.id !== heroCategory?.id).slice(0, 2);

  return (
    <>
      <SEO />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative bg-gradient-to-br from-brand-pink/10 via-white to-brand-gray-50 section-padding">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-brand-accent leading-tight mb-4"
            >
              Luxury Hair,<br />
              <span className="text-brand-pink">Redefined</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-brand-accent/60 max-w-lg mx-auto mb-8 text-sm md:text-base"
            >
              Premium wigs & extensions — Bone Straight, Pixel Curls, Deep Wave, HD Lace & more
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <Link to="/shop" className="btn-primary">Shop Now</Link>
              <Link to="/shop?filter=new-arrivals" className="btn-outline">New Arrivals</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto">
          {heroCategory && (
            <div className="mb-4">
              <CategoryCard category={heroCategory} variant="hero" />
            </div>
          )}
          {gridCategories.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {gridCategories.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Featured Items</h2>
            <Link to="/shop?filter=featured" className="btn-ghost text-xs">
              All Products →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto bg-brand-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">New Arrivals</h2>
            <Link to="/shop?filter=new-arrivals" className="btn-ghost text-xs">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestsellers.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Best Sellers</h2>
            <Link to="/shop?filter=bestsellers" className="btn-ghost text-xs">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestsellers.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Why Choose */}
      <section className="section-padding max-w-7xl mx-auto">
        <h2 className="text-xl font-display font-semibold text-center mb-8">Why Choose CasseoHair</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-card bg-brand-gray-50"
            >
              <span className="text-2xl text-brand-pink mb-3 block">{item.icon}</span>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-brand-accent/60">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto bg-brand-gray-50">
          <h2 className="text-xl font-display font-semibold text-center mb-8">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-card shadow-card">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-brand-pink text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-brand-accent/70 mb-4 leading-relaxed">"{t.content}"</p>
                <p className="font-semibold text-sm">{t.name}</p>
                {t.role && <p className="text-xs text-brand-accent/40">{t.role}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
