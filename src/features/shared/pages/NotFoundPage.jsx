import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">404</p>
      <h1 className="text-2xl font-semibold text-content">Page not found</h1>
      <p className="max-w-sm text-sm text-content-muted">
        That link may have expired, or the page has moved.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-2 rounded-token bg-primary px-5 py-2.5 text-sm font-medium text-primary-contrast hover:bg-primary-hover"
      >
        Go home
      </Link>
    </div>
  );
}
