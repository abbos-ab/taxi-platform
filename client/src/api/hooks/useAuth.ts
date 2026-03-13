import { useMutation } from '@tanstack/react-query';
import { register, verifyOTP } from '../auth';
import { useAuthStore } from '../../store/useAuthStore';

export const useRegister = () =>
  useMutation({
    mutationFn: (phone: string) => register({ phone }),
  });

export const useVerifyOTP = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      verifyOTP({ phone, code }),
    onSuccess: (res) => {
      setAuth(res.data.access, res.data.user);
    },
  });
};
