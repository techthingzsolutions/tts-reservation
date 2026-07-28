import { http, HttpResponse, delay } from 'msw';
import { BOOKING_STATUS, canTransition } from '@/constants/bookingStatus';
import {
  createBooking,
  db,
  expandBooking,
  listSlots,
} from './db';

/**
 * Mock API. Mirrors the endpoint contract the Laravel API must implement.
 * Treat this file as the API contract until Scribe/Scramble docs exist.
 *
 * Flip VITE_USE_MOCK_API=false to talk to the real backend instead.
 */

const API = import.meta.env.VITE_API_URL || '/api';
const url = (path) => `${API}${path}`;

/** Network feel, so loading states are visible during development. */
const LATENCY_MS = 250;

const unauthorized = () =>
  HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 });

function requireAuth(request) {
  const header = request.headers.get('Authorization') ?? '';
  const token = header.replace('Bearer ', '');
  const user = db.users.find((u) => `mock-token-${u.id}` === token);
  return user ?? null;
}

export const handlers = [
  // ---------------------------------------------------------------- Auth
  http.post(url('/auth/login'), async ({ request }) => {
    await delay(LATENCY_MS);
    const { email, password } = await request.json();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    );

    if (!user || user.password !== password) {
      return HttpResponse.json(
        {
          message: 'Please check the highlighted fields.',
          errors: { email: ['These credentials do not match our records.'] },
        },
        { status: 422 }
      );
    }

    const { password: _password, ...safeUser } = user;
    return HttpResponse.json({ token: `mock-token-${user.id}`, user: safeUser });
  }),

  http.get(url('/auth/me'), async ({ request }) => {
    await delay(LATENCY_MS);
    const user = requireAuth(request);
    if (!user) return unauthorized();
    const { password: _password, ...safeUser } = user;
    return HttpResponse.json({ user: safeUser });
  }),

  http.post(url('/auth/logout'), async () => {
    await delay(LATENCY_MS);
    return new HttpResponse(null, { status: 204 });
  }),

  // -------------------------------------------------------------- Tenant
  http.get(url('/tenant'), async () => {
    await delay(LATENCY_MS);
    const { bookingRules, ...tenant } = db.tenant;
    return HttpResponse.json({ data: { ...tenant, bookingRules } });
  }),

  // ------------------------------------------------------------ Services
  http.get(url('/services'), async ({ request }) => {
    await delay(LATENCY_MS);
    const includeInactive =
      new URL(request.url).searchParams.get('includeInactive') === 'true';
    const data = db.services.filter((s) => includeInactive || s.isActive);
    return HttpResponse.json({ data });
  }),

  // --------------------------------------------------------------- Staff
  http.get(url('/staff'), async ({ request }) => {
    await delay(LATENCY_MS);
    const serviceId = new URL(request.url).searchParams.get('serviceId');
    let data = db.staff.filter((s) => s.isActive);

    if (serviceId) {
      const service = db.services.find((s) => s.id === Number(serviceId));
      data = service ? data.filter((s) => service.staffIds.includes(s.id)) : [];
    }

    return HttpResponse.json({ data });
  }),

  // -------------------------------------------------------- Availability
  http.get(url('/availability'), async ({ request }) => {
    await delay(LATENCY_MS);
    const params = new URL(request.url).searchParams;
    const date = params.get('date');
    const serviceId = params.get('serviceId');
    const staffIdParam = params.get('staffId');

    if (!date || !serviceId) {
      return HttpResponse.json(
        {
          message: 'Please check the highlighted fields.',
          errors: {
            ...(date ? {} : { date: ['The date field is required.'] }),
            ...(serviceId ? {} : { serviceId: ['The service field is required.'] }),
          },
        },
        { status: 422 }
      );
    }

    const staffId = !staffIdParam || staffIdParam === 'any' ? null : Number(staffIdParam);
    const slots = listSlots({ dateKey: date, serviceId, staffId });

    return HttpResponse.json({
      data: { date, timezone: db.tenant.timezone, slots },
    });
  }),

  // ------------------------------------------------------------ Bookings
  http.post(url('/bookings'), async ({ request }) => {
    await delay(LATENCY_MS);
    const body = await request.json();

    const result = createBooking({
      serviceId: body.serviceId,
      staffId: body.staffId && body.staffId !== 'any' ? body.staffId : null,
      startsAt: body.startsAt,
      customer: {
        name: body.customer?.name,
        email: body.customer?.email,
        phone: body.customer?.phone,
      },
      notes: body.notes,
    });

    // 409 is the expected race outcome, not an exception (blueprint 5.3).
    if (!result.ok) {
      if (result.reason === 'conflict') {
        return HttpResponse.json(
          {
            message: 'That time slot is no longer available.',
            code: 'SLOT_TAKEN',
          },
          { status: 409 }
        );
      }
      return HttpResponse.json({ message: 'Service not found.' }, { status: 404 });
    }

    return HttpResponse.json(
      { data: expandBooking(result.booking) },
      { status: 201 }
    );
  }),

  /** Public lookup by secure token - guest reschedule and cancel. */
  http.get(url('/bookings/token/:token'), async ({ params }) => {
    await delay(LATENCY_MS);
    const booking = db.bookings.find((b) => b.token === params.token);
    if (!booking) {
      return HttpResponse.json({ message: 'Booking not found.' }, { status: 404 });
    }
    return HttpResponse.json({ data: expandBooking(booking) });
  }),

  http.post(url('/bookings/token/:token/cancel'), async ({ params }) => {
    await delay(LATENCY_MS);
    const booking = db.bookings.find((b) => b.token === params.token);
    if (!booking) {
      return HttpResponse.json({ message: 'Booking not found.' }, { status: 404 });
    }
    if (!canTransition(booking.status, BOOKING_STATUS.CANCELLED)) {
      return HttpResponse.json(
        { message: 'This booking can no longer be cancelled.' },
        { status: 422 }
      );
    }
    booking.status = BOOKING_STATUS.CANCELLED;
    return HttpResponse.json({ data: expandBooking(booking) });
  }),

  /** Admin list. */
  http.get(url('/bookings'), async ({ request }) => {
    await delay(LATENCY_MS);
    if (!requireAuth(request)) return unauthorized();

    const params = new URL(request.url).searchParams;
    const status = params.get('status');

    let data = db.bookings.map(expandBooking);
    if (status) data = data.filter((b) => b.status === status);
    data.sort((a, b) => a.startsAt.localeCompare(b.startsAt));

    return HttpResponse.json({ data, meta: { total: data.length } });
  }),

  http.patch(url('/bookings/:id/status'), async ({ request, params }) => {
    await delay(LATENCY_MS);
    if (!requireAuth(request)) return unauthorized();

    const { status } = await request.json();
    const booking = db.bookings.find((b) => b.id === Number(params.id));
    if (!booking) {
      return HttpResponse.json({ message: 'Booking not found.' }, { status: 404 });
    }
    if (!canTransition(booking.status, status)) {
      return HttpResponse.json(
        {
          message: `Cannot move a ${booking.status} booking to ${status}.`,
          code: 'INVALID_TRANSITION',
        },
        { status: 422 }
      );
    }

    booking.status = status;
    return HttpResponse.json({ data: expandBooking(booking) });
  }),

  // ----------------------------------------------------------- Customers
  http.get(url('/customers'), async ({ request }) => {
    await delay(LATENCY_MS);
    if (!requireAuth(request)) return unauthorized();
    return HttpResponse.json({ data: db.customers });
  }),
];
