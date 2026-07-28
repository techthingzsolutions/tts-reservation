import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/app/providers/AuthProvider';

const NAV = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', end: true },
  { to: ROUTES.ADMIN_CALENDAR, label: 'Calendar' },
  { to: ROUTES.ADMIN_BOOKINGS, label: 'Bookings' },
  { to: ROUTES.ADMIN_SERVICES, label: 'Services', capability: 'services.manage' },
  { to: ROUTES.ADMIN_STAFF, label: 'Staff', capability: 'staff.manage' },
  { to: ROUTES.ADMIN_CUSTOMERS, label: 'Customers', capability: 'customers.manage' },
  { to: ROUTES.ADMIN_REPORTS, label: 'Reports', capability: 'reports.view' },
  { to: ROUTES.ADMIN_SETTINGS, label: 'Settings', capability: 'settings.manage' },
];

export function AdminLayout() {
  const { user, logout, can } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  const items = NAV.filter((item) => !item.capability || can(item.capability));

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside
        className={cn(
          'border-b border-border bg-surface lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r',
          'flex flex-col'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="font-heading font-semibold text-content">
            Tech Thingz Booking
          </span>
          <button
            type="button"
            onClick={() => setNavOpen((open) => !open)}
            aria-expanded={navOpen}
            aria-label="Toggle navigation"
            className="text-content-muted lg:hidden"
          >
            ☰
          </button>
        </div>

        <nav className={cn('px-2 pb-3 lg:block', navOpen ? 'block' : 'hidden')}>
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-token px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-soft text-primary'
                        : 'text-content-muted hover:bg-surface-muted hover:text-content'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto hidden border-t border-border p-4 lg:block">
          <p className="truncate text-sm font-medium text-content">{user?.name}</p>
          <p className="mb-3 truncate text-xs capitalize text-content-muted">
            {user?.role?.replace('_', ' ')}
          </p>
          <Button variant="secondary" size="sm" fullWidth onClick={logout}>
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 bg-surface-muted">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
