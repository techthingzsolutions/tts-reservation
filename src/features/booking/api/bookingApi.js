import { api } from '@/lib/apiClient';

export const bookingApi = {
  /**
   * GET /availability?date=&serviceId=&staffId=
   * -> { date, timezone, slots: [{ startsAt, endsAt, staffIds }] }
   * Slots are derived server side, never stored (blueprint 5.2).
   */
  availability: ({ date, serviceId, staffId }) =>
    api
      .get('/availability', {
        params: { date, serviceId, staffId: staffId ?? 'any' },
      })
      .then((r) => r.data),

  /**
   * POST /bookings -> 201 { data: Booking } | 409 when the slot was taken.
   * Callers must handle the 409 path (blueprint 5.3, Layer 3).
   */
  create: (payload) => api.post('/bookings', payload).then((r) => r.data),

  /** GET /bookings/token/:token - guest lookup, no account required. */
  getByToken: (token) => api.get(`/bookings/token/${token}`).then((r) => r.data),

  /** POST /bookings/token/:token/cancel */
  cancelByToken: (token) =>
    api.post(`/bookings/token/${token}/cancel`).then((r) => r.data),
};
