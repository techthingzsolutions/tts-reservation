/** Every path in one place. Never hardcode a URL string in a component. */
export const ROUTES = {
  // Public / customer facing
  HOME: '/',
  BOOK: '/book',
  BOOKING_CONFIRMED: '/book/confirmed/:token',
  MANAGE_BOOKING: '/booking/:token',

  // Auth
  LOGIN: '/login',

  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_CALENDAR: '/admin/calendar',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_STAFF: '/admin/staff',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
};

export const bookingConfirmedPath = (token) => `/book/confirmed/${token}`;
export const manageBookingPath = (token) => `/booking/${token}`;
