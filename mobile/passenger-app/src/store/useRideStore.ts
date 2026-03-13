import { create } from 'zustand';
import { Ride, RideStatus } from '../types/ride';

interface RideState {
  currentRide: Ride | null;
  rideStatus: RideStatus | null;
  driverLocation: { lat: number; lng: number } | null;
  setCurrentRide: (ride: Ride | null) => void;
  setRideStatus: (status: RideStatus) => void;
  setDriverLocation: (loc: { lat: number; lng: number }) => void;
  reset: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  currentRide: null,
  rideStatus: null,
  driverLocation: null,
  setCurrentRide: (ride) => set({ currentRide: ride }),
  setRideStatus: (status) => set({ rideStatus: status }),
  setDriverLocation: (loc) => set({ driverLocation: loc }),
  reset: () => set({ currentRide: null, rideStatus: null, driverLocation: null }),
}));
