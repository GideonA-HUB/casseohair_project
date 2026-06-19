import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface DashboardMetrics {
  total_orders: number;
  total_revenue: number;
  today_orders: number;
  today_revenue: number;
  week_orders: number;
  week_revenue: number;
  month_orders: number;
  month_revenue: number;
  year_orders: number;
  year_revenue: number;
  pending_reviews: number;
  active_products: number;
  newsletter_subscribers: number;
}

export default function AdminDashboard() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/accounts/metrics/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
      </div>
    );
  }

  const MetricCard = ({ title, value, subtitle, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
    >
      <h3 className="text-sm font-medium text-brand-accent/60 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {subtitle && <p className="text-xs text-brand-accent/40 mt-1">{subtitle}</p>}
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-brand-pink to-brand-pink/80 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard Overview</h1>
        <p className="text-white/80">Welcome back! Here's what's happening with your store.</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Orders"
          value={metrics?.total_orders || 0}
          color="text-brand-pink"
        />
        <MetricCard
          title="Total Revenue"
          value={`₦${(metrics?.total_revenue || 0).toLocaleString()}`}
          color="text-green-600"
        />
        <MetricCard
          title="Active Products"
          value={metrics?.active_products || 0}
          color="text-blue-600"
        />
        <MetricCard
          title="Newsletter Subscribers"
          value={metrics?.newsletter_subscribers || 0}
          color="text-purple-600"
        />
      </motion.div>

      {/* Time-based Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
        >
          <h3 className="text-lg font-semibold text-brand-black mb-4">Today's Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Orders"
              value={metrics?.today_orders || 0}
              color="text-brand-pink"
            />
            <MetricCard
              title="Revenue"
              value={`₦${(metrics?.today_revenue || 0).toLocaleString()}`}
              color="text-green-600"
            />
          </div>
        </motion.div>

        {/* This Week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
        >
          <h3 className="text-lg font-semibold text-brand-black mb-4">This Week</h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Orders"
              value={metrics?.week_orders || 0}
              color="text-brand-pink"
            />
            <MetricCard
              title="Revenue"
              value={`₦${(metrics?.week_revenue || 0).toLocaleString()}`}
              color="text-green-600"
            />
          </div>
        </motion.div>

        {/* This Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
        >
          <h3 className="text-lg font-semibold text-brand-black mb-4">This Month</h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Orders"
              value={metrics?.month_orders || 0}
              color="text-brand-pink"
            />
            <MetricCard
              title="Revenue"
              value={`₦${(metrics?.month_revenue || 0).toLocaleString()}`}
              color="text-green-600"
            />
          </div>
        </motion.div>

        {/* This Year */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
        >
          <h3 className="text-lg font-semibold text-brand-black mb-4">This Year</h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Orders"
              value={metrics?.year_orders || 0}
              color="text-brand-pink"
            />
            <MetricCard
              title="Revenue"
              value={`₦${(metrics?.year_revenue || 0).toLocaleString()}`}
              color="text-green-600"
            />
          </div>
        </motion.div>
      </div>

      {/* Pending Reviews Alert */}
      {metrics && metrics.pending_reviews > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Pending Reviews</h3>
              <p className="text-yellow-600">You have {metrics.pending_reviews} reviews awaiting approval.</p>
            </div>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
              Review Now
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
