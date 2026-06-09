import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEO from '@/components/SEO';
import { ordersApi, paymentsApi } from '@/api';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/format';

const checkoutSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().default('Nigeria'),
  order_notes: z.string().optional(),
  payment_method: z.enum(['paystack', 'flutterwave']),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getTotal();
  const deliveryFee = 4000;
  const total = subtotal + deliveryFee;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'Nigeria',
      payment_method: 'paystack',
    },
  });

  if (items.length === 0) {
    return (
      <div className="section-padding text-center py-20">
        <p className="text-brand-accent/50 mb-4">Your bag is empty</p>
        <button onClick={() => navigate('/shop')} className="btn-primary">
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

      const paymentRes = await paymentsApi.initialize(order.order_number, data.payment_method);
      clearCart();
      window.location.href = paymentRes.data.authorization_url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Checkout failed. Please try again.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        setError(axiosErr.response?.data?.detail || message);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Checkout" description="Complete your luxury hair order" />
      <div className="section-padding max-w-3xl mx-auto">
        <h1 className="text-2xl font-display font-semibold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name</label>
              <input {...register('full_name')} className="input-luxury" />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <input {...register('email')} type="email" className="input-luxury" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone</label>
                <input {...register('phone')} className="input-luxury" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Delivery Address</label>
              <textarea {...register('address')} rows={2} className="input-luxury resize-none" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">City</label>
                <input {...register('city')} className="input-luxury" />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">State</label>
                <input {...register('state')} className="input-luxury" />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Order Notes (optional)</label>
              <textarea {...register('order_notes')} rows={2} className="input-luxury resize-none" />
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-4 rounded-card border border-brand-gray-200 cursor-pointer hover:border-brand-pink transition-colors has-[:checked]:border-brand-pink has-[:checked]:bg-brand-pink/5">
                  <input type="radio" {...register('payment_method')} value="paystack" className="accent-brand-pink" />
                  <span className="text-sm font-medium">Paystack</span>
                </label>
                <label className="flex items-center gap-2 p-4 rounded-card border border-brand-gray-200 cursor-pointer hover:border-brand-pink transition-colors has-[:checked]:border-brand-pink has-[:checked]:bg-brand-pink/5">
                  <input type="radio" {...register('payment_method')} value="flutterwave" className="accent-brand-pink" />
                  <span className="text-sm font-medium">Flutterwave</span>
                </label>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </button>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-brand-gray-50 rounded-card p-5 space-y-4 sticky top-20">
              <h3 className="font-semibold">Order Summary</h3>
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-brand-accent/70 truncate mr-2">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {formatPrice(parseFloat(item.product.current_price) * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-brand-gray-200 pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-accent/60">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-accent/60">Delivery (Flat Rate)</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-brand-gray-200">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-brand-accent/40">VAT not applicable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
