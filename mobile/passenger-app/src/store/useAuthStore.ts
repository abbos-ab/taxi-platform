import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { User } from '../types/user';

const storage = new MMKV();

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: storage.getString('token') || null,
  user: null,
  isAuthenticated: !!storage.getString('token'),

  setAuth: (token, user) => {
    storage.set('token', token);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    storage.delete('token');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
