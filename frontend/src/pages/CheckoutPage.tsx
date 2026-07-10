import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck } from 'lucide-react';
import SEO from '@/components/SEO';
import { ordersApi, paymentsApi } from '@/api';
import { useCartStore } from '@/store/cartStore';
import { saveCheckoutDraft, loadCheckoutDraft, savePendingOrder } from '@/lib/checkoutSession';
import { formatPrice } from '@/utils/format';

const checkoutSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Delivery address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().default('Nigeria'),
  order_notes: z.string().optional(),
  payment_method: z.literal('flutterwave'),
  agreed_to_terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to our Terms of Service and Refund Policy before placing your order.',
  }),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const labelClass = 'text-sm font-medium mb-2 block text-brand-accent';
const errorClass = 'text-red-500 text-xs mt-1';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getTotal();
  const deliveryFee = 4000;
  const total = subtotal + deliveryFee;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'Nigeria',
      payment_method: 'flutterwave',
      agreed_to_terms: false,
    },
  });

  const agreedToTerms = watch('agreed_to_terms');

  useEffect(() => {
    const draft = loadCheckoutDraft<CheckoutForm>();
    if (draft) {
      reset({
        ...draft,
        payment_method: 'flutterwave',
        agreed_to_terms: draft.agreed_to_terms ?? false,
      });
    }
  }, [reset]);

  if (items.length === 0) {
    return (
      <div className="section-padding text-center py-20">
        <p className="text-brand-accent/50 mb-4">Your bag is empty</p>
        <button onClick={() => navigate('/shop')} className="btn-primary rounded-full px-8">
          Continue Shopping
        </button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true);
    setError('');
    try {
      const orderData = {
        ...data,
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
      };
      const orderRes = await ordersApi.checkout(orderData);
      const order = orderRes.data;

      saveCheckoutDraft(data);
      savePendingOrder(order.order_number);

      const paymentRes = await paymentsApi.initialize(order.order_number, 'flutterwave');
      window.location.href = paymentRes.data.authorization_url;
    } catch (err: unknown) {
      let message = err instanceof Error ? err.message : 'Checkout failed. Please try again.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as {
          response?: { data?: { detail?: string; agreed_to_terms?: string[] } };
        };
        const data = axiosErr.response?.data;
        if (data?.agreed_to_terms?.[0]) {
          message = data.agreed_to_terms[0];
        } else if (data?.detail) {
          message = data.detail;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Checkout" description="Complete your luxury hair order" />

      <div className="section-padding max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-pink mb-2">
            Secure Checkout
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-brand-black">
            Checkout
          </h1>
          <p className="text-sm text-brand-accent/60 mt-1">
            Complete your delivery details and pay securely.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Order summary — first on mobile, sticky right on desktop */}
          <aside className="order-1 lg:order-2 lg:col-span-5">
            <div className="bg-white rounded-luxury shadow-luxury border border-brand-gray-100 p-5 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-display font-semibold text-brand-black mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-start">
                    <div className="h-14 w-14 rounded-lg overflow-hidden bg-brand-gray-50 shrink-0">
                      {item.product.primary_image ? (
                        <img
                          src={item.product.primary_image}
                          alt={item.product.name}
                          className="h-full w-full object-cover object-[center_top]"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-brand-pink/30 text-lg">
                          ✦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-black truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-brand-accent/50">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium whitespace-nowrap">
                      {formatPrice(parseFloat(item.product.current_price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-gray-100 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-accent/60">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-accent/60">Delivery (Flat Rate)</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-brand-gray-100">
                  <span>Total</span>
                  <span className="text-brand-pink">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-brand-accent/40 pt-1">VAT not applicable</p>
              </div>
            </div>
          </aside>

          {/* Checkout form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="order-2 lg:order-1 lg:col-span-7 space-y-6"
          >
            <div className="bg-white rounded-luxury shadow-luxury border border-brand-gray-100 p-5 md:p-8">
              <h2 className="text-lg font-display font-semibold text-brand-black mb-1">
                Delivery Details
              </h2>
              <p className="text-sm text-brand-accent/60 mb-6">
                All fields marked with * are required.
              </p>

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    {...register('full_name')}
                    className="input-luxury"
                    placeholder="Your full name"
                    required
                  />
                  {errors.full_name && <p className={errorClass}>{errors.full_name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="input-luxury"
                      placeholder="you@example.com"
                      required
                    />
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="input-luxury"
                      placeholder="+234..."
                      required
                    />
                    {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Delivery Address *</label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="input-luxury resize-none"
                    placeholder="Street address, building, apartment..."
                    required
                  />
                  {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input
                      {...register('city')}
                      className="input-luxury"
                      placeholder="City"
                      required
                    />
                    {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <input
                      {...register('state')}
                      className="input-luxury"
                      placeholder="State"
                      required
                    />
                    {errors.state && <p className={errorClass}>{errors.state.message}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Order Notes (optional)</label>
                  <textarea
                    {...register('order_notes')}
                    rows={3}
                    className="input-luxury resize-none"
                    placeholder="Special delivery instructions..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-luxury shadow-luxury border border-brand-gray-100 p-5 md:p-8">
              <h2 className="text-lg font-display font-semibold text-brand-black mb-4">
                Payment Method
              </h2>

              <input type="hidden" {...register('payment_method')} />

              <div className="flex items-center gap-3 p-4 rounded-card border border-brand-pink bg-brand-pink/5 shadow-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-pink">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
                <div>
                  <span className="text-sm font-semibold text-brand-black block">Flutterwave</span>
                  <span className="text-xs text-brand-accent/50">Card, bank transfer &amp; mobile money</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-brand-accent/50 dark:text-gray-500">
                Paystack is temporarily unavailable. All payments are processed securely via Flutterwave.
              </p>
            </div>

            <div className="surface-card p-5 md:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink">
                  <ShieldCheck className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg font-display font-semibold page-heading">
                    Legal Agreement
                  </h2>
                  <p className="text-sm page-muted mt-0.5">
                    Please review our policies before completing your purchase.
                  </p>
                </div>
              </div>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200 ${
                  agreedToTerms
                    ? 'border-brand-pink bg-brand-pink/5 shadow-sm'
                    : errors.agreed_to_terms
                      ? 'border-red-300 bg-red-50/80 dark:border-red-500/40 dark:bg-red-950/30'
                      : 'border-brand-gray-200 hover:border-brand-pink/40 dark:border-white/15'
                }`}
              >
                <input
                  type="checkbox"
                  {...register('agreed_to_terms')}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-gray-300 accent-brand-pink"
                />
                <span className="text-sm leading-relaxed text-brand-accent dark:text-gray-200">
                  I have read and agree to the{' '}
                  <Link
                    to="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-pink hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/refund"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-pink hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Refund Policy
                  </Link>
                  . I understand these agreements are binding and apply to this order.
                </span>
              </label>
              {errors.agreed_to_terms && (
                <p className={`${errorClass} mt-2`}>{errors.agreed_to_terms.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="btn-primary w-full py-3.5 rounded-full text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </button>

            <p className="text-center text-xs text-brand-accent/40 pb-2">
              Your payment is processed securely via your selected provider.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
