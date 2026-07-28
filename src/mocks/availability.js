import { fromZonedTime } from 'date-fns-tz';
import { addDays, differenceInMinutes, parseISO } from 'date-fns';
import { ACTIVE_BOOKING_STATUSES } from '@/constants/bookingStatus';
import { toDateKey } from '@/lib/datetime';

/**
 * Mock implementation of the availability algorithm (blueprint 5.2).
 *
 * This lives in the MOCK layer on purpose. In production this runs in Laravel:
 * the frontend only ever consumes GET /availability. It is written faithfully
 * so the UI is exercised against realistic data - gaps, buffers, day-offs and
 * fully-booked days all appear.
 *
 * Slots are never stored. They are derived from rules on every request.
 */

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const weekdayOf = (dateKey) => parseISO(`${dateKey}T12:00:00`).getDay();

/** Local minutes-from-midnight on `dateKey` -> UTC Date. */
function localMinutesToUtc(dateKey, minutes, timeZone) {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  return fromZonedTime(`${dateKey}T${h}:${m}:00`, timeZone);
}

/** Subtract busy intervals from a free window; both are [start, end) minutes. */
function subtractIntervals(window, busyIntervals) {
  let free = [window];
  for (const busy of busyIntervals) {
    const next = [];
    for (const slice of free) {
      if (busy.end <= slice.start || busy.start >= slice.end) {
        next.push(slice);
        continue;
      }
      if (busy.start > slice.start) next.push({ start: slice.start, end: busy.start });
      if (busy.end < slice.end) next.push({ start: busy.end, end: slice.end });
    }
    free = next;
  }
  return free;
}

/**
 * @returns {Array<{ startsAt: string, endsAt: string, staffIds: number[] }>}
 *   UTC ISO instants, sorted, deduped by start time.
 */
export function generateSlots({
  dateKey,
  service,
  staffId = null,
  staffList,
  bookings,
  businessHours,
  holidays,
  timeZone,
  rules,
  now = new Date(),
}) {
  // 3. Holiday closes the whole day.
  if (holidays.some((h) => h.date === dateKey)) return [];

  const weekday = weekdayOf(dateKey);

  // 2. Business hours for that weekday.
  const hours = businessHours.find((h) => h.dayOfWeek === weekday);
  if (!hours?.openTime || !hours?.closeTime) return [];
  const openMin = toMinutes(hours.openTime);
  const closeMin = toMinutes(hours.closeTime);

  // 4. Candidate staff: the one requested, else everyone assigned to the service.
  const candidates = staffList.filter(
    (s) =>
      s.isActive &&
      service.staffIds.includes(s.id) &&
      (staffId === null || s.id === staffId)
  );

  const increment = rules.slotIncrementMinutes ?? 15;
  const duration = service.durationMinutes;
  const bufferBefore = service.bufferBefore ?? 0;
  const bufferAfter = service.bufferAfter ?? 0;

  const earliest = new Date(now.getTime() + (rules.minimumLeadTimeMinutes ?? 0) * 60000);
  const latest = addDays(now, rules.maximumAdvanceDays ?? 365);

  /** @type {Map<string, Set<number>>} startsAt ISO -> staff ids */
  const byStart = new Map();

  for (const staff of candidates) {
    // 5a. Staff schedule window for that weekday.
    const shift = staff.schedule.find((s) => s.dayOfWeek === weekday);
    if (!shift) continue;

    // 5b. Intersect with business hours.
    const windowStart = Math.max(toMinutes(shift.startTime), openMin);
    const windowEnd = Math.min(toMinutes(shift.endTime), closeMin);
    if (windowEnd - windowStart < duration) continue;

    const busy = [];

    // 5c. Subtract approved time off.
    for (const off of staff.timeOff ?? []) {
      if (off.date !== dateKey) continue;
      busy.push({ start: toMinutes(off.startTime), end: toMinutes(off.endTime) });
    }

    // 5d. Subtract existing bookings, expanded by this service's buffers.
    for (const booking of bookings) {
      if (booking.staffId !== staff.id) continue;
      if (!ACTIVE_BOOKING_STATUSES.includes(booking.status)) continue;
      if (toDateKey(booking.startsAt, timeZone) !== dateKey) continue;

      const dayStartUtc = localMinutesToUtc(dateKey, 0, timeZone);
      const startMin = differenceInMinutes(parseISO(booking.startsAt), dayStartUtc);
      const endMin = differenceInMinutes(parseISO(booking.endsAt), dayStartUtc);
      busy.push({
        start: startMin - bufferAfter,
        end: endMin + bufferBefore,
      });
    }

    // 5e/5f. Slice the free windows and keep only slices the service fits in.
    const freeWindows = subtractIntervals({ start: windowStart, end: windowEnd }, busy);

    for (const free of freeWindows) {
      const firstStart = Math.ceil(free.start / increment) * increment;
      for (let start = firstStart; start + duration <= free.end; start += increment) {
        const startsAtUtc = localMinutesToUtc(dateKey, start, timeZone);

        // 7 & 8. Lead time and maximum advance.
        if (startsAtUtc < earliest) continue;
        if (startsAtUtc > latest) continue;

        const iso = startsAtUtc.toISOString();
        if (!byStart.has(iso)) byStart.set(iso, new Set());
        byStart.get(iso).add(staff.id);
      }
    }
  }

  // 6 & 9. Merge, dedupe by start time, sort.
  return [...byStart.entries()]
    .map(([startsAt, staffIds]) => ({
      startsAt,
      endsAt: new Date(parseISO(startsAt).getTime() + duration * 60000).toISOString(),
      staffIds: [...staffIds].sort((a, b) => a - b),
    }))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
