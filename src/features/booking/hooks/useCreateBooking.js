import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { queryKeys } from '@/constants/queryKeys';

/**
 * Create a booking, handling the 409 race (blueprint 5.3, Layer 3).
 *
 * On conflict we invalidate availability so the slot list refreshes to reality,
 * then hand the error to the caller to show a specific message. A 409 is a
 * normal outcome of two people booking at once - never a crash, never a
 * generic "something went wrong".
 */
export function useCreateBooking({ onConflict } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => bookingApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
    onError: (error) => {
      if (error?.isSlotConflict) {
        queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
        onConflict?.(error);
      }
    },
  });
}
