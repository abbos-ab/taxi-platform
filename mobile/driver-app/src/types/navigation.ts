export type AuthStackParamList = {
  Auth: undefined;
  OTP: { phone: string };
};

export type MainStackParamList = {
  MainTabs: undefined;
  NewOrder: { ride: import('./ride').NewRideRequest };
  Navigation: { rideId: string; pickupLat: number; pickupLng: number };
  Ride: { rideId: string };
  Chat: { rideId: string };
};

export type TabParamList = {
  Home: undefined;
  Earnings: undefined;
  History: undefined;
  Profile: undefined;
};
