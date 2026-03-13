const { authMiddleware } = require('../middleware/auth');
const djangoApi = require('../services/djangoApi');

module.exports = (io) => {
  const nsp = io.of('/chat');
  nsp.use(authMiddleware);

  nsp.on('connection', (socket) => {
    const user = socket.data.user;

    // Присоединиться к комнате чата поездки
    socket.on('chat:join', (data) => {
      socket.join(`chat:${data.ride_id}`);
    });

    // Отправить сообщение
    socket.on('message:send', async (data) => {
      // Сохранить в БД через Django
      const message = await djangoApi.saveMessage({
        ride_id: data.ride_id,
        sender_id: user.id,
        text: data.text,
      });

      // Отправить всем в комнате
      nsp.to(`chat:${data.ride_id}`).emit('message:received', {
        id: message.id,
        sender: { id: user.id, name: user.name },
        text: data.text,
        timestamp: new Date().toISOString(),
      });
    });

    // Индикатор набора текста
    socket.on('typing:start', (data) => {
      socket.to(`chat:${data.ride_id}`).emit('typing:start', {
        user_id: user.id,
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(`chat:${data.ride_id}`).emit('typing:stop', {
        user_id: user.id,
      });
    });
  });
};
