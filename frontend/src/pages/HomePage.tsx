import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '@/components/SEO';
import PaginatedProductGrid from '@/components/PaginatedProductGrid';
import SaleAnnouncementBanner from '@/components/SaleAnnouncementBanner';
import CategoryCard from '@/components/CategoryCard';
import { ShuffleHero } from '@/components/ui/shuffle-grid';
import SlidingTestimonial from '@/components/ui/sliding-testimonial';
import WhyChooseSection from '@/components/WhyChooseSection';
import { productsApi, siteApi } from '@/api';
import type { Category, Product, Testimonial } from '@/types';

export default function HomePage() {
  const [now, setNow] = useState(() => Date.now());

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories', 'featured'],
    queryFn: () => productsApi.categories({ featured: true }),
  });

  const { data: featured = [] } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.featured(),
  });

  const { data: newArrivals = [] } = useQuery<Product[]>({
    queryKey: ['new-arrivals'],
    queryFn: () => productsApi.newArrivals(),
  });

  const { data: bestsellers = [] } = useQuery<Product[]>({
    queryKey: ['bestsellers'],
    queryFn: () => productsApi.bestsellers(),
  });

  const { data: flashSales = [] } = useQuery<Product[]>({
    queryKey: ['flash-sales'],
    queryFn: () => productsApi.flashSales(),
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: () => siteApi.testimonials(),
  });

  const heroCategory = categories[0];
  const gridCategories = categories.slice(1, 3);
  const desktopCategories = categories.slice(0, 3);

  const flashTimer = useMemo(() => {
    if (!flashSales.length) return null;

    const windows = flashSales.map((product) => {
      const start = product.flash_sale_start_at
        ? new Date(product.flash_sale_start_at).getTime()
        : null;
      const end = product.flash_sale_end_at
        ? new Date(product.flash_sale_end_at).getTime()
        : null;
      return {
        start: start && !Number.isNaN(start) ? start : null,
        end: end && !Number.isNaN(end) ? end : null,
      };
    });

    // Prefer active sales: started (or no start) and not yet ended → count down to earliest end
    const activeEnds = windows
      .filter((w) => w.end && w.end > now && (!w.start || w.start <= now))
      .map((w) => w.end as number);
    if (activeEnds.length) {
      return { mode: 'ends' as const, target: Math.min(...activeEnds) };
    }

    // Upcoming sales → count down to earliest start
    const upcomingStarts = windows
      .filter((w) => w.start && w.start > now && (!w.end || w.end > now))
      .map((w) => w.start as number);
    if (upcomingStarts.length) {
      return { mode: 'starts' as const, target: Math.min(...upcomingStarts) };
    }

    // Fallback: any future end date
    const futureEnds = windows
      .filter((w) => w.end && w.end > now)
      .map((w) => w.end as number);
    if (futureEnds.length) {
      return { mode: 'ends' as const, target: Math.min(...futureEnds) };
    }

    return null;
  }, [flashSales, now]);

  useEffect(() => {
    if (!flashTimer) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [flashTimer]);

  const countdown = useMemo(() => {
    if (!flashTimer) return null;
    const ms = Math.max(0, flashTimer.target - now);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return { mode: flashTimer.mode, days, hours, minutes, seconds };
  }, [flashTimer, now]);

  return (
    <>
      <SEO />

      {/* Hero */}
      <ShuffleHero />

      {/* Sale / Preorder Announcement */}
      <SaleAnnouncementBanner />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto">
          {/* Mobile/tablet layout (keep current behavior) */}
          <div className="lg:hidden">
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
          </div>

          {/* Desktop layout: 3 cards side-by-side */}
          {desktopCategories.length >= 3 && (
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {desktopCategories.slice(0, 3).map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Flash Sales */}
      <section className="section-padding max-w-7xl mx-auto bg-brand-black text-white rounded-card">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-display font-semibold">Flash Sales</h2>
            {countdown ? (
              <p className="text-sm text-white/70 mt-1">
                {countdown.mode === 'starts' ? 'Starts in' : 'Ends in'}{' '}
                {countdown.days}d : {String(countdown.hours).padStart(2, '0')}h :{' '}
                {String(countdown.minutes).padStart(2, '0')}m :{' '}
                {String(countdown.seconds).padStart(2, '0')}s
              </p>
            ) : (
              <p className="text-sm text-white/60 mt-1">No sales at the moment</p>
            )}
          </div>
          <Link to="/shop?filter=flash-sales" className="btn-outline text-xs border-white/30 text-white hover:border-brand-pink">
            View All →
          </Link>
        </div>

        {flashSales.length > 0 ? (
          <PaginatedProductGrid products={flashSales} itemLabel="flash sales" dark />
        ) : (
          <div className="text-sm text-white/60 py-6">No sales at the moment</div>
        )}
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Featured Items</h2>
            <Link to="/shop?filter=featured" className="btn-ghost text-xs">
              All Products →
            </Link>
          </div>
          <PaginatedProductGrid products={featured} itemLabel="featured items" />
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto bg-brand-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">New Arrivals</h2>
            <Link to="/shop?filter=new-arrivals" className="btn-ghost text-xs">View All →</Link>
          </div>
          <PaginatedProductGrid products={newArrivals} itemLabel="new arrivals" />
        </section>
      )}

      {/* Best Sellers */}
      {bestsellers.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Best Sellers</h2>
            <Link to="/shop?filter=bestsellers" className="btn-ghost text-xs">View All →</Link>
          </div>
          <PaginatedProductGrid products={bestsellers} itemLabel="best sellers" />
        </section>
      )}

      {/* Why Choose — zoom parallax */}
      <WhyChooseSection />

      {/* Testimonials */}
      <SlidingTestimonial />
    </>
  );
}
