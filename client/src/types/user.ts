export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'passenger' | 'driver' | 'admin';
  avatar?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  phone: string;
}

export interface VerifyOTPRequest {
  phone: string;
  code: string;
}
