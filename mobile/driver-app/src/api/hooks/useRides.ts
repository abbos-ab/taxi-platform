import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ridesApi } from '../rides';

export const useAcceptRide = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ridesApi.accept(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rides'] }),
  });
};

export const useCompleteRide = () =>
  useMutation({ mutationFn: (id: string) => ridesApi.complete(id) });

export const useRideHistory = (page = 1) =>
  useQuery({
    queryKey: ['rides', 'history', page],
    queryFn: () => ridesApi.getHistory(page).then((r) => r.data),
  });
