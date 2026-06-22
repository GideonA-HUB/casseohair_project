import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminFetch, adminFetchList } from '@/lib/adminApi';

interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export default function AdminNewsletter() {
  const queryClient = useQueryClient();

  const { data: subscribers = [], isLoading } = useQuery<Subscriber[]>({
    queryKey: ['admin-newsletter'],
    queryFn: () => adminFetchList<Subscriber>('/api/v1/site/admin/newsletter/'),
  });

  const toggleActive = async (subscriberId: number, isActive: boolean) => {
    await adminFetch(`/api/v1/site/admin/newsletter/${subscriberId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: !isActive }),
    });
    queryClient.invalidateQueries({ queryKey: ['admin-newsletter'] });
  };

  const deleteSubscriber = async (subscriberId: number) => {
    if (!confirm('Remove this subscriber?')) return;
    await adminFetch(`/api/v1/site/admin/newsletter/${subscriberId}/`, { method: 'DELETE' });
    queryClient.invalidateQueries({ queryKey: ['admin-newsletter'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Newsletter Subscribers</h1>
          <p className="text-sm text-slate-500">Customers who subscribed via the website</p>
        </div>
        <span className="rounded-full bg-brand-pink/10 px-4 py-1.5 text-sm font-semibold text-brand-pink">
          {subscribers.length} total
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No subscribers yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Subscribed</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4 text-sm text-slate-900">{subscriber.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          subscriber.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {subscriber.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(subscriber.subscribed_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => toggleActive(subscriber.id, subscriber.is_active)}
                          className="text-sm font-medium text-brand-pink hover:underline"
                        >
                          {subscriber.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSubscriber(subscriber.id)}
                          className="text-sm font-medium text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
