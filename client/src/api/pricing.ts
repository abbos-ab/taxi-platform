import client from './client';
import type { Tariff, FareQuote } from '../types/ride';

export const getTariffs = () =>
  client.get<Tariff[]>('/pricing/tariffs/');

export const calculateFare = (distance_km: number, duration_min: number) =>
  client.post<FareQuote[]>('/pricing/calculate/', { distance_km, duration_min });
