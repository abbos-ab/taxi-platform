import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createRide, getRideHistory, cancelRide, rateRide } from '../rides';
import type { CreateRideRequest } from '../../types/ride';

export const useCreateRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRideRequest) => createRide(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rides'] }),
  });
};

export const useRideHistory = (page = 1) =>
  useQuery({
    queryKey: ['rides', 'history', page],
    queryFn: () => getRideHistory(page).then((r) => r.data),
  });

export const useCancelRide = () =>
  useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelRide(id, reason),
  });

export const useRateRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rating, comment }: { id: string; rating: number; comment?: string }) =>
      rateRide(id, { rating, comment }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rides'] }),
  });
};
