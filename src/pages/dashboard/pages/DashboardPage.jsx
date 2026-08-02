import { Card, CardBody, LoadingBlock, PageHeader, StatusBadge } from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';
import { formatAmount } from '@/lib/formatAmount';
import { formatTimeRange, toDateKey, todayKey } from '@/lib/datetime';
import { BOOKING_STATUS } from '@/constants/bookingStatus';
import { useAuth } from '@/app/providers/AuthProvider';
import { useTenant } from '@/pages/tenant/hooks/useTenant';
import { useBookings } from '@/pages/bookings/hooks/useBookings';

export function DashboardPage() {
  const { user } = useAuth();
  const { timeZone } = useTenant();
  const { data, isPending } = useBookings();

  if (isPending) return <LoadingBlock label="Loading dashboard" />;

  const bookings = data;
  const today = todayKey(timeZone);
  const todays = bookings
    .filter((b) => toDateKey(b.startsAt, timeZone) === today)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  const revenueToday = todays
    .filter((b) => b.status !== BOOKING_STATUS.CANCELLED)
    .reduce((sum, b) => sum + Number(b.price), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good day, ${user?.name?.split(' ')[0] ?? 'there'}`}
        description="Today at a glance."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Bookings today" value={todays.length} />
        <Stat
          label="Pending confirmation"
          value={bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length}
        />
        <Stat label="Expected revenue today" value={formatAmount(revenueToday)} />
      </div>

      <Card>
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-content">Today&apos;s schedule</h2>
        </div>
        <CardBody>
          {todays.length === 0 ? (
            <p className="py-6 text-center text-sm text-content-muted">
              Nothing booked today.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {todays.map((booking) => (
                <li key={booking.id} className="flex items-center gap-4 py-3">
                  <span className="w-40 shrink-0 text-sm text-content-muted">
                    {formatTimeRange(booking.startsAt, booking.endsAt, timeZone)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-content">
                      {booking.customer?.name}
                    </span>
                    <span className="block truncate text-sm text-content-muted">
                      {booking.service?.name} · {booking.staff?.name}
                    </span>
                  </span>
                  <StatusBadge status={booking.status} />
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <PhasePlaceholder
        phase="Phase 3 · Admin dashboard"
        title="Still to build here"
        notes="Exit criteria: the owner can run a full day without touching the database."
        items={[
          'Drag-to-reschedule calendar (day / week / month)',
          'Manual booking entry for walk-ins and phone bookings',
          'Staff schedule and leave management',
          'Reports: revenue, staff utilisation, no-show rate',
          'Settings: hours, buffers, lead time, cancellation policy',
        ]}
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <Card>
      <CardBody>
        <p className="text-sm text-content-muted">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-content">{value}</p>
      </CardBody>
    </Card>
  );
}
