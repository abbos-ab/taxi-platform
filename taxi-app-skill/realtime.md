# Realtime Service Reference — Node.js + Socket.IO

## Table of Contents
1. [Project Setup](#project-setup)
2. [Architecture](#architecture)
3. [Namespaces & Events](#namespaces--events)
4. [Auth Middleware](#auth-middleware)
5. [Redis Integration](#redis-integration)
6. [Django API Client](#django-api-client)

---

## Project Setup

```bash
cd realtime/
npm init -y
npm install socket.io express redis axios jsonwebtoken cors dotenv
npm install -D nodemon
```

### Folder Structure

```
realtime/
├── src/
│   ├── index.js                 # Entry point
│   ├── config.js                # env vars
│   ├── namespaces/
│   │   ├── tracking.js          # /tracking namespace
│   │   ├── chat.js              # /chat namespace
│   │   └── rides.js             # /rides namespace
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── rateLimit.js         # rate limiting
│   └── services/
│       ├── redis.js             # Redis client + GEO ops
│       └── djangoApi.js         # calls to Django backend
├── package.json
├── .env.example
└── ecosystem.config.js          # PM2 config
```

---

## Architecture

```
                   ┌─────────────┐
  Mobile Apps ────▶│  Socket.IO  │◀──── Admin Panel
  (passengers,     │   Server    │
   drivers)        │  (Node.js)  │
                   └──────┬──────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
         ┌─────────┐ ┌────────┐ ┌──────────┐
         │  Redis   │ │ Django │ │   FCM    │
         │  (GEO)   │ │  API   │ │  (push)  │
         └─────────┘ └────────┘ └──────────┘
```

Socket.IO server acts as a bridge between clients and Django backend. It does NOT have its own database. All persistent data goes through Django API. Redis is used only for ephemeral data (driver locations, online status).

---

## Entry Point

```javascript
// src/index.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const config = require('./config');
const { redisClient, redisSub } = require('./services/redis');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.CORS_ORIGINS,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// Redis adapter для горизонтального масштабирования
io.adapter(createAdapter(redisClient, redisSub));

// Регистрация namespaces
require('./namespaces/tracking')(io);
require('./namespaces/chat')(io);
require('./namespaces/rides')(io);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

httpServer.listen(config.PORT, () => {
  console.log(`Realtime service running on port ${config.PORT}`);
});
```

---

## Namespaces & Events

### /tracking — GPS tracking

```javascript
// src/namespaces/tracking.js
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
      // data: { lat, lng, heading, speed }
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
      // data: { ride_id }
      socket.join(`ride:${data.ride_id}`);
    });

    socket.on('disconnect', async () => {
      if (user.role === 'driver') {
        // Не удаляем сразу — даём 30 сек на реконнект
        setTimeout(async () => {
          const sockets = await nsp.fetchSockets();
          const stillConnected = sockets.some(s => s.data.user?.id === user.id);
          if (!stillConnected) {
            await redis.removeDriverLocation(user.id);
          }
        }, 30000);
      }
    });
  });
};
```

### /chat — messaging

```javascript
// src/namespaces/chat.js
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
      // data: { ride_id, text }

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
```

### /rides — ride lifecycle events

```javascript
// src/namespaces/rides.js
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
    }

    // Подписка на конкретную поездку
    socket.on('ride:subscribe', (data) => {
      socket.join(`ride:${data.ride_id}`);
    });
  });

  // === SERVER-SIDE EVENTS (called from Django via internal API) ===

  // Новая поездка — уведомить ближайших водителей
  // Вызывается из Django через HTTP POST к realtime service
  const notifyNewRide = (rideData, driverIds) => {
    driverIds.forEach(driverId => {
      nsp.to(`driver:${driverId}`).emit('ride:new', {
        ride_id: rideData.id,
        pickup: rideData.pickup,
        dropoff: rideData.dropoff,
        price: rideData.price,
        distance: rideData.distance,
      });
    });
  };

  // Статус поездки изменился
  const notifyRideStatus = (rideId, status, data = {}) => {
    nsp.to(`ride:${rideId}`).emit(`ride:${status}`, {
      ride_id: rideId,
      ...data,
    });
  };

  // Экспорт для HTTP API
  return { notifyNewRide, notifyRideStatus };
};
```

### Full Events Table

| Event | Direction | Namespace | Payload |
|-------|-----------|-----------|---------|
| `driver:location` | Client → Server | /tracking | `{ lat, lng, heading, speed }` |
| `driver:location:update` | Server → Client | /tracking | `{ driver_id, lat, lng, heading, speed }` |
| `ride:subscribe` | Client → Server | /tracking, /rides | `{ ride_id }` |
| `message:send` | Client → Server | /chat | `{ ride_id, text }` |
| `message:received` | Server → Client | /chat | `{ id, sender, text, timestamp }` |
| `typing:start` | Client ↔ Server | /chat | `{ ride_id }` / `{ user_id }` |
| `typing:stop` | Client ↔ Server | /chat | `{ ride_id }` / `{ user_id }` |
| `ride:new` | Server → Driver | /rides | `{ ride_id, pickup, dropoff, price, distance }` |
| `ride:accepted` | Server → Passenger | /rides | `{ ride_id, driver, car, eta }` |
| `ride:arrived` | Server → Passenger | /rides | `{ ride_id }` |
| `ride:started` | Server → Both | /rides | `{ ride_id, timestamp }` |
| `ride:completed` | Server → Both | /rides | `{ ride_id, price, duration }` |
| `ride:cancelled` | Server → Both | /rides | `{ ride_id, reason, by }` |

---

## Auth Middleware

```javascript
// src/middleware/auth.js
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
```

---

## Redis Integration

```javascript
// src/services/redis.js
const { createClient } = require('redis');
const config = require('../config');

const client = createClient({ url: config.REDIS_URL });
const subscriber = client.duplicate();

client.connect();
subscriber.connect();

const DRIVER_LOCATIONS_KEY = 'driver:locations';
const DRIVER_META_PREFIX = 'driver:meta:';
const DRIVER_RIDE_PREFIX = 'driver:ride:';

module.exports = {
  redisClient: client,
  redisSub: subscriber,

  // GEO операции для водителей
  async updateDriverLocation(driverId, lat, lng) {
    await client.geoAdd(DRIVER_LOCATIONS_KEY, {
      member: driverId,
      latitude: lat,
      longitude: lng,
    });
  },

  async removeDriverLocation(driverId) {
    await client.zRem(DRIVER_LOCATIONS_KEY, driverId);
    await client.del(DRIVER_META_PREFIX + driverId);
  },

  async getNearbyDrivers(lat, lng, radiusKm = 5) {
    return client.geoSearch(DRIVER_LOCATIONS_KEY, {
      latitude: lat,
      longitude: lng,
    }, {
      radius: radiusKm,
      unit: 'km',
    }, {
      COUNT: 50,
      WITHCOORD: true,
      WITHDIST: true,
    });
  },

  async setDriverMeta(driverId, meta) {
    await client.set(DRIVER_META_PREFIX + driverId, JSON.stringify(meta), { EX: 300 }); // 5 min TTL
  },

  async setDriverActiveRide(driverId, rideId) {
    await client.set(DRIVER_RIDE_PREFIX + driverId, rideId, { EX: 7200 }); // 2h TTL
  },

  async getDriverActiveRide(driverId) {
    return client.get(DRIVER_RIDE_PREFIX + driverId);
  },

  async clearDriverActiveRide(driverId) {
    await client.del(DRIVER_RIDE_PREFIX + driverId);
  },
};
```

---

## Django API Client

```javascript
// src/services/djangoApi.js
const axios = require('axios');
const config = require('../config');

const api = axios.create({
  baseURL: config.DJANGO_API_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'X-Service-Key': config.SERVICE_SECRET_KEY, // internal auth
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
```

---

## Config

```javascript
// src/config.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  DJANGO_API_URL: process.env.DJANGO_API_URL || 'http://localhost:8000',
  SERVICE_SECRET_KEY: process.env.SERVICE_SECRET_KEY || 'change-me',
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
};
```

## PM2 Config

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'taxi-realtime',
    script: 'src/index.js',
    instances: 1,            // 1 инстанс (Socket.IO sticky sessions)
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
```
