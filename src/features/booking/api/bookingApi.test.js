import { beforeEach, describe, expect, it } from 'vitest';
import { addDays } from 'date-fns';
import { bookingApi } from './bookingApi';
import { db } from '@/mocks/db';
import { ApiError } from '@/lib/errors';
import { toDateKey } from '@/lib/datetime';

/**
 * The double-booking path is the most important behaviour in the system
 * (blueprint 5.3). These tests cover Layer 3 - the frontend's contract with a
 * 409 - and run against the same MSW handlers the browser uses.
 *
 * The server-side concurrency test (two simultaneous requests, exactly one
 * succeeds) belongs in the Laravel suite and is mandatory in CI there.
 */

const TZ = 'Asia/Manila';
const customer = {
  name: 'Test Customer',
  email: 'test.customer@example.com',
  phone: '09171234567',
};

/** A date far enough ahead to clear the minimum lead time. */
const targetDate = () => toDateKey(addDays(new Date(), 3), TZ);

async function firstOpenSlot() {
  let date = targetDate();
  // Skip closed days (Sundays, holidays) rather than assuming one is open.
  for (let attempt = 0; attempt < 7; attempt += 1) {
    const { slots } = await bookingApi.availability({ date, serviceId: 1 });
    if (slots.length > 0) return { date, slot: slots[0] };
    date = toDateKey(addDays(new Date(`${date}T12:00:00Z`), 1), TZ);
  }
  throw new Error('No open slot found in the next week of seeded data');
}

describe('availability', () => {
  it('returns slots with UTC instants and the tenant timezone', async () => {
    const { date } = await firstOpenSlot();
    const result = await bookingApi.availability({ date, serviceId: 1 });

    expect(result.timezone).toBe(TZ);
    expect(result.slots.length).toBeGreaterThan(0);
    expect(result.slots[0].startsAt).toMatch(/Z$/);
    expect(result.slots[0].staffIds.length).toBeGreaterThan(0);
  });

  it('returns no slots on a holiday', async () => {
    const date = targetDate();
    db.holidays.push({ date, name: 'Test Holiday' });

    const result = await bookingApi.availability({ date, serviceId: 1 });
    expect(result.slots).toEqual([]);
  });

  it('rejects a request with no date', async () => {
    await expect(bookingApi.availability({ serviceId: 1 })).rejects.toMatchObject({
      status: 422,
    });
  });
});

describe('booking creation', () => {
  it('creates a booking on an open slot', async () => {
    const { slot } = await firstOpenSlot();

    const booking = await bookingApi.create({
      serviceId: 1,
      staffId: 'any',
      startsAt: slot.startsAt,
      customer,
      notes: '',
    });

    expect(booking.status).toBe('pending');
    expect(booking.token).toBeTruthy();
    expect(booking.staff).not.toBeNull();
  });

  it('removes the booked slot from availability for that staff member', async () => {
    const { date, slot } = await firstOpenSlot();
    const staffId = slot.staffIds[0];

    const before = await bookingApi.availability({ date, serviceId: 1, staffId });
    await bookingApi.create({
      serviceId: 1,
      staffId,
      startsAt: slot.startsAt,
      customer,
    });
    const after = await bookingApi.availability({ date, serviceId: 1, staffId });

    expect(before.slots.some((s) => s.startsAt === slot.startsAt)).toBe(true);
    expect(after.slots.some((s) => s.startsAt === slot.startsAt)).toBe(false);
  });

  it('rejects a slot that no longer exists with a 409, not a generic error', async () => {
    const { slot } = await firstOpenSlot();
    db.forceConflict = true;

    const error = await bookingApi
      .create({ serviceId: 1, staffId: 'any', startsAt: slot.startsAt, customer })
      .catch((thrown) => thrown);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(409);
    expect(error.isSlotConflict).toBe(true);
    // Must not be mistaken for a validation or auth failure by callers.
    expect(error.isValidation).toBe(false);
    expect(error.isUnauthorized).toBe(false);
  });

  it('rejects a time that was never bookable with a 409', async () => {
    const date = targetDate();
    // 03:00 local is outside every seeded business-hours window.
    const impossible = new Date(`${date}T19:00:00.000Z`).toISOString();

    const error = await bookingApi
      .create({ serviceId: 1, staffId: 'any', startsAt: impossible, customer })
      .catch((thrown) => thrown);

    expect(error.status).toBe(409);
  });
});

// Reseed between tests so one booking does not leak into the next assertion.
beforeEach(() => {
  db.forceConflict = false;
  db.holidays = db.holidays.filter((h) => h.name !== 'Test Holiday');
  db.bookings = db.bookings.filter((b) => b.id < 7);
  db.nextBookingId = 7;
});
