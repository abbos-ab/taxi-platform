import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ridesApi } from '../rides';
import { CreateRideRequest } from '../../types/ride';

export const useCreateRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRideRequest) => ridesApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rides'] }),
  });
};

export const useRideHistory = (page = 1) =>
  useQuery({
    queryKey: ['rides', 'history', page],
    queryFn: () => ridesApi.getHistory(page).then((r) => r.data),
  });

export const useRateRide = () =>
  useMutation({
    mutationFn: ({ id, score, comment }: { id: string; score: number; comment?: string }) =>
      ridesApi.rate(id, score, comment),
  });
