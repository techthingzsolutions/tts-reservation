import { api } from '@/lib/apiClient';

/**
 * Laravel Sanctum token auth (blueprint 4.1). Token-based rather than cookie
 * based so the same endpoints serve the future React Native app.
 */
export const authApi = {
  /** POST /auth/login -> { token, user } */
  login: (credentials) => api.post('/auth/login', credentials),

  /** POST /auth/logout - revokes the current token. */
  logout: () => api.post('/auth/logout'),

  /** GET /auth/me -> user. Used to restore a session on page load. */
  me: () => api.get('/auth/me'),
};
