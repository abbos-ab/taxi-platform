import { useQuery } from '@tanstack/react-query';
import client from '../client';

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: () => client.get('/profile/').then((r) => r.data),
  });
