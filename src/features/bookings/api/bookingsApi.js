import { api } from '@/lib/apiClient';

/** Admin-side booking endpoints. Requires an authenticated session. */
export const bookingsApi = {
  /** GET /bookings?status= -> Booking[] with service, staff and customer. */
  list: (filters = {}) => api.get('/bookings', { params: filters }).then((r) => r.data),

  /** PATCH /bookings/:id/status - server rejects invalid transitions with 422. */
  updateStatus: (id, status) =>
    api.patch(`/bookings/${id}/status`, { status }).then((r) => r.data),
};
