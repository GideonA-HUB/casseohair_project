import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface ActivityLog {
  id: number;
  user: string;
  action: string;
  description: string;
  ip_address: string;
  created_at: string;
}

export default function AdminActivityLogs() {
  const { data: logs, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/site/activity-logs/admin/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch activity logs');
      return response.json();
    },
  });

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      login: 'bg-green-100 text-green-800',
      logout: 'bg-gray-100 text-gray-800',
      create: 'bg-blue-100 text-blue-800',
      update: 'bg-yellow-100 text-yellow-800',
      delete: 'bg-red-100 text-red-800',
    };
    return colors[action] || 'bg-brand-gray-100 text-brand-accent';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-brand-black">Admin Activity Logs</h1>
      </motion.div>

      {/* Logs Table */}
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
        ) : logs && logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">IP Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {logs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-brand-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-brand-black">{log.user}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-accent">{log.description}</td>
                    <td className="px-6 py-4 text-sm text-brand-accent/60">{log.ip_address}</td>
                    <td className="px-6 py-4 text-sm text-brand-accent/60">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-brand-accent/60">
            No activity logs found
          </div>
        )}
      </motion.div>
    </div>
  );
}
