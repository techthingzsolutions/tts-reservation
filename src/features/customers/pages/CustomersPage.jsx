import { useQuery } from '@tanstack/react-query';
import { Card, ErrorState, LoadingBlock, PageHeader } from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';
import { api } from '@/lib/apiClient';
import { queryKeys } from '@/constants/queryKeys';

export function CustomersPage() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: queryKeys.customers.list(),
    queryFn: () => api.get('/customers').then((r) => r.data),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Visit history and notes, built up automatically from bookings."
      />

      {isPending && <LoadingBlock label="Loading customers" />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {data && (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[38rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-content-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Visits</th>
                <th className="px-4 py-3 font-medium">No-shows</th>
                <th className="px-4 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-content">{customer.name}</td>
                  <td className="px-4 py-3 text-content-muted">
                    <span className="block">{customer.email}</span>
                    <span className="block">{customer.phone}</span>
                  </td>
                  <td className="px-4 py-3">{customer.visitCount}</td>
                  <td className="px-4 py-3">{customer.noShowCount}</td>
                  <td className="px-4 py-3 text-content-muted">{customer.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <PhasePlaceholder
        phase="Phase 3 · Admin dashboard"
        title="Customer records still to build"
        items={[
          'Edit customer details and internal notes',
          'Per-customer booking history',
          'Search and filter',
          'Export to CSV / Excel',
        ]}
      />
    </div>
  );
}
