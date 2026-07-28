import { cn } from '@/lib/cn';
import { formatTime } from '@/lib/datetime';
import { EmptyState, ErrorState, LoadingBlock } from '@/components/ui';
import { groupSlotsByPeriod, removeStaleSlots } from '../lib/slots';

export function SlotPicker({
  slots,
  timeZone,
  selectedStartsAt,
  onSelect,
  isPending,
  isError,
  error,
  onRetry,
}) {
  if (isPending) return <LoadingBlock label="Finding available times" />;
  if (isError) return <ErrorState message={error?.message} onRetry={onRetry} />;

  const usable = removeStaleSlots(slots ?? []);
  const groups = groupSlotsByPeriod(usable, timeZone);

  if (!groups.length) {
    return (
      <EmptyState
        title="No times available on this date"
        description="Try another date, or choose “Any available” to widen the search."
      />
    );
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.id}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-content-muted">
            {group.label}
          </h3>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {group.slots.map((slot) => {
              const isSelected = slot.startsAt === selectedStartsAt;
              return (
                <li key={slot.startsAt}>
                  <button
                    type="button"
                    onClick={() => onSelect(slot)}
                    aria-pressed={isSelected}
                    className={cn(
                      'w-full rounded-token border py-2.5 text-sm font-medium transition-colors',
                      isSelected
                        ? 'border-primary bg-primary text-primary-contrast'
                        : 'border-border bg-surface text-content hover:border-primary/40'
                    )}
                  >
                    {formatTime(slot.startsAt, timeZone)}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
