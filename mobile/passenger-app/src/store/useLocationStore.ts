import { create } from 'zustand';

interface LocationState {
  currentLocation: { lat: number; lng: number } | null;
  setLocation: (loc: { lat: number; lng: number }) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  setLocation: (loc) => set({ currentLocation: loc }),
}));
