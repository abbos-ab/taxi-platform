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
}
