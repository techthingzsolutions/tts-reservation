import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';
import { queryKeys } from '@/constants/queryKeys';

export function useBookings(filters = {}) {
  return useQuery({
    queryKey: queryKeys.bookings.list(filters),
    queryFn: () => bookingsApi.list(filters),
  });
}

/**
 * Any status change frees or occupies a slot, so availability must be
 * invalidated alongside the booking list (blueprint 5.2 cache invalidation).
 */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => bookingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
    },
  });
}
