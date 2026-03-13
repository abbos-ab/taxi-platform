const { authMiddleware } = require('../middleware/auth');
const redis = require('../services/redis');

module.exports = (io) => {
  const nsp = io.of('/tracking');
  nsp.use(authMiddleware);

  nsp.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`[tracking] ${user.role}:${user.id} connected`);

    // Водитель отправляет свою локацию
    socket.on('driver:location', async (data) => {
      if (user.role !== 'driver') return;

      // Сохранить в Redis GEO
      await redis.updateDriverLocation(user.id, data.lat, data.lng);

      // Сохранить доп. данные
      await redis.setDriverMeta(user.id, {
        heading: data.heading,
        speed: data.speed,
        updated_at: Date.now(),
      });

      // Если водитель на активной поездке — отправить пассажиру
      const rideId = await redis.getDriverActiveRide(user.id);
      if (rideId) {
        nsp.to(`ride:${rideId}`).emit('driver:location:update', {
          driver_id: user.id,
          lat: data.lat,
          lng: data.lng,
          heading: data.heading,
          speed: data.speed,
        });
      }
    });

    // Пассажир подписывается на обновления поездки
    socket.on('ride:subscribe', (data) => {
      socket.join(`ride:${data.ride_id}`);
    });

    socket.on('disconnect', async () => {
      if (user.role === 'driver') {
        // Даём 30 сек на реконнект
        setTimeout(async () => {
          const sockets = await nsp.fetchSockets();
          const stillConnected = sockets.some((s) => s.data.user?.id === user.id);
          if (!stillConnected) {
            await redis.removeDriverLocation(user.id);
          }
        }, 30000);
      }
    });
  });
};
