import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '../api/tenantApi';
import { queryKeys } from '@/constants/queryKeys';
import { DEFAULT_TIMEZONE } from '@/lib/datetime';

/**
 * The tenant record drives timezone, currency, theme and booking rules.
 * Everything that formats a date or a price depends on this.
 */
export function useTenant() {
  const query = useQuery({
    queryKey: queryKeys.settings.tenant,
    queryFn: tenantApi.current,
    staleTime: 10 * 60_000,
  });

  return {
    ...query,
    tenant: query.data ?? null,
    timeZone: query.data?.timezone ?? DEFAULT_TIMEZONE,
    bookingRules: query.data?.bookingRules ?? {
      slotIncrementMinutes: 15,
      minimumLeadTimeMinutes: 0,
      maximumAdvanceDays: 60,
      cancellationWindowHours: 24,
    },
  };
}
