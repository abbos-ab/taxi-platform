export type RideStatus =
  | 'searching'
  | 'accepted'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  rating: number;
  car: {
    model: string;
    color: string;
    plate: string;
  };
}

export interface Ride {
  id: string;
  pickup: Location;
  dropoff: Location;
  status: RideStatus;
  tariff: string;
  price: number;
  distance_km: number;
  duration_min: number;
  driver?: Driver;
  created_at: string;
  completed_at?: string;
}

export interface CreateRideRequest {
  pickup_lat: number;
  pickup_lng: number;
  pickup_address: string;
  dropoff_lat: number;
  dropoff_lng: number;
  dropoff_address: string;
  tariff_id: string;
}

export interface Tariff {
  id: string;
  name: string;
  base_fare: number;
  per_km: number;
  per_min: number;
  min_fare: number;
  is_active: boolean;
}

export interface FareQuote {
  tariff_id: string;
  tariff_name: string;
  price: number;
  distance_km: number;
  duration_min: number;
}
