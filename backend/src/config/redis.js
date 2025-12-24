const redis = require('redis');
require('dotenv').config();

let redisClient = null;
let redisConnected = false;

// Redis configuration
const createRedisClient = () => {
  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.warn('⚠️  Redis reconnection attempts exhausted, Redis will be disabled');
            return false; // Stop reconnecting
          }
          return Math.min(retries * 100, 3000);
        },
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    // Redis connection event handlers
    redisClient.on('connect', () => {
      console.log('✅ Redis client connected');
      redisConnected = true;
    });

    redisClient.on('error', (err) => {
      // Only log once to avoid spam
      if (!redisConnected) {
        console.warn('⚠️  Redis connection error (Redis is optional):', err.message);
        redisConnected = false;
      }
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis client ready');
      redisConnected = true;
    });

    redisClient.on('end', () => {
      console.warn('⚠️  Redis connection ended');
      redisConnected = false;
    });

    return redisClient;
  } catch (error) {
    console.warn('⚠️  Redis client creation failed (Redis is optional):', error.message);
    return null;
  }
};

// Connect to Redis
const connectRedis = async () => {
  // Redis is optional, don't fail if it's not available
  if (process.env.REDIS_DISABLED === 'true') {
    console.log('ℹ️  Redis is disabled via REDIS_DISABLED environment variable');
    return false;
  }

  try {
    const client = createRedisClient();
    if (!client) {
      return false;
    }

    if (!client.isOpen) {
      await client.connect();
      redisConnected = true;
      return true;
    }
    return redisConnected;
  } catch (error) {
    // Redis is optional, don't throw error
    console.warn('⚠️  Redis connection failed (Redis is optional):', error.message);
    redisConnected = false;
    return false;
  }
};

// Get Redis client (returns null if not connected)
const getRedisClient = () => {
  if (redisConnected && redisClient && redisClient.isOpen) {
    return redisClient;
  }
  return null;
};

// Lazy getter for redisClient
const getRedisClientLazy = () => {
  if (!redisClient) {
    return createRedisClient();
  }
  return redisClient;
};

module.exports = {
  get redisClient() {
    return getRedisClientLazy();
  },
  connectRedis,
  getRedisClient,
  isRedisConnected: () => redisConnected,
};

