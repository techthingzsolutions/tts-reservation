import { useState } from 'react';
import { addDays } from 'date-fns';
import { cn } from '@/lib/cn';
import {
  buildDateRange,
  dateKeyToUtc,
  formatInZone,
  toDateKey,
  todayKey,
} from '@/lib/datetime';

const VISIBLE_DAYS = 7;

/**
 * Horizontal date picker. Mobile-first: the majority of bookings come from
 * phones (blueprint Phase 2), so this scrolls rather than opening a calendar.
 */
export function DateStrip({ selectedDate, onSelect, timeZone, maxAdvanceDays = 60 }) {
  const today = todayKey(timeZone);
  const [windowStart, setWindowStart] = useState(selectedDate || today);

  const dates = buildDateRange(windowStart, VISIBLE_DAYS, timeZone);
  const lastAllowedKey = toDateKey(
    addDays(dateKeyToUtc(today, timeZone), maxAdvanceDays),
    timeZone
  );

  const canGoBack = windowStart > today;
  const canGoForward = dates[dates.length - 1] < lastAllowedKey;

  /** Move the window by `days`, clamped so it never starts before today. */
  const shift = (days) => {
    const next = toDateKey(addDays(dateKeyToUtc(windowStart, timeZone), days), timeZone);
    setWindowStart(next < today ? today : next);
  };

  return (
    <div className="flex items-center gap-2">
      <StripButton
        label="Previous week"
        disabled={!canGoBack}
        onClick={() => shift(-VISIBLE_DAYS)}
      >
        ‹
      </StripButton>

      <ul className="flex flex-1 gap-2 overflow-x-auto pb-1">
        {dates.map((dateKey) => {
          const isSelected = dateKey === selectedDate;
          const isToday = dateKey === today;
          const disabled = dateKey < today || dateKey > lastAllowedKey;
          const dayUtc = dateKeyToUtc(dateKey, timeZone);

          return (
            <li key={dateKey} className="shrink-0">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(dateKey)}
                aria-pressed={isSelected}
                className={cn(
                  'flex w-14 flex-col items-center gap-0.5 rounded-token border px-2 py-2.5 transition-colors',
                  isSelected
                    ? 'border-primary bg-primary text-primary-contrast'
                    : 'border-border bg-surface hover:border-primary/40',
                  disabled && 'cursor-not-allowed opacity-40 hover:border-border'
                )}
              >
                <span className="text-[11px] uppercase tracking-wide opacity-80">
                  {formatInZone(dayUtc, 'EEE', timeZone)}
                </span>
                <span className="text-lg font-semibold leading-none">
                  {formatInZone(dayUtc, 'd', timeZone)}
                </span>
                <span className="text-[11px] opacity-80">
                  {isToday ? 'Today' : formatInZone(dayUtc, 'MMM', timeZone)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <StripButton
        label="Next week"
        disabled={!canGoForward}
        onClick={() => shift(VISIBLE_DAYS)}
      >
        ›
      </StripButton>
    </div>
  );
}

function StripButton({ children, label, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-10 w-8 shrink-0 items-center justify-center rounded-token border border-border bg-surface text-lg text-content-muted disabled:opacity-30"
      {...props}
    >
      {children}
    </button>
  );
}
