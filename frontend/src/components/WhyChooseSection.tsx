import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ZoomParallax, type ParallaxItem } from '@/components/ui/zoom-parallax';
import { siteApi } from '@/api';
import type { WhyChooseItem } from '@/types';

/** Stock HD fallbacks when admin has not uploaded an image yet */
const FALLBACK_IMAGES: ParallaxItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Luxury hair styling',
    title: 'Authentic Luxury Hair',
    description: 'Genuine premium hair sourced from trusted global suppliers',
  },
  {
    src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Global beauty',
    title: 'Global Sourcing',
    description: 'Vietnamese, Cambodian, Indian & Burmese premium collections',
  },
  {
    src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&auto=format&q=80',
    alt: 'Premium lace detail',
    title: 'Premium Lace',
    description: 'HD Lace, Transparent Lace & Swiss Lace craftsmanship',
  },
  {
    src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Long-lasting quality hair',
    title: 'Long Lifespan',
    description: 'Built to last with proper care and premium construction',
  },
  {
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&auto=format&q=80',
    alt: 'Elegant hair texture',
    title: 'Effortless Elegance',
    description: 'Silky textures that move naturally with every step',
  },
  {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Fast delivery',
    title: 'Fast Delivery',
    description: 'Swift nationwide delivery across Nigeria',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&auto=format&q=80',
    alt: 'Natural beauty',
    title: 'Natural Look',
    description: 'Undetectable lace and flawless hairlines every time',
  },
];

function toParallaxItems(items: WhyChooseItem[]): ParallaxItem[] {
  if (!items.length) return FALLBACK_IMAGES;

  return items.map((item, index) => ({
    src: item.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length].src,
    alt: item.alt_text || item.title,
    title: item.title,
    description: item.description,
  }));
}

export default function WhyChooseSection() {
  const { data: items = [] } = useQuery({
    queryKey: ['why-choose'],
    queryFn: () => siteApi.whyChoose(),
  });

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
  });

  const title = settings?.why_choose_title || 'Why Choose CasseoHair';
  const subtitle =
    settings?.why_choose_subtitle || 'Authentic luxury hair, crafted for elegance';

  const parallaxItems = toParallaxItems(items);

  return (
    <section className="relative bg-brand-black text-white overflow-hidden">
      {/* Intro — scroll into parallax */}
      <div className="relative flex min-h-[50vh] items-center justify-center px-4 section-padding">
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
            'bg-[radial-gradient(ellipse_at_center,rgba(230,46,114,0.18),transparent_55%)]',
            'blur-[40px]',
          )}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative text-center max-w-2xl mx-auto"
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand-pink mb-4">
            The CasseoHair Difference
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-white mb-4">
            {title}
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">{subtitle}</p>
          <p className="mt-8 text-xs text-white/40 tracking-widest uppercase animate-pulse">
            Scroll to explore
          </p>
        </motion.div>
      </div>

      <ZoomParallax items={parallaxItems} />

      {/* Outro spacer */}
      <div className="h-[30vh] bg-gradient-to-b from-brand-black to-brand-gray-50" />
    </section>
  );
}
