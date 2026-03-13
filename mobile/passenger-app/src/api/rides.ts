import client from './client';
import { CreateRideRequest } from '../types/ride';

export const ridesApi = {
  create: (data: CreateRideRequest) => client.post('/rides/', data),
  getHistory: (page = 1) => client.get('/rides/', { params: { page } }),
  getById: (id: string) => client.get(`/rides/${id}/`),
  cancel: (id: string, reason = '') =>
    client.post(`/rides/${id}/cancel/`, { reason }),
  rate: (id: string, score: number, comment = '') =>
    client.post(`/rides/${id}/rate/`, { score, comment }),
};
