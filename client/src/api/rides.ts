import client from './client';
import type { Ride, CreateRideRequest } from '../types/ride';

export const createRide = (data: CreateRideRequest) =>
  client.post<Ride>('/rides/', data);

export const getRide = (id: string) =>
  client.get<Ride>(`/rides/${id}/`);

export const getRideHistory = (page = 1) =>
  client.get<{ results: Ride[]; count: number }>('/rides/', { params: { page } });

export const cancelRide = (id: string, reason: string) =>
  client.post(`/rides/${id}/cancel/`, { reason });

export const rateRide = (id: string, data: { rating: number; comment?: string }) =>
  client.post(`/rides/${id}/rate/`, data);
