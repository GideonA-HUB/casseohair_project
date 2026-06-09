import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ordersApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/format';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin-dashboard/login');
  }, [isAuthenticated, navigate]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => ordersApi.adminList().then((r) => r.data),
    enabled: isAuthenticated,
  });

  const handleStatusChange = async (orderNumber: string, status: string) => {
    await ordersApi.adminUpdate(orderNumber, { status });
    refetch();
  };

  if (!isAuthenticated) return null;
  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <>
      <SEO title="Manage Orders" />
      <div className="min-h-screen bg-brand-gray-50">
        <header className="bg-white border-b border-brand-gray-100 px-4 py-3 flex items-center gap-4">
          <Link to="/admin-dashboard" className="text-brand-accent/60 hover:text-brand-pink text-sm">← Dashboard</Link>
          <h1 className="font-display font-semibold">Orders</h1>
        </header>

        <div className="section-padding max-w-7xl mx-auto">
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-gray-100 text-left">
                    <th className="p-4 font-medium text-brand-accent/50">Order</th>
                    <th className="p-4 font-medium text-brand-accent/50">Customer</th>
                    <th className="p-4 font-medium text-brand-accent/50">Total</th>
                    <th className="p-4 font-medium text-brand-accent/50">Status</th>
                    <th className="p-4 font-medium text-brand-accent/50">Paid</th>
                    <th className="p-4 font-medium text-brand-accent/50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.results.map((order) => (
                    <tr key={order.id} className="border-b border-brand-gray-50 hover:bg-brand-gray-50/50">
                      <td className="p-4 font-medium">{order.order_number}</td>
                      <td className="p-4">
                        <p>{order.full_name}</p>
                        <p className="text-xs text-brand-accent/40">{order.email}</p>
                      </td>
                      <td className="p-4">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || ''}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">{order.is_paid ? '✓' : '—'}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.order_number, e.target.value)}
                          className="text-xs border border-brand-gray-200 rounded-lg px-2 py-1"
                        >
                          {['pending', 'paid', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
