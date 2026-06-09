import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';
import { siteApi } from '@/api';

export default function AboutPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <>
      <SEO title="About Us" description="Discover the CasseoHair story — luxury hair redefined" />
      <div className="section-padding max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold mb-2">
            {settings?.about_title || 'About CasseoHair'}
          </h1>
          <p className="text-brand-pink font-medium mb-8">Luxury Hair, Delivered with Care</p>
        </motion.div>

        {settings?.brand_story && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-sm max-w-none text-brand-accent/70 leading-relaxed mb-10 whitespace-pre-line"
          >
            {settings.brand_story}
          </motion.div>
        )}

        {settings?.about_content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-accent/70 leading-relaxed mb-10 whitespace-pre-line"
          >
            {settings.about_content}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings?.mission && (
            <div className="p-6 rounded-card bg-brand-gray-50">
              <h2 className="font-display font-semibold text-brand-pink mb-3">Our Mission</h2>
              <p className="text-sm text-brand-accent/70 leading-relaxed whitespace-pre-line">{settings.mission}</p>
            </div>
          )}
          {settings?.vision && (
            <div className="p-6 rounded-card bg-brand-gray-50">
              <h2 className="font-display font-semibold text-brand-pink mb-3">Our Vision</h2>
              <p className="text-sm text-brand-accent/70 leading-relaxed whitespace-pre-line">{settings.vision}</p>
            </div>
          )}
        </div>

        {!settings?.brand_story && !settings?.about_content && (
          <div className="text-center py-12 text-brand-accent/50">
            <p>CasseoHair is a premium luxury hair brand specializing in rare, high-end, authentic wigs and hair extensions sourced globally.</p>
          </div>
        )}
      </div>
    </>
  );
}
