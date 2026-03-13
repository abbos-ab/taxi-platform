import client from './client';

export const pricingApi = {
  getList: () => client.get('/pricing/'),
  update: (id: string, data: Record<string, unknown>) =>
    client.put(`/pricing/${id}/`, data),
  create: (data: Record<string, unknown>) =>
    client.post('/pricing/', data),
};
