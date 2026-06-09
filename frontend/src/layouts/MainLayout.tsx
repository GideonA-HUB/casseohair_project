import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { siteApi } from '@/api';

export default function MainLayout() {
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header whatsappNumber={settings?.whatsapp_number} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer
        siteName={settings?.site_name}
        instagramUrl={settings?.instagram_url}
        facebookUrl={settings?.facebook_url}
        twitterUrl={settings?.twitter_url}
      />
      <CartDrawer />
    </div>
  );
}
