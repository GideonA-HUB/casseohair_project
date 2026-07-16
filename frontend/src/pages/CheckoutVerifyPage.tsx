import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';
import { paymentsApi } from '@/api';
import { useCartStore } from '@/store/cartStore';
import { clearCheckoutSession } from '@/lib/checkoutSession';
import { formatPrice } from '@/utils/format';
import type { Order } from '@/types';

type VerifyStatus = 'loading' | 'success' | 'cancelled' | 'failed';

function detectProvider(
  providerParam: string | null,
  reference: string | null,
): 'paystack' | 'flutterwave' {
  if (providerParam === 'flutterwave' || providerParam === 'paystack') {
    return providerParam;
  }
  if (reference?.startsWith('CH-FW-')) return 'flutterwave';
  if (reference?.startsWith('CH-PS-')) return 'paystack';
  return 'paystack';
}

export default function CheckoutVerifyPage() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<VerifyStatus>('loading');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const paymentStatus = searchParams.get('status');
    const reference =
      searchParams.get('reference') ||
      searchParams.get('trxref') ||
      searchParams.get('tx_ref');
    const provider = detectProvider(searchParams.get('provider'), reference);

    if (paymentStatus === 'cancelled') {
      setStatus('cancelled');
      return;
    }

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
          clearCart();
          clearCheckoutSession();
        } else {
          setStatus('failed');
        }
      })
      .catch(() => setStatus('failed'));
  }, [searchParams, clearCart]);

  if (status === 'loading') return <LoadingSpinner />;

  return (
    <>
      <SEO
        title={
          status === 'success'
            ? 'Payment Successful'
            : status === 'cancelled'
              ? 'Payment Cancelled'
              : 'Payment Failed'
        }
      />
      <div className="section-padding max-w-lg mx-auto text-center py-16">
        {status === 'success' && order ? (
          <>
            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-semibold page-heading mb-2">Payment Successful</h1>
            <p className="text-brand-accent/60 dark:text-gray-400 mb-6">
              Thank you, {order.full_name}! Your payment has been confirmed and your order is now being processed.
            </p>
            <div className="surface-card p-5 text-left space-y-2 mb-8">
              <p className="text-sm">
                <span className="text-brand-accent/50 dark:text-gray-500">Order Number:</span>{' '}
                <strong className="text-brand-black dark:text-gray-100">{order.order_number}</strong>
              </p>
              <p className="text-sm">
                <span className="text-brand-accent/50 dark:text-gray-500">Total Paid:</span>{' '}
                <strong className="text-brand-pink">{formatPrice(order.total)}</strong>
              </p>
              <p className="text-sm">
                <span className="text-brand-accent/50 dark:text-gray-500">Email:</span>{' '}
                {order.email}
              </p>
              <p className="text-sm">
                <span className="text-brand-accent/50 dark:text-gray-500">Payment Method:</span>{' '}
                <strong className="text-brand-black dark:text-gray-100 capitalize">
                  {order.payment_method_display || order.payment_method || '—'}
                </strong>
              </p>
              {order.payment_reference && (
                <p className="text-sm">
                  <span className="text-brand-accent/50 dark:text-gray-500">Transaction ID:</span>{' '}
                  <strong className="text-brand-black dark:text-gray-100">{order.payment_reference}</strong>
                </p>
              )}
            </div>
            <p className="text-sm text-brand-accent/60 dark:text-gray-400 mb-6">
              A confirmation email with your order details and transaction ID has been sent to your inbox.
            </p>
            <Link to="/shop" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </>
        ) : status === 'cancelled' ? (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-semibold page-heading mb-2">Payment Cancelled</h1>
            <p className="text-brand-accent/60 dark:text-gray-400 mb-4">
              You cancelled the payment. No money was charged.
            </p>
            <p className="text-sm text-brand-accent/50 dark:text-gray-500 mb-8">
              Your bag and checkout details are still saved. You can return to checkout and try again whenever you are ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/checkout" className="btn-primary">
                Try Again
              </Link>
              <Link to="/shop" className="btn-outline">
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-semibold page-heading mb-2">Payment Not Completed</h1>
            <p className="text-brand-accent/60 dark:text-gray-400 mb-4">
              Your payment could not be completed. This may happen if the payment was declined or interrupted.
            </p>
            <p className="text-sm text-brand-accent/50 dark:text-gray-500 mb-8">
              Your bag and checkout details are still saved. Please try again or choose a different payment method.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/checkout" className="btn-primary">
                Try Again
              </Link>
              <Link to="/shop" className="btn-outline">
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
