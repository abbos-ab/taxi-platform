import client from './client';

export const authApi = {
  login: (phone: string, password: string) =>
    client.post('/auth/token/', { phone, password }),
};
