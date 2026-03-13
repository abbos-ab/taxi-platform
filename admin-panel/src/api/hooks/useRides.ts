import { useQuery } from '@tanstack/react-query';
import { ridesApi } from '../rides';

export const useRidesList = (params?: Record<string, string>) =>
  useQuery({
    queryKey: ['rides', params],
    queryFn: () => ridesApi.getList(params).then((r) => r.data),
  });

export const useRideDetail = (id: string) =>
  useQuery({
    queryKey: ['rides', id],
    queryFn: () => ridesApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });
