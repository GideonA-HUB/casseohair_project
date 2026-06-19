import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export default function AdminNewsletter() {
  const { data: subscribers, isLoading } = useQuery<Subscriber[]>({
    queryKey: ['admin-newsletter'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/site/newsletter/admin/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch subscribers');
      return response.json();
    },
  });

  const toggleActive = async (subscriberId: number, isActive: boolean) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/newsletter/${subscriberId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active: !isActive }),
    });
    // Refetch subscribers
  };

  const deleteSubscriber = async (subscriberId: number) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/newsletter/${subscriberId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Refetch subscribers
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-brand-black">Newsletter Subscribers</h1>
        <div className="text-sm text-brand-accent/60">
          Total: {subscribers?.length || 0} subscribers
        </div>
      </motion.div>

      {/* Subscribers Table */}
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
        ) : subscribers && subscribers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Subscribed At</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {subscribers.map((subscriber, index) => (
                  <motion.tr
                    key={subscriber.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-brand-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-brand-accent">{subscriber.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        subscriber.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subscriber.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-accent">
                      {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleActive(subscriber.id, subscriber.is_active)}
                          className="text-brand-pink hover:text-brand-pink/80 font-medium text-sm"
                        >
                          {subscriber.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteSubscriber(subscriber.id)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-brand-accent/60">
            No subscribers found
          </div>
        )}
      </motion.div>
    </div>
  );
}
