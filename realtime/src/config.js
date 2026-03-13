require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  DJANGO_API_URL: process.env.DJANGO_API_URL || 'http://localhost:8000',
  SERVICE_SECRET_KEY: process.env.SERVICE_SECRET_KEY || 'change-me',
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
};
