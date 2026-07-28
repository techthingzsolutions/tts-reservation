import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { queryKeys } from '@/constants/queryKeys';

/**
 * Availability for one date + service (+ optional staff).
 *
 * Kept deliberately fresh: a slot can disappear at any moment, so this refetches
 * on window focus and goes stale after 15s. Target response time is under
 * 300ms (blueprint 3.4).
 */
export function useAvailability({ serviceId, staffId, date, enabled = true }) {
  return useQuery({
    queryKey: queryKeys.availability.slots({ serviceId, staffId, date }),
    queryFn: () => bookingApi.availability({ serviceId, staffId, date }),
    enabled: enabled && Boolean(serviceId) && Boolean(date),
    staleTime: 15_000,
  });
}
