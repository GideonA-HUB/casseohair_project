import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';
import { paymentsApi } from '@/api';
import { formatPrice } from '@/utils/format';
import type { Order } from '@/types';

export default function CheckoutVerifyPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    const provider = searchParams.get('provider') || 'paystack';

    if (!reference) {
      setStatus('failed');
      return;
    }

    paymentsApi
      .verify(reference, provider)
      .then((res) => {
        if (res.data.payment?.status === 'success') {
          setOrder(res.data.order);
          setStatus('success');
        } else {
          setStatus('failed');
        }
      })
      .catch(() => setStatus('failed'));
  }, [searchParams]);

  if (status === 'loading') return <LoadingSpinner />;

  return (
    <>
      <SEO title={status === 'success' ? 'Order Confirmed' : 'Payment Failed'} />
      <div className="section-padding max-w-lg mx-auto text-center py-16">
        {status === 'success' && order ? (
          <>
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-semibold mb-2">Payment Successful</h1>
            <p className="text-brand-accent/60 mb-6">
              Thank you, {order.full_name}! Your order has been confirmed.
            </p>
            <div className="bg-brand-gray-50 rounded-card p-5 text-left space-y-2 mb-8">
              <p className="text-sm"><span className="text-brand-accent/50">Order:</span> <strong>{order.order_number}</strong></p>
              <p className="text-sm"><span className="text-brand-accent/50">Total:</span> <strong>{formatPrice(order.total)}</strong></p>
              <p className="text-sm"><span className="text-brand-accent/50">Email:</span> {order.email}</p>
            </div>
            <Link to="/shop" className="btn-primary">Continue Shopping</Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-semibold mb-2">Payment Failed</h1>
            <p className="text-brand-accent/60 mb-8">
              Something went wrong with your payment. Please try again.
            </p>
            <Link to="/checkout" className="btn-primary">Try Again</Link>
          </>
        )}
      </div>
    </>
  );
}
