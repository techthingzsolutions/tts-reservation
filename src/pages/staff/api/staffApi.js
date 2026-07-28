import { api } from '@/lib/apiClient';

export const staffApi = {
  /** GET /staff?serviceId= -> Staff[] assigned to that service. */
  list: ({ serviceId } = {}) =>
    api.get('/staff', { params: serviceId ? { serviceId } : {} }).then((r) => r.data),
};
