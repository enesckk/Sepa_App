const redis = require('redis');
require('dotenv').config();

let redisClient = null;
let errorCount = 0;
const MAX_ERROR_LOGS = 3;

// Redis configuration
try {
  redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          return false; // Stop retrying after 10 attempts
        }
        return Math.min(retries * 100, 3000);
      },
    },
    password: process.env.REDIS_PASSWORD || undefined,
  });

  // Redis connection event handlers
  redisClient.on('connect', () => {
    console.log('✅ Redis client connected');
    errorCount = 0; // Reset error count on successful connection
  });

  redisClient.on('error', (err) => {
    errorCount++;
    if (errorCount <= MAX_ERROR_LOGS) {
      console.error('❌ Redis client error:', err.message);
      if (errorCount === MAX_ERROR_LOGS) {
        console.warn('⚠️  Redis connection failed. Continuing without Redis (errors will be silenced)...');
      }
    }
    // Silently handle subsequent errors
  });

  redisClient.on('ready', () => {
    console.log('✅ Redis client ready');
    errorCount = 0;
  });
} catch (error) {
  console.warn('⚠️  Redis client creation failed:', error.message);
  redisClient = null;
}

// Connect to Redis
const connectRedis = async () => {
  if (!redisClient) {
    return false;
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    return true;
  } catch (error) {
    if (errorCount <= MAX_ERROR_LOGS) {
      console.error('❌ Redis connection error:', error.message);
    }
    // Redis bağlantısı olmadan da çalışabilir (optional)
    return false;
  }
};

module.exports = {
  redisClient,
  connectRedis,
};

