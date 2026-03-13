import { useQuery, useMutation } from '@tanstack/react-query';
import { getTariffs, calculateFare } from '../pricing';

export const useTariffs = () =>
  useQuery({
    queryKey: ['tariffs'],
    queryFn: () => getTariffs().then((r) => r.data),
  });

export const useCalculateFare = () =>
  useMutation({
    mutationFn: ({ distance_km, duration_min }: { distance_km: number; duration_min: number }) =>
      calculateFare(distance_km, duration_min).then((r) => r.data),
  });
