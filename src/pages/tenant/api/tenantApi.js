import { api } from '@/lib/apiClient';

export const tenantApi = {
  /**
   * GET /tenant -> the tenant resolved from the X-Tenant header / subdomain.
   * Carries timezone, currency, theme tokens and booking rules.
   */
  current: () => api.get('/tenant').then((r) => r.data),
};
