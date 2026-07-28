import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getToken, setToken, setUnauthorizedHandler } from '@/lib/apiClient';
import { authApi } from '@/features/auth/api/authApi';
import { hasCapability, isAdminRole } from '@/constants/roles';
import { queryClient } from '@/lib/queryClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `true` until we know whether the stored token is still valid. Routes must
  // wait for this or a refresh will bounce a signed-in user to /login.
  const [isRestoring, setIsRestoring] = useState(Boolean(getToken()));

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, []);

  // A 401 from any request drops the session immediately.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      queryClient.clear();
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  // Restore the session on load if a token is in storage.
  useEffect(() => {
    if (!getToken()) {
      setIsRestoring(false);
      return;
    }
    let cancelled = false;
    authApi
      .me()
      .then((data) => {
        if (!cancelled) setUser(data.user ?? data);
      })
      .catch(() => {
        if (!cancelled) clearSession();
      })
      .finally(() => {
        if (!cancelled) setIsRestoring(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Token may already be revoked server side - clear locally regardless.
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      isRestoring,
      isAuthenticated: Boolean(user),
      isAdmin: isAdminRole(user?.role),
      can: (capability) => hasCapability(user?.role, capability),
      login,
      logout,
    }),
    [user, isRestoring, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
