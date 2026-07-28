import { toTenantTime } from '@/lib/datetime';

/**
 * Presentation helpers for the slot list. The availability RULES live on the
 * server; this only decides how the returned slots are displayed.
 */

export const PERIODS = [
  { id: 'morning', label: 'Morning', startHour: 0, endHour: 12 },
  { id: 'afternoon', label: 'Afternoon', startHour: 12, endHour: 17 },
  { id: 'evening', label: 'Evening', startHour: 17, endHour: 24 },
];

/**
 * Group slots into morning / afternoon / evening in the tenant timezone.
 * Empty periods are dropped so the UI never renders a bare heading.
 */
export function groupSlotsByPeriod(slots = [], timeZone) {
  const groups = PERIODS.map((period) => ({ ...period, slots: [] }));

  for (const slot of slots) {
    const hour = toTenantTime(slot.startsAt, timeZone).getHours();
    const group = groups.find((g) => hour >= g.startHour && hour < g.endHour);
    group?.slots.push(slot);
  }

  return groups.filter((group) => group.slots.length > 0);
}

/**
 * Drop slots that started while the customer was filling in the form.
 * The server filters by lead time too; this keeps a stale page honest.
 */
export function removeStaleSlots(slots = [], now = new Date()) {
  return slots.filter((slot) => new Date(slot.startsAt) > now);
}

/** Whether a chosen slot is still present in a freshly fetched list. */
export function slotStillAvailable(slots = [], startsAt) {
  return slots.some((slot) => slot.startsAt === startsAt);
}
