const axios = require('axios');
const config = require('../config');

const authMiddleware = async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));

  try {
    // Верифицируем JWT через Django API
    const response = await axios.get(`${config.DJANGO_API_URL}/api/v1/auth/verify/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    socket.data.user = response.data; // { id, phone, role, name }
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
};

module.exports = { authMiddleware };
