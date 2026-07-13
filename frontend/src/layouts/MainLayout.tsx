import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import MinimalFooter from '@/components/ui/minimal-footer';
import CartDrawer from '@/components/CartDrawer';
import { siteApi } from '@/api';
import { useCurrencySettings } from '@/hooks/useCurrencySettings';

export default function MainLayout() {
  useCurrencySettings();

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen flex flex-col bg-brand-white dark:bg-dark-surface transition-colors duration-300">
      <Header whatsappNumber={settings?.whatsapp_number} />
      <main className="flex-1">
        <Outlet />
      </main>
      <MinimalFooter
        siteName={settings?.site_name}
        contactEmail={settings?.contact_email}
        instagramUrl={settings?.instagram_url}
        facebookUrl={settings?.facebook_url}
        twitterUrl={settings?.twitter_url}
        tiktokUrl={settings?.tiktok_url}
        youtubeUrl={settings?.youtube_url}
      />
      <CartDrawer />
    </div>
  );
}
