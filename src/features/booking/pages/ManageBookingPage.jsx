import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardBody,
  ErrorState,
  LoadingBlock,
  Modal,
  StatusBadge,
} from '@/components/ui';
import { formatDate, formatTimeRange } from '@/lib/datetime';
import { formatAmount } from '@/lib/formatAmount';
import { queryKeys } from '@/constants/queryKeys';
import { BOOKING_STATUS, canTransition } from '@/constants/bookingStatus';
import { useToast } from '@/app/providers/ToastProvider';
import { useTenant } from '@/features/tenant/hooks/useTenant';
import { bookingApi } from '../api/bookingApi';

/**
 * Token-link based self service (blueprint Phase 2). No account, no password -
 * possession of the token in the confirmation email is the authorisation.
 *
 * Reschedule is not built yet; it reuses the BookingPage slot picker with the
 * existing booking excluded from availability. See docs/blueprint-mapping.md.
 */
export function ManageBookingPage() {
  const { token } = useParams();
  const { timeZone } = useTenant();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    data: booking,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.bookings.byToken(token),
    queryFn: () => bookingApi.getByToken(token),
  });

  const cancel = useMutation({
    mutationFn: () => bookingApi.cancelByToken(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.byToken(token) });
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
      setConfirmOpen(false);
      toast.success('Your booking has been cancelled.');
    },
    onError: (mutationError) => toast.error(mutationError.message),
  });

  if (isPending)
    return <LoadingBlock label="Loading your booking" className="min-h-[60vh]" />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

  const canCancel = canTransition(booking.status, BOOKING_STATUS.CANCELLED);

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-content">Your booking</h1>

      <Card>
        <CardBody className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-content-muted">{booking.reference}</span>
            <StatusBadge status={booking.status} />
          </div>
          <Row label="Service" value={booking.service?.name} />
          <Row label="With" value={booking.staff?.name} />
          <Row label="Date" value={formatDate(booking.startsAt, timeZone)} />
          <Row
            label="Time"
            value={formatTimeRange(booking.startsAt, booking.endsAt, timeZone)}
          />
          <div className="flex items-baseline justify-between border-t border-border pt-3">
            <span className="font-medium">Total</span>
            <span className="text-lg font-semibold">{formatAmount(booking.price)}</span>
          </div>
        </CardBody>
      </Card>

      <div className="mt-4 space-y-2">
        <Button variant="secondary" fullWidth disabled title="Coming in Phase 2">
          Reschedule
        </Button>
        <Button
          variant="danger"
          fullWidth
          disabled={!canCancel}
          onClick={() => setConfirmOpen(true)}
        >
          {canCancel ? 'Cancel booking' : 'This booking cannot be cancelled'}
        </Button>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Cancel this booking?"
        description="This frees your slot for someone else and cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              loading={cancel.isPending}
              onClick={() => cancel.mutate()}
            >
              Yes, cancel
            </Button>
          </>
        }
      >
        <p className="text-sm text-content-muted">
          {booking.service?.name} on {formatDate(booking.startsAt, timeZone)} at{' '}
          {formatTimeRange(booking.startsAt, booking.endsAt, timeZone)}.
        </p>
      </Modal>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-content-muted">{label}</span>
      <span className="text-right font-medium text-content">{value ?? '—'}</span>
    </div>
  );
}
