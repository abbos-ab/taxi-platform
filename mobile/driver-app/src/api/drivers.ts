import client from './client';

export const driversApi = {
  goOnline: () => client.post('/drivers/go_online/'),
  goOffline: () => client.post('/drivers/go_offline/'),
  getProfile: () => client.get('/drivers/me/'),
};
