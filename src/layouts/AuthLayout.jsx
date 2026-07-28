import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-xl font-semibold text-content">
            Tech Thingz Booking
          </h1>
          <p className="mt-1 text-sm text-content-muted">Business dashboard</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
