import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { formatPrice } from '@/utils/format';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore();
  const currencySettings = useCurrencyStore((s) => s.settings);
  const deliveryFee = parseFloat(currencySettings.local_delivery_fee) || 4000;
  const subtotal = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-luxury-lg flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-brand-gray-100">
              <h2 className="text-lg font-display font-semibold">Your Bag</h2>
              <button onClick={closeCart} className="p-2 hover:bg-brand-gray-50 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-brand-accent/50 mb-4">Your bag is empty</p>
                  <button onClick={closeCart} className="btn-primary text-sm">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 rounded-card bg-brand-gray-50">
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-white flex-shrink-0">
                      {item.product.primary_image ? (
                        <img src={item.product.primary_image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-accent/20">✦</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                      <p className="text-sm font-semibold mt-1">{formatPrice(item.product.current_price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-brand-gray-200 flex items-center justify-center text-sm hover:border-brand-pink"
                        >
                          −
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-brand-gray-200 flex items-center justify-center text-sm hover:border-brand-pink"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto text-xs text-brand-accent/40 hover:text-brand-pink"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-brand-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-accent/60">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-accent/60">Delivery (Nigeria)</span>
                  <span className="font-medium">{formatPrice(deliveryFee)}</span>
                </div>
                <p className="text-[11px] text-brand-accent/40">
                  International delivery (US, UK, Canada) is calculated at checkout.
                </p>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-brand-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(subtotal + deliveryFee)}</span>
                </div>
                <Link to="/checkout" onClick={closeCart} className="btn-primary block text-center w-full">
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
