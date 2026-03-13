import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../dashboard';

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data),
    refetchInterval: 30000,
  });
