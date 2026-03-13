export type AuthStackParamList = {
  Auth: undefined;
  OTP: { phone: string };
};

export type MainStackParamList = {
  MainTabs: undefined;
  Order: { pickup: { lat: number; lng: number; address: string }; dropoff: { lat: number; lng: number; address: string } };
  Searching: { rideId: string };
  Ride: { rideId: string };
  Rating: { rideId: string; price: string };
  Chat: { rideId: string };
};

export type TabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};
