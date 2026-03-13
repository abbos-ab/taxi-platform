export type RideStatus = 'searching' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export interface Ride {
  id: string;
  status: RideStatus;
  pickup_address: string;
  dropoff_address: string;
  estimated_price: string;
  final_price: string | null;
  estimated_distance: number;
  estimated_duration: number;
  created_at: string;
  completed_at: string | null;
  driver?: DriverInfo;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  car: { make: string; model: string; color: string; plate_number: string };
}

export interface CreateRideRequest {
  pickup_lat: number;
  pickup_lng: number;
  pickup_address: string;
  dropoff_lat: number;
  dropoff_lng: number;
  dropoff_address: string;
}
