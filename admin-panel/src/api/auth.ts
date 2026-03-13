import client from './client';

export const authApi = {
  login: (username: string, password: string) =>
    client.post('/auth/token/', { username, password }),
};
