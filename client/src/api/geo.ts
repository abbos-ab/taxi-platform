import client from './client';

interface GeocodingResult {
  lat: number;
  lng: number;
  address: string;
}

interface RouteResult {
  distance_km: number;
  duration_min: number;
  geometry: [number, number][];
}

export const geocode = (query: string) =>
  client.get<GeocodingResult[]>('/geo/geocode/', { params: { q: query } });

export const reverseGeocode = (lat: number, lng: number) =>
  client.get<GeocodingResult>('/geo/reverse/', { params: { lat, lng } });

export const getRoute = (
  pickup_lat: number,
  pickup_lng: number,
  dropoff_lat: number,
  dropoff_lng: number,
) =>
  client.get<RouteResult>('/geo/route/', {
    params: { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng },
  });
