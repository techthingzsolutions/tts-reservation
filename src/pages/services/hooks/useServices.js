import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api/servicesApi';
import { queryKeys } from '@/constants/queryKeys';

/** Services change rarely - cache them longer than availability. */
export function useServices(options = {}) {
  return useQuery({
    queryKey: queryKeys.services.list(options),
    queryFn: () => servicesApi.list(options),
    staleTime: 5 * 60_000,
  });
}
