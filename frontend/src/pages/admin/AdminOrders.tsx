import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  state: string;
  total_amount: number;
  payment_method: string;
  transaction_id: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  product_name: string;
  product_slug: string;
  quantity: number;
  price: number;
  hair_length: string;
  hair_density: string;
  lace_type: string;
  hair_color: string;
}

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/v1/admin/orders/?status=${statusFilter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
  });

  const updateOrderStatus = async (orderId: number, status: string) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/admin/orders/${orderId}/status/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    // Refetch orders
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-brand-black">Orders Management</h1>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-brand-gray-200 focus:border-brand-pink outline-none"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-brand-gray-100 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Order #</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {orders?.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-brand-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-brand-pink">{order.order_number}</td>
                    <td className="px-6 py-4 text-sm text-brand-accent">{order.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-brand-accent">{order.customer_email}</td>
                    <td className="px-6 py-4 text-sm text-brand-accent">{order.customer_phone}</td>
                    <td className="px-6 py-4 text-sm font-medium text-brand-accent">
                      ₦{order.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.order_status]}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-accent">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-brand-pink hover:text-brand-pink/80 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-brand-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-brand-black">Order #{selectedOrder.order_number}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-brand-accent hover:text-brand-pink"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-brand-black mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-brand-accent/60">Name</p>
                    <p className="font-medium text-brand-accent">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-accent/60">Email</p>
                    <p className="font-medium text-brand-accent">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-accent/60">Phone</p>
                    <p className="font-medium text-brand-accent">{selectedOrder.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-accent/60">Delivery Address</p>
                    <p className="font-medium text-brand-accent">{selectedOrder.delivery_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-accent/60">City</p>
                    <p className="font-medium text-brand-accent">{selectedOrder.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-accent/60">State</p>
                    <p className="font-medium text-brand-accent">{selectedOrder.state}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold text-brand-black mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-brand-accent/60">Payment Method</p>
                    <p className="font-medium text-brand-accent">{selectedOrder.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-accent/60">Transaction ID</p>
                    <p className="font-medium text-brand-accent">{selectedOrder.transaction_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-accent/60">Payment Status</p>
                    <p className="font-medium text-brand-accent">{selectedOrder.payment_status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-accent/60">Total Amount</p>
                    <p className="font-medium text-brand-pink text-xl">₦{selectedOrder.total_amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-brand-black mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="bg-brand-gray-50 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-brand-accent/60">Product</p>
                          <p className="font-medium text-brand-accent">{item.product_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-brand-accent/60">Quantity</p>
                          <p className="font-medium text-brand-accent">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-brand-accent/60">Price</p>
                          <p className="font-medium text-brand-accent">₦{item.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-brand-accent/60">Hair Length</p>
                          <p className="font-medium text-brand-accent">{item.hair_length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-brand-accent/60">Hair Density</p>
                          <p className="font-medium text-brand-accent">{item.hair_density}</p>
                        </div>
                        <div>
                          <p className="text-sm text-brand-accent/60">Lace Type</p>
                          <p className="font-medium text-brand-accent">{item.lace_type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-brand-accent/60">Hair Color</p>
                          <p className="font-medium text-brand-accent">{item.hair_color}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status Update */}
              <div>
                <h3 className="text-lg font-semibold text-brand-black mb-4">Update Order Status</h3>
                <div className="flex gap-4">
                  {Object.keys(statusColors).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedOrder.order_status === status
                          ? statusColors[status]
                          : 'bg-brand-gray-100 text-brand-accent hover:bg-brand-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
