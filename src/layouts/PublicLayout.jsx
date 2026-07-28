import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/app/providers/ThemeProvider';

export function PublicLayout() {
  const { theme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            {theme.logoUrl ? (
              <img src={theme.logoUrl} alt="" className="h-8 w-auto" />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-token bg-primary text-sm font-bold text-primary-contrast"
              >
                {theme.businessName?.[0] ?? 'B'}
              </span>
            )}
            <span className="font-heading text-lg font-semibold text-content">
              {theme.businessName}
            </span>
          </Link>

          <Link
            to={ROUTES.BOOK}
            className="rounded-token bg-primary px-4 py-2 text-sm font-medium text-primary-contrast hover:bg-primary-hover"
          >
            Book now
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-content-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {theme.businessName}
          </span>
          <span>
            Powered by{' '}
            <span className="font-medium text-content">Tech Thingz Solutions</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
