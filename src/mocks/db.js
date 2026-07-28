import { addDays, addMinutes, parseISO } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { BOOKING_STATUS, ACTIVE_BOOKING_STATUSES } from '@/constants/bookingStatus';
import { toDateKey, todayKey } from '@/lib/datetime';
import {
  BUSINESS_HOURS,
  CUSTOMERS,
  HOLIDAYS,
  SERVICES,
  STAFF,
  TENANT,
  USERS,
} from './fixtures';
import { generateSlots } from './availability';

/**
 * In-memory mock database. Resets on page reload, which is deliberate: the
 * team should not build anything that depends on mock persistence.
 */

const tz = TENANT.timezone;

function at(dateKey, hhmm) {
  return fromZonedTime(`${dateKey}T${hhmm}:00`, tz).toISOString();
}

function seedBookings() {
  const today = todayKey(tz);
  const tomorrow = toDateKey(addDays(new Date(), 1), tz);
  const dayAfter = toDateKey(addDays(new Date(), 2), tz);

  const rows = [
    { staffId: 1, serviceId: 1, customerId: 1, date: today, time: '10:00', status: BOOKING_STATUS.CONFIRMED },
    { staffId: 1, serviceId: 2, customerId: 3, date: today, time: '13:00', status: BOOKING_STATUS.CONFIRMED },
    { staffId: 2, serviceId: 3, customerId: 2, date: today, time: '11:30', status: BOOKING_STATUS.PENDING },
    { staffId: 4, serviceId: 4, customerId: 1, date: tomorrow, time: '09:30', status: BOOKING_STATUS.CONFIRMED },
    { staffId: 3, serviceId: 5, customerId: 3, date: tomorrow, time: '14:00', status: BOOKING_STATUS.CONFIRMED },
    { staffId: 2, serviceId: 1, customerId: 2, date: dayAfter, time: '10:15', status: BOOKING_STATUS.PENDING },
  ];

  return rows.map((row, index) => {
    const service = SERVICES.find((s) => s.id === row.serviceId);
    const startsAt = at(row.date, row.time);
    return {
      id: index + 1,
      reference: `BK-${String(index + 1).padStart(5, '0')}`,
      token: `tok_${Math.random().toString(36).slice(2, 12)}`,
      tenantId: TENANT.id,
      customerId: row.customerId,
      staffId: row.staffId,
      serviceId: row.serviceId,
      startsAt,
      endsAt: addMinutes(parseISO(startsAt), service.durationMinutes).toISOString(),
      status: row.status,
      price: service.price,
      notes: '',
      createdAt: new Date().toISOString(),
    };
  });
}

function seedTimeOff() {
  // Mika is off tomorrow afternoon so the demo shows a real availability gap.
  const tomorrow = toDateKey(addDays(new Date(), 1), tz);
  return [{ staffId: 1, date: tomorrow, startTime: '13:00', endTime: '18:00', reason: 'Medical' }];
}

export const db = {
  tenant: TENANT,
  users: [...USERS],
  services: SERVICES.map((s) => ({ ...s })),
  staff: STAFF.map((s) => ({ ...s })),
  customers: CUSTOMERS.map((c) => ({ ...c })),
  businessHours: BUSINESS_HOURS,
  holidays: [...HOLIDAYS],
  timeOff: seedTimeOff(),
  bookings: seedBookings(),
  nextBookingId: 7,
  nextCustomerId: 4,

  /**
   * Dev escape hatch. Set `window.__ttsMock.forceConflict = true` in the
   * console to make the next booking attempt return 409, so the conflict UI
   * (blueprint 5.3 Layer 3) can be exercised on demand.
   */
  forceConflict: false,
};

/** Staff enriched with their time off for the availability generator. */
function staffWithTimeOff() {
  return db.staff.map((s) => ({
    ...s,
    timeOff: db.timeOff.filter((t) => t.staffId === s.id),
  }));
}

export function listSlots({ dateKey, serviceId, staffId = null }) {
  const service = db.services.find((s) => s.id === Number(serviceId));
  if (!service || !service.isActive) return [];

  return generateSlots({
    dateKey,
    service,
    staffId: staffId === null ? null : Number(staffId),
    staffList: staffWithTimeOff(),
    bookings: db.bookings,
    businessHours: db.businessHours,
    holidays: db.holidays,
    timeZone: db.tenant.timezone,
    rules: db.tenant.bookingRules,
  });
}

/**
 * Re-checks availability inside the "transaction" before inserting - the mock
 * equivalent of the row lock + re-check in blueprint 5.3, Layer 2.
 *
 * @returns {{ ok: true, booking: object } | { ok: false, reason: 'conflict' }}
 */
export function createBooking({ serviceId, staffId, startsAt, customer, notes }) {
  const service = db.services.find((s) => s.id === Number(serviceId));
  if (!service) return { ok: false, reason: 'not_found' };

  const dateKey = toDateKey(startsAt, db.tenant.timezone);
  const slots = listSlots({ dateKey, serviceId, staffId: staffId ?? null });
  const slot = slots.find((s) => s.startsAt === startsAt);

  if (db.forceConflict || !slot) {
    db.forceConflict = false; // one-shot
    return { ok: false, reason: 'conflict' };
  }

  // "any available" resolves to the lowest-id free staff member.
  const assignedStaffId = staffId ? Number(staffId) : slot.staffIds[0];

  const existing = db.customers.find(
    (c) => c.email.toLowerCase() === customer.email.toLowerCase()
  );
  const customerRecord =
    existing ??
    (() => {
      const record = {
        id: db.nextCustomerId++,
        ...customer,
        notes: '',
        visitCount: 0,
        noShowCount: 0,
      };
      db.customers.push(record);
      return record;
    })();

  const id = db.nextBookingId++;
  const booking = {
    id,
    reference: `BK-${String(id).padStart(5, '0')}`,
    token: `tok_${Math.random().toString(36).slice(2, 12)}`,
    tenantId: db.tenant.id,
    customerId: customerRecord.id,
    staffId: assignedStaffId,
    serviceId: service.id,
    startsAt,
    endsAt: slot.endsAt,
    status: BOOKING_STATUS.PENDING,
    price: service.price,
    notes: notes ?? '',
    createdAt: new Date().toISOString(),
  };

  db.bookings.push(booking);
  return { ok: true, booking };
}

/** Expand a booking with its related records for API responses. */
export function expandBooking(booking) {
  return {
    ...booking,
    service: db.services.find((s) => s.id === booking.serviceId) ?? null,
    staff: db.staff.find((s) => s.id === booking.staffId) ?? null,
    customer: db.customers.find((c) => c.id === booking.customerId) ?? null,
  };
}

export function activeBookings() {
  return db.bookings.filter((b) => ACTIVE_BOOKING_STATUSES.includes(b.status));
}

if (typeof window !== 'undefined') {
  window.__ttsMock = db;
}
