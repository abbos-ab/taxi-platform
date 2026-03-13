import { useQuery } from '@tanstack/react-query';
import { driversApi } from '../drivers';

export const useDriversList = (params?: Record<string, string>) =>
  useQuery({
    queryKey: ['drivers', params],
    queryFn: () => driversApi.getList(params).then((r) => r.data),
  });

export const useDriverDetail = (id: string) =>
  useQuery({
    queryKey: ['drivers', id],
    queryFn: () => driversApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });
