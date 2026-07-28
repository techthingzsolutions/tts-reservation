import { cn } from '@/lib/cn';
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_TONES,
} from '@/constants/bookingStatus';

const TONES = {
  neutral: 'bg-surface-muted text-content-muted border-border',
  primary: 'bg-primary-soft text-primary border-primary/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
};

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        TONES[tone] ?? TONES.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}

/** Booking status badge - tone and label come from the status constants. */
export function StatusBadge({ status, className }) {
  return (
    <Badge tone={BOOKING_STATUS_TONES[status] ?? 'neutral'} className={className}>
      {BOOKING_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
