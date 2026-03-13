const { createClient } = require('redis');
const config = require('../config');

const client = createClient({ url: config.REDIS_URL });
const subscriber = client.duplicate();

client.on('error', (err) => console.error('Redis Client Error:', err));
subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));

// Подключение при старте
(async () => {
  await client.connect();
  await subscriber.connect();
  console.log('Redis connected');
})();

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
    });
  },

  async setDriverMeta(driverId, meta) {
    await client.set(DRIVER_META_PREFIX + driverId, JSON.stringify(meta), { EX: 300 });
  },

  async setDriverActiveRide(driverId, rideId) {
    await client.set(DRIVER_RIDE_PREFIX + driverId, rideId, { EX: 7200 });
  },

  async getDriverActiveRide(driverId) {
    return client.get(DRIVER_RIDE_PREFIX + driverId);
  },

  async clearDriverActiveRide(driverId) {
    await client.del(DRIVER_RIDE_PREFIX + driverId);
  },
};
