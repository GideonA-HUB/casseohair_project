import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';
import { siteApi } from '@/api';

const policyMap: Record<string, { title: string; field: 'privacy_policy' | 'terms_of_service' | 'refund_policy' }> = {
  privacy: { title: 'Privacy Policy', field: 'privacy_policy' },
  terms: { title: 'Terms of Service', field: 'terms_of_service' },
  refund: { title: 'Refund Policy', field: 'refund_policy' },
};

export default function PolicyPage() {
  const location = useLocation();
  const pageType = location.pathname.replace('/', '') || 'privacy';
  const policy = policyMap[pageType] || policyMap.privacy;

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  const content = settings?.[policy.field];

  return (
    <>
      <SEO title={policy.title} />
      <div className="section-padding max-w-3xl mx-auto">
        <h1 className="text-2xl font-display font-semibold mb-8">{policy.title}</h1>
        {content ? (
          <div className="text-sm text-brand-accent/70 leading-relaxed whitespace-pre-line">{content}</div>
        ) : (
          <p className="text-brand-accent/50">Policy content coming soon.</p>
        )}
      </div>
    </>
  );
}
