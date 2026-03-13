import client from './client';

export const ridesApi = {
  getList: (params?: Record<string, string>) =>
    client.get('/dashboard/rides/', { params }),
  getById: (id: string) => client.get(`/rides/${id}/`),
};
