import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './providers/AuthProvider';
import { LoadingBlock } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

/**
 * Route guard. `roles` restricts to specific roles; omit it to require only
 * that the user is signed in.
 *
 * This is a UX gate, not a security boundary - the API enforces authorisation
 * on every endpoint regardless of what the frontend renders.
 */
export function ProtectedRoute({ roles }) {
  const { isAuthenticated, isRestoring, user } = useAuth();
  const location = useLocation();

  if (isRestoring) {
    return <LoadingBlock label="Checking your session" className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
