const { authMiddleware } = require('../middleware/auth');
const redis = require('../services/redis');

module.exports = (io) => {
  const nsp = io.of('/rides');
  nsp.use(authMiddleware);

  nsp.on('connection', (socket) => {
    const user = socket.data.user;

    // Водитель подключается для приёма заказов
    if (user.role === 'driver') {
      socket.join('drivers:available');
      socket.join(`driver:${user.id}`);
    }

    // Подписка на конкретную поездку
    socket.on('ride:subscribe', (data) => {
      socket.join(`ride:${data.ride_id}`);
    });
  });

  // Функции для вызова из HTTP API (Django → Realtime)
  const notifyNewRide = (rideData, driverIds) => {
    driverIds.forEach((driverId) => {
      nsp.to(`driver:${driverId}`).emit('ride:new', {
        ride_id: rideData.id,
        pickup: rideData.pickup,
        dropoff: rideData.dropoff,
        price: rideData.price,
        distance: rideData.distance,
      });
    });
  };

  const notifyRideStatus = (rideId, status, data = {}) => {
    nsp.to(`ride:${rideId}`).emit(`ride:${status}`, {
      ride_id: rideId,
      ...data,
    });
  };

  return { notifyNewRide, notifyRideStatus };
};
