import { create } from 'zustand';

interface LocationState {
  currentLocation: { lat: number; lng: number } | null;
  isLocating: boolean;
  error: string | null;
  setLocation: (loc: { lat: number; lng: number }) => void;
  setLocating: (v: boolean) => void;
  setError: (err: string | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  isLocating: false,
  error: null,
  setLocation: (loc) => set({ currentLocation: loc, isLocating: false, error: null }),
  setLocating: (v) => set({ isLocating: v }),
  setError: (err) => set({ error: err, isLocating: false }),
}));
