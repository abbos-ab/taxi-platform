export type RideStatus = 'searching' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export interface Ride {
  id: string;
  status: RideStatus;
  pickup_address: string;
  dropoff_address: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat: number;
  dropoff_lng: number;
  estimated_price: string;
  final_price: string | null;
  estimated_distance: number;
  estimated_duration: number;
  created_at: string;
  passenger: { id: string; name: string; phone: string };
}

export interface NewRideRequest {
  ride_id: string;
  pickup: { lat: number; lng: number; address: string };
  dropoff: { lat: number; lng: number; address: string };
  price: string;
  distance: number;
}
