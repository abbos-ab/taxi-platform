import client from './client';

export const driversApi = {
  getList: (params?: Record<string, string>) =>
    client.get('/drivers/', { params }),
  getById: (id: string) => client.get(`/drivers/${id}/`),
  verify: (id: string) => client.post(`/drivers/${id}/verify/`),
};
