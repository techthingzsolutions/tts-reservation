import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { addDays, isSameDay, parseISO, startOfDay } from 'date-fns';

/**
 * Timezone rules (blueprint 5.4). Read this before touching any date code.
 *
 *   Storage   - every timestamp is UTC. The API sends and accepts ISO-8601 UTC.
 *   Admin     - display in the TENANT timezone.
 *   Customer  - display in the CUSTOMER's own browser timezone.
 *   Hours     - business hours are local wall-clock time + tenant timezone.
 *               They are never stored or reasoned about as UTC.
 *   Reports   - group by tenant local date, never UTC date.
 *
 * Nothing in this app should call `new Date().toLocaleString()` directly.
 * Go through these helpers so the timezone choice is always explicit.
 */

export const DEFAULT_TIMEZONE = 'Asia/Manila';

/** The viewer's own timezone, e.g. "Asia/Manila". */
export function getBrowserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
}

function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'string') return parseISO(value);
  return new Date(value);
}

/** Format a UTC instant in an explicit timezone. */
export function formatInZone(utcValue, pattern, timeZone = DEFAULT_TIMEZONE) {
  if (!utcValue) return '';
  return formatInTimeZone(toDate(utcValue), timeZone, pattern);
}

/** "8:30 AM" */
export function formatTime(utcValue, timeZone = DEFAULT_TIMEZONE) {
  return formatInZone(utcValue, 'h:mm a', timeZone);
}

/** "Mon, 03 Aug 2026" */
export function formatDate(utcValue, timeZone = DEFAULT_TIMEZONE) {
  return formatInZone(utcValue, 'EEE, dd MMM yyyy', timeZone);
}

/** "Mon, 03 Aug 2026 at 8:30 AM" */
export function formatDateTime(utcValue, timeZone = DEFAULT_TIMEZONE) {
  return formatInZone(utcValue, "EEE, dd MMM yyyy 'at' h:mm a", timeZone);
}

/** "8:30 AM – 9:15 AM" for a booking window. */
export function formatTimeRange(startUtc, endUtc, timeZone = DEFAULT_TIMEZONE) {
  return `${formatTime(startUtc, timeZone)} – ${formatTime(endUtc, timeZone)}`;
}

/** The API's date key ("2026-08-03") for a given instant in a given timezone. */
export function toDateKey(value, timeZone = DEFAULT_TIMEZONE) {
  return formatInTimeZone(toDate(value), timeZone, 'yyyy-MM-dd');
}

/** Midnight of `dateKey` in `timeZone`, returned as a UTC instant. */
export function dateKeyToUtc(dateKey, timeZone = DEFAULT_TIMEZONE) {
  return fromZonedTime(`${dateKey}T00:00:00`, timeZone);
}

/** A UTC instant shifted into `timeZone` - use only for calendar layout math. */
export function toTenantTime(utcValue, timeZone = DEFAULT_TIMEZONE) {
  return toZonedTime(toDate(utcValue), timeZone);
}

/** Today's date key in the given timezone. */
export function todayKey(timeZone = DEFAULT_TIMEZONE) {
  return toDateKey(new Date(), timeZone);
}

/** N consecutive date keys starting at `startKey` - powers the date strip. */
export function buildDateRange(startKey, days, timeZone = DEFAULT_TIMEZONE) {
  const start = startOfDay(toZonedTime(dateKeyToUtc(startKey, timeZone), timeZone));
  return Array.from({ length: days }, (_, i) => toDateKey(addDays(start, i), timeZone));
}

export function isSameDayInZone(a, b, timeZone = DEFAULT_TIMEZONE) {
  return isSameDay(toTenantTime(a, timeZone), toTenantTime(b, timeZone));
}
