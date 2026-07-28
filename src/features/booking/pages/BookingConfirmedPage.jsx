import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardBody,
  ErrorState,
  LoadingBlock,
  StatusBadge,
} from '@/components/ui';
import { formatDate, formatTimeRange } from '@/lib/datetime';
import { formatAmount } from '@/lib/formatAmount';
import { manageBookingPath, ROUTES } from '@/constants/routes';
import { queryKeys } from '@/constants/queryKeys';
import { useTenant } from '@/features/tenant/hooks/useTenant';
import { bookingApi } from '../api/bookingApi';

export function BookingConfirmedPage() {
  const { token } = useParams();
  const { timeZone } = useTenant();

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

  if (isPending)
    return <LoadingBlock label="Loading your booking" className="min-h-[60vh]" />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10">
      <div className="mb-6 text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-2xl text-success"
        >
          ✓
        </div>
        <h1 className="text-2xl font-semibold text-content">You&apos;re booked</h1>
        <p className="mt-1 text-sm text-content-muted">
          A confirmation is on its way to {booking.customer?.email}.
        </p>
      </div>

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
        <Link to={manageBookingPath(booking.token)} className="block">
          <Button fullWidth tabIndex={-1}>
            Manage this booking
          </Button>
        </Link>
        <Link
          to={ROUTES.HOME}
          className="block py-2 text-center text-sm text-content-muted underline underline-offset-4"
        >
          Back to home
        </Link>
      </div>
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
