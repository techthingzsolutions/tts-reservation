/**
 * Centralised TanStack Query keys.
 *
 * Availability is the one that matters: after any booking, schedule change, or
 * settings change, invalidate `queryKeys.availability.all` so nobody is shown a
 * slot that no longer exists (blueprint 5.2 - invalidate on any change).
 */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'],
  },
  services: {
    all: ['services'],
    list: (filters = {}) => ['services', 'list', filters],
    detail: (id) => ['services', 'detail', id],
  },
  staff: {
    all: ['staff'],
    list: (filters = {}) => ['staff', 'list', filters],
    byService: (serviceId) => ['staff', 'by-service', serviceId],
  },
  availability: {
    all: ['availability'],
    slots: ({ serviceId, staffId, date }) => [
      'availability',
      'slots',
      { serviceId, staffId: staffId ?? 'any', date },
    ],
  },
  bookings: {
    all: ['bookings'],
    list: (filters = {}) => ['bookings', 'list', filters],
    detail: (id) => ['bookings', 'detail', id],
    byToken: (token) => ['bookings', 'token', token],
  },
  customers: {
    all: ['customers'],
    list: (filters = {}) => ['customers', 'list', filters],
  },
  settings: {
    tenant: ['settings', 'tenant'],
    theme: ['settings', 'theme'],
  },
};
