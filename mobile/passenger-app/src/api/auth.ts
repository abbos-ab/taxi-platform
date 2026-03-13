import client from './client';

export const authApi = {
  register: (phone: string) => client.post('/auth/register/', { phone }),
  verifyOtp: (phone: string, code: string) =>
    client.post('/auth/verify-otp/', { phone, code }),
};
