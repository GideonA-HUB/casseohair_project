import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminNotifications() {
  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/notifications/admin/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    },
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      order: 'bg-blue-100 text-blue-800',
      review: 'bg-purple-100 text-purple-800',
      contact: 'bg-green-100 text-green-800',
      system: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-brand-gray-100 text-brand-accent';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-brand-black">Notifications</h1>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl shadow-lg border p-6 ${
                !notification.is_read ? 'border-brand-pink' : 'border-brand-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                    {notification.type}
                  </span>
                  {!notification.is_read && (
                    <span className="w-2 h-2 rounded-full bg-brand-pink" />
                  )}
                </div>
                <span className="text-xs text-brand-accent/40">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
              <h3 className="font-semibold text-brand-black mb-2">{notification.title}</h3>
              <p className="text-brand-accent">{notification.message}</p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-brand-accent/60">
            No notifications found
          </div>
        )}
      </motion.div>
    </div>
  );
}
