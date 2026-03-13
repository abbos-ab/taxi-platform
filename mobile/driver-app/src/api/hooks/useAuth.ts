import { useMutation } from '@tanstack/react-query';
import { authApi } from '../auth';

export const useRegister = () =>
  useMutation({ mutationFn: (phone: string) => authApi.register(phone) });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      authApi.verifyOtp(phone, code),
  });
