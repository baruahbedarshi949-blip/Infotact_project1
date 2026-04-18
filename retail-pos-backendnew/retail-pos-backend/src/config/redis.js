const Redis = require('ioredis');
const { REDIS_URL } = require('./env');

let redis = null;

if (REDIS_URL) {
  redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: false,
    tls: {
      rejectUnauthorized: false,
    }
  });

  redis.on('connect', () => {
    console.log('Redis connected ✅');
  });

  redis.on('error', (err) => {
    console.error('Redis error:', err.message);
  });

} else {
  console.log('⚠️ Redis disabled');
}

module.exports = redis;