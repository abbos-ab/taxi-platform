import { create } from 'zustand';

interface LocationState {
  currentLocation: { lat: number; lng: number } | null;
  isOnline: boolean;
  watchId: number | null;
  setLocation: (loc: { lat: number; lng: number }) => void;
  setOnline: (online: boolean) => void;
  setWatchId: (id: number | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  isOnline: false,
  watchId: null,
  setLocation: (loc) => set({ currentLocation: loc }),
  setOnline: (online) => set({ isOnline: online }),
  setWatchId: (id) => set({ watchId: id }),
}));
