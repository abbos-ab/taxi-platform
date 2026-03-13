import { create } from 'zustand';
import { Ride, RideStatus, NewRideRequest } from '../types/ride';

interface RideState {
  currentRide: Ride | null;
  rideStatus: RideStatus | null;
  pendingRide: NewRideRequest | null;
  setCurrentRide: (ride: Ride | null) => void;
  setRideStatus: (status: RideStatus) => void;
  setPendingRide: (ride: NewRideRequest | null) => void;
  reset: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  currentRide: null,
  rideStatus: null,
  pendingRide: null,
  setCurrentRide: (ride) => set({ currentRide: ride }),
  setRideStatus: (status) => set({ rideStatus: status }),
  setPendingRide: (ride) => set({ pendingRide: ride }),
  reset: () => set({ currentRide: null, rideStatus: null, pendingRide: null }),
}));
