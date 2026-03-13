const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const config = require('./config');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.CORS_ORIGINS,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// Подключение Redis adapter (опционально, для масштабирования)
// const { createAdapter } = require('@socket.io/redis-adapter');
// const { redisClient, redisSub } = require('./services/redis');
// io.adapter(createAdapter(redisClient, redisSub));

// Регистрация namespaces
require('./namespaces/tracking')(io);
require('./namespaces/chat')(io);
require('./namespaces/rides')(io);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'taxi-realtime' }));

// Internal API для Django (уведомления через HTTP)
app.use(express.json());

app.post('/internal/notify-ride', (req, res) => {
  const { ride_id, event, data, room } = req.body;
  const key = req.headers['x-service-key'];
  if (key !== config.SERVICE_SECRET_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  io.of('/rides').to(room || `ride:${ride_id}`).emit(event, data);
  res.json({ ok: true });
});

httpServer.listen(config.PORT, () => {
  console.log(`Realtime service running on port ${config.PORT}`);
});
