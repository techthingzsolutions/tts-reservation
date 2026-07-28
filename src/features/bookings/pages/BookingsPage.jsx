import { useState } from 'react';
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  PageHeader,
  Select,
  StatusBadge,
} from '@/components/ui';
import { formatDate, formatTimeRange } from '@/lib/datetime';
import { formatAmount } from '@/lib/formatAmount';
import { BOOKING_STATUS_LABELS, allowedTransitions } from '@/constants/bookingStatus';
import { useToast } from '@/app/providers/ToastProvider';
import { useTenant } from '@/features/tenant/hooks/useTenant';
import { useBookings, useUpdateBookingStatus } from '../hooks/useBookings';

/**
 * Admin booking list. Demonstrates the state machine end to end: the status
 * dropdown only offers transitions the server will accept.
 */
export function BookingsPage() {
  const { timeZone } = useTenant();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState('');

  const filters = statusFilter ? { status: statusFilter } : {};
  const { data, isPending, isError, error, refetch } = useBookings(filters);
  const updateStatus = useUpdateBookingStatus();

  const handleStatusChange = (booking, nextStatus) => {
    if (!nextStatus) return;
    updateStatus.mutate(
      { id: booking.id, status: nextStatus },
      {
        onSuccess: () =>
          toast.success(
            `${booking.reference} marked ${BOOKING_STATUS_LABELS[nextStatus].toLowerCase()}.`
          ),
        onError: (mutationError) => toast.error(mutationError.message),
      }
    );
  };

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="Every appointment, newest date first."
        action={
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-44"
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        }
      />

      {isPending && <LoadingBlock label="Loading bookings" />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {!isPending && !isError && data.length === 0 && (
        <EmptyState
          title="No bookings yet"
          description="Bookings made online or entered manually will appear here."
        />
      )}

      {!isPending && !isError && data.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-content-muted">
                <Th>Reference</Th>
                <Th>Customer</Th>
                <Th>Service</Th>
                <Th>Staff</Th>
                <Th>When</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th>Change to</Th>
              </tr>
            </thead>
            <tbody>
              {data.map((booking) => {
                const transitions = allowedTransitions(booking.status);
                return (
                  <tr key={booking.id} className="border-b border-border last:border-0">
                    <Td className="font-mono text-content-muted">{booking.reference}</Td>
                    <Td className="font-medium">{booking.customer?.name ?? '—'}</Td>
                    <Td>{booking.service?.name ?? '—'}</Td>
                    <Td>{booking.staff?.name ?? '—'}</Td>
                    <Td>
                      <span className="block">
                        {formatDate(booking.startsAt, timeZone)}
                      </span>
                      <span className="text-content-muted">
                        {formatTimeRange(booking.startsAt, booking.endsAt, timeZone)}
                      </span>
                    </Td>
                    <Td>{formatAmount(booking.price)}</Td>
                    <Td>
                      <StatusBadge status={booking.status} />
                    </Td>
                    <Td>
                      {transitions.length === 0 ? (
                        <span className="text-content-muted">—</span>
                      ) : (
                        <Select
                          value=""
                          aria-label={`Change status of ${booking.reference}`}
                          disabled={updateStatus.isPending}
                          onChange={(event) =>
                            handleStatusChange(booking, event.target.value)
                          }
                          className="h-9 w-36 text-sm"
                        >
                          <option value="">Select…</option>
                          {transitions.map((status) => (
                            <option key={status} value={status}>
                              {BOOKING_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </Select>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function Th({ children }) {
  return <th className="whitespace-nowrap px-4 py-3 font-medium">{children}</th>;
}

function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
