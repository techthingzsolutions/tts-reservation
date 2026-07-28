import { useQuery } from '@tanstack/react-query';
import { staffApi } from '../api/staffApi';
import { queryKeys } from '@/constants/queryKeys';

export function useStaffForService(serviceId) {
  return useQuery({
    queryKey: queryKeys.staff.byService(serviceId),
    queryFn: () => staffApi.list({ serviceId }),
    enabled: Boolean(serviceId),
    staleTime: 5 * 60_000,
  });
}
