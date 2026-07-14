import { useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

interface PaginatedProductGridProps {
  products: Product[];
  itemLabel?: string;
  dark?: boolean;
}

function useSectionPageSize() {
  const [pageSize, setPageSize] = useState(4);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setPageSize(media.matches ? 8 : 4);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return pageSize;
}

function getVisiblePages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) return [1, 2, 3, 4, 'ellipsis', total];
  if (current >= total - 2) return [1, 'ellipsis', total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

export default function PaginatedProductGrid({
  products,
  itemLabel = 'items',
  dark = false,
}: PaginatedProductGridProps) {
  const pageSize = useSectionPageSize();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [pageSize, products.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, page, pageSize]);

  if (!products.length) return null;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, products.length);
  const showPagination = products.length > pageSize;
  const pages = getVisiblePages(page, totalPages);

  const muted = dark ? 'text-white/55' : 'text-brand-accent/50 dark:text-gray-400';
  const btnBase = dark
    ? 'border-white/20 bg-white/5 text-white hover:border-brand-pink hover:bg-brand-pink/20'
    : 'border-brand-gray-200 bg-white text-brand-accent hover:border-brand-pink hover:text-brand-pink dark:border-white/15 dark:bg-dark-card dark:text-gray-200';
  const activeBtn = 'border-brand-pink bg-brand-pink text-white shadow-sm';

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pageProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {showPagination && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${btnBase}`}
            >
              Previous
            </button>

            {pages.map((entry, idx) =>
              entry === 'ellipsis' ? (
                <span key={`e-${idx}`} className={`px-1 text-sm ${muted}`}>
                  …
                </span>
              ) : (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setPage(entry)}
                  className={`min-w-[2.25rem] rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                    page === entry ? activeBtn : btnBase
                  }`}
                  aria-current={page === entry ? 'page' : undefined}
                >
                  {entry}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${btnBase}`}
            >
              Next
            </button>
          </div>
          <p className={`text-xs ${muted}`}>
            Showing {startItem}–{endItem} of {products.length} {itemLabel}
          </p>
        </div>
      )}
    </div>
  );
}
