const axios = require('axios');
const config = require('../config');

const api = axios.create({
  baseURL: config.DJANGO_API_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'X-Service-Key': config.SERVICE_SECRET_KEY,
  },
  timeout: 5000,
});

module.exports = {
  async saveMessage({ ride_id, sender_id, text }) {
    const res = await api.post(`/internal/chat/${ride_id}/messages/`, {
      sender_id,
      text,
    });
    return res.data;
  },

  async updateRideStatus(rideId, status, data = {}) {
    const res = await api.post(`/internal/rides/${rideId}/status/`, {
      status,
      ...data,
    });
    return res.data;
  },

  async verifyToken(token) {
    const res = await api.get('/auth/verify/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
