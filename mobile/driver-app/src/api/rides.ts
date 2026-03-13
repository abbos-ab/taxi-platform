import client from './client';

export const ridesApi = {
  accept: (id: string) => client.post(`/rides/${id}/accept/`),
  arrive: (id: string) => client.post(`/rides/${id}/arrive/`),
  start: (id: string) => client.post(`/rides/${id}/start/`),
  complete: (id: string) => client.post(`/rides/${id}/complete/`),
  getHistory: (page = 1) => client.get('/rides/', { params: { page } }),
  getById: (id: string) => client.get(`/rides/${id}/`),
};
