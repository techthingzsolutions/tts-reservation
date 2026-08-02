import {
  Card,
  ErrorState,
  LoadingBlock,
  PageHeader,
  StatusBadge,
} from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';
import { formatAmount } from '@/lib/formatAmount';
import { formatDateTime } from '@/lib/datetime';
import { useTenant } from '@/pages/tenant/hooks/useTenant';
import { useBookings } from '../hooks/useBookings';

export function BookingsPage() {
  const { timeZone } = useTenant();
  const { data, isPending, isError, error, refetch } = useBookings();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description="Every appointment across your team, newest schedule first."
      />

      {isPending && <LoadingBlock label="Loading bookings" />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {data && (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-content-muted">
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Staff</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((booking) => (
                <tr key={booking.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-content-muted">
                    {formatDateTime(booking.startsAt, timeZone)}
                  </td>
                  <td className="px-4 py-3 font-medium text-content">
                    {booking.customer?.name}
                  </td>
                  <td className="px-4 py-3 text-content-muted">
                    {booking.service?.name}
                  </td>
                  <td className="px-4 py-3 text-content-muted">
                    {booking.staff?.name}
                  </td>
                  <td className="px-4 py-3">{formatAmount(booking.price)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <PhasePlaceholder
        phase="Phase 3 · Admin dashboard"
        title="Booking management still to build"
        items={[
          'Filter by status, staff, service and date range',
          'Manual booking entry for walk-ins and phone bookings',
          'Reschedule and cancel from the list',
          'Bulk actions and CSV export',
        ]}
      />
    </div>
  );
}
