import { Card, CardBody } from '@/components/ui';
import { formatAmount, formatDuration } from '@/lib/formatAmount';
import { formatDate, formatTimeRange } from '@/lib/datetime';

/** Sticky recap of the current selection. Shown from step 2 onward. */
export function BookingSummary({ service, staff, slot, timeZone }) {
  if (!service) return null;

  return (
    <Card className="bg-surface-muted">
      <CardBody className="space-y-2 text-sm">
        <Row label="Service" value={service.name} />
        <Row label="Duration" value={formatDuration(service.durationMinutes)} />
        <Row label="With" value={staff ? staff.name : 'Any available'} />
        {slot && (
          <>
            <Row label="Date" value={formatDate(slot.startsAt, timeZone)} />
            <Row
              label="Time"
              value={formatTimeRange(slot.startsAt, slot.endsAt, timeZone)}
            />
          </>
        )}
        <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
          <span className="font-medium text-content">Total</span>
          <span className="text-lg font-semibold text-content">
            {formatAmount(service.price)}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-content-muted">{label}</span>
      <span className="text-right font-medium text-content">{value}</span>
    </div>
  );
}
