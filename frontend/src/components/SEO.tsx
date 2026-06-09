import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  schema?: Record<string, unknown>;
}

const SITE_NAME = 'CasseoHair';
const DEFAULT_DESCRIPTION =
  'Premium luxury wigs and hair extensions. Authentic bone straight, pixel curls, deep wave, HD lace wigs and more.';

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = '/logo.png',
  type = 'website',
  schema,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Luxury Hair & Wig E-Commerce`;
  const siteUrl = window.location.origin;
  const canonicalUrl = canonical || window.location.href;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
