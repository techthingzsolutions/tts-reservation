import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { queryKeys } from '@/constants/queryKeys';

/**
 * All bookings for the current tenant. Availability and the schedule both read
 * from this, so keep the cache short - a stale list can show a slot that was
 * just taken (blueprint 5.2).
 */
export function useBookings(filters = {}) {
  return useQuery({
    queryKey: queryKeys.bookings.list(filters),
    queryFn: () => api.get('/bookings', { params: filters }).then((r) => r.data),
    staleTime: 30_000,
  });
}
