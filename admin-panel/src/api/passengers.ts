import client from './client';

export const passengersApi = {
  getList: (params?: Record<string, string>) =>
    client.get('/dashboard/passengers/', { params }),
};
