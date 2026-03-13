import { create } from 'zustand';
import type { Ride, RideStatus, Location, FareQuote } from '../types/ride';

interface RideState {
  pickup: Location | null;
  dropoff: Location | null;
  currentRide: Ride | null;
  rideStatus: RideStatus | null;
  driverLocation: { lat: number; lng: number } | null;
  fareQuotes: FareQuote[];
  selectedTariffId: string | null;

  setPickup: (loc: Location | null) => void;
  setDropoff: (loc: Location | null) => void;
  setCurrentRide: (ride: Ride | null) => void;
  setRideStatus: (status: RideStatus) => void;
  setDriverLocation: (loc: { lat: number; lng: number } | null) => void;
  setFareQuotes: (quotes: FareQuote[]) => void;
  setSelectedTariffId: (id: string | null) => void;
  reset: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  pickup: null,
  dropoff: null,
  currentRide: null,
  rideStatus: null,
  driverLocation: null,
  fareQuotes: [],
  selectedTariffId: null,

  setPickup: (loc) => set({ pickup: loc }),
  setDropoff: (loc) => set({ dropoff: loc }),
  setCurrentRide: (ride) => set({ currentRide: ride }),
  setRideStatus: (status) => set({ rideStatus: status }),
  setDriverLocation: (loc) => set({ driverLocation: loc }),
  setFareQuotes: (quotes) => set({ fareQuotes: quotes }),
  setSelectedTariffId: (id) => set({ selectedTariffId: id }),
  reset: () =>
    set({
      pickup: null,
      dropoff: null,
      currentRide: null,
      rideStatus: null,
      driverLocation: null,
      fareQuotes: [],
      selectedTariffId: null,
    }),
}));
