import { api } from '@/lib/apiClient';

export const servicesApi = {
  /** GET /services -> Service[] (active only unless includeInactive). */
  list: ({ includeInactive = false } = {}) =>
    api.get('/services', { params: { includeInactive } }).then((r) => r.data),
};
