import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from '@/lib/queryClient';
import { useTenant } from '@/features/tenant/hooks/useTenant';
import { ErrorBoundary } from './app/ErrorBoundary';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { ToastProvider } from './app/providers/ToastProvider';
import { AuthProvider } from './app/providers/AuthProvider';
import { router } from './app/router';

/**
 * Provider order matters:
 *   ErrorBoundary  - catches everything below it
 *   QueryClient    - TenantThemeGate needs it to fetch the tenant
 *   Theme          - tokens must be applied before anything renders
 *   Toast          - available to every page, including the router
 *   Auth           - uses the query client to clear caches on logout
 */
export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TenantThemeGate>
          <ToastProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </ToastProvider>
        </TenantThemeGate>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

/**
 * Feeds the tenant's saved theme into ThemeProvider once it loads. Children
 * render immediately with the default tokens rather than blocking on the
 * request - a brief default-branded flash beats a blank screen.
 */
function TenantThemeGate({ children }) {
  const { tenant } = useTenant();
  return <ThemeProvider theme={tenant?.theme}>{children}</ThemeProvider>;
}
