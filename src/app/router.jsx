import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ADMIN_ROLES } from '@/constants/roles';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { HomePage } from '@/features/home/pages/HomePage';
import { BookingPage } from '@/features/booking/pages/BookingPage';
import { BookingConfirmedPage } from '@/features/booking/pages/BookingConfirmedPage';
import { ManageBookingPage } from '@/features/booking/pages/ManageBookingPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { CalendarPage } from '@/features/bookings/pages/CalendarPage';
import { BookingsPage } from '@/features/bookings/pages/BookingsPage';
import { ServicesPage } from '@/features/services/pages/ServicesPage';
import { StaffPage } from '@/features/staff/pages/StaffPage';
import { CustomersPage } from '@/features/customers/pages/CustomersPage';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { NotFoundPage } from '@/features/shared/pages/NotFoundPage';

/**
 * Two trees:
 *   public  - no auth, customer facing, must work for a stranger on a phone
 *   admin   - behind ProtectedRoute, staff and owners only
 *
 * Routes are eagerly imported for now. Split the admin tree with React.lazy
 * once it grows - the public booking page must stay under 2s to load
 * (blueprint 3.4).
 */
export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.BOOK, element: <BookingPage /> },
      { path: ROUTES.BOOKING_CONFIRMED, element: <BookingConfirmedPage /> },
      { path: ROUTES.MANAGE_BOOKING, element: <ManageBookingPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [{ path: ROUTES.LOGIN, element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute roles={ADMIN_ROLES} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: ROUTES.ADMIN_DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.ADMIN_CALENDAR, element: <CalendarPage /> },
          { path: ROUTES.ADMIN_BOOKINGS, element: <BookingsPage /> },
          { path: ROUTES.ADMIN_SERVICES, element: <ServicesPage /> },
          { path: ROUTES.ADMIN_STAFF, element: <StaffPage /> },
          { path: ROUTES.ADMIN_CUSTOMERS, element: <CustomersPage /> },
          { path: ROUTES.ADMIN_REPORTS, element: <ReportsPage /> },
          { path: ROUTES.ADMIN_SETTINGS, element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '/admin/*', element: <Navigate to={ROUTES.ADMIN_DASHBOARD} replace /> },
  { path: '*', element: <NotFoundPage /> },
]);
