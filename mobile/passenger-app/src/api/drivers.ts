import client from './client';

export const driversApi = {
  getNearby: (lat: number, lng: number, radius = 5) =>
    client.get('/drivers/nearby/', { params: { lat, lng, radius } }),
};
