import { useQuery } from '@tanstack/react-query';
import { adminFetchList, formatNaira } from '@/lib/adminApi';

interface TermsAgreement {
  id: number;
  order_number: string;
  full_name: string;
  email: string;
  phone: string;
  agreed_to_terms: boolean;
  terms_agreed_at: string | null;
  total: string;
  status: string;
  created_at: string;
}

export default function AdminLegalAgreements() {
  const { data: agreements = [], isLoading } = useQuery<TermsAgreement[]>({
    queryKey: ['admin-terms-agreements'],
    queryFn: () => adminFetchList<TermsAgreement>('/api/v1/orders/admin/agreements/'),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Legal Agreements</h1>
          <p className="text-sm text-slate-500">
            Customers who agreed to Terms of Service &amp; Refund Policy at checkout
          </p>
        </div>
        <span className="w-fit rounded-full bg-brand-pink/10 px-4 py-1.5 text-sm font-semibold text-brand-pink">
          {agreements.length} recorded
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : agreements.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No agreements recorded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Order #</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Order Total</th>
                  <th className="px-5 py-4">Agreed At</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agreements.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4 text-sm font-semibold text-brand-pink">{row.order_number}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-900">{row.full_name}</p>
                      <p className="text-xs text-slate-400">{row.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{row.phone}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">{formatNaira(row.total)}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {row.terms_agreed_at
                        ? new Date(row.terms_agreed_at).toLocaleString()
                        : new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Agreed
                      </span>
                      <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                        {row.status}
                      </span>
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
