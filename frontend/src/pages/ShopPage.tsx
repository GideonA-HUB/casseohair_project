import { useSearchParams, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '@/components/SEO';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { productsApi } from '@/api';
import type { Product } from '@/types';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const { slug: categorySlug } = useParams<{ slug?: string }>();
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || '';
  const category = categorySlug || searchParams.get('category') || '';

  const { data, isLoading } = useQuery<{ results: Product[]; count: number }>({
    queryKey: ['products', search, filter, category],
    queryFn: async () => {
      if (search) {
        const res = await productsApi.search(search);
        return { results: res.data.results, count: res.data.count };
      }
      if (filter === 'featured') {
        const results = await productsApi.featured();
        return { results, count: results.length };
      }
      if (filter === 'new-arrivals') {
        const results = await productsApi.newArrivals();
        return { results, count: results.length };
      }
      if (filter === 'bestsellers') {
        const results = await productsApi.bestsellers();
        return { results, count: results.length };
      }
      const params: Record<string, string> = {};
      if (category) params.category = category;
      const res = await productsApi.list(params);
      return { results: res.data.results, count: res.data.count };
    },
  });

  const title = search
    ? `Search: ${search}`
    : filter === 'new-arrivals'
    ? 'New Arrivals'
    : filter === 'bestsellers'
    ? 'Best Sellers'
    : filter === 'featured'
    ? 'Featured'
    : 'Shop All';

  return (
    <>
      <SEO title={title} description={`Browse ${title.toLowerCase()} at CasseoHair`} />
      <div className="section-padding max-w-7xl mx-auto">
        <h1 className="text-2xl font-display font-semibold mb-2">{title}</h1>
        <p className="text-sm text-brand-accent/50 mb-6">
          {data?.count ?? 0} items available
        </p>

        {isLoading ? (
          <LoadingSpinner fullScreen={false} />
        ) : data?.results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-accent/50">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.results.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
