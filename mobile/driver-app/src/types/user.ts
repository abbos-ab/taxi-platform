export interface User {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: 'passenger' | 'driver' | 'admin';
  avatar: string | null;
}
