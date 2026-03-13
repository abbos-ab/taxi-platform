import client from './client';
import type { AuthResponse, RegisterRequest, VerifyOTPRequest } from '../types/user';

export const register = (data: RegisterRequest) =>
  client.post<{ detail: string }>('/auth/register/', data);

export const verifyOTP = (data: VerifyOTPRequest) =>
  client.post<AuthResponse>('/auth/verify-otp/', data);

export const getProfile = () =>
  client.get('/profile/');

export const updateProfile = (data: { name: string }) =>
  client.put('/profile/', data);
