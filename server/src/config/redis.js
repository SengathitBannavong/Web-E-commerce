import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from './env.js';

let redisClient = null;

// Redis configuration
const redisConfig = {
  host: REDIS_HOST || 'localhost',
  port: parseInt(REDIS_PORT || '6379'),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Add password if provided
if (REDIS_PASSWORD) {
  redisConfig.password = REDIS_PASSWORD;
}

// Create Redis client with error handling
export const getRedisClient = () => {
  if (!redisClient) {
    redisClient = new Redis(redisConfig);
    
    redisClient.on('connect', () => {
      console.log('[INFO] Connected to Redis successfully');
    });

    redisClient.on('error', (err) => {
      console.error('[ERROR] Redis connection error:', err.message);
    });

    redisClient.on('close', () => {
      console.log('[INFO] Redis connection closed');
    });

    redisClient.on('reconnecting', () => {
      console.log('[INFO] Reconnecting to Redis...');
    });
  }
  
  return redisClient;
};

// Test Redis connection
export const testRedisConnection = async () => {
  try {
    const client = getRedisClient();
    await client.ping();
    console.log('[INFO] Redis connection test successful');
    return true;
  } catch (error) {
    console.error('[ERROR] Redis connection test failed:', error.message);
    return false;
  }
};

// Close Redis connection gracefully
export const closeRedisConnection = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
      redisClient = null;
      console.log('[INFO] Redis connection closed gracefully');
    } catch (error) {
      console.error('[ERROR] Error closing Redis connection:', error.message);
    }
  }
};

// Cache helper functions
export const cacheHelper = {
  // Get data from cache
  async get(key) {
    try {
      const client = getRedisClient();
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache GET error:', error.message);
      return null;
    }
  },

  // Set data in cache with TTL (in seconds)
  async set(key, data, ttl = 3600) {
    try {
      const client = getRedisClient();
      await client.setex(key, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Cache SET error:', error.message);
      return false;
    }
  },

  // Delete specific cache key
  async del(key) {
    try {
      const client = getRedisClient();
      const result = await client.del(key);
      return result > 0;
    } catch (error) {
      console.error('Cache DELETE error:', error.message);
      return false;
    }
  },

  // Delete multiple keys matching a pattern
  async delPattern(pattern) {
    try {
      const client = getRedisClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        const result = await client.del(...keys);
        console.log(`[INFO] Deleted ${result} cache keys matching pattern: ${pattern}`);
        return result;
      }
      return 0;
    } catch (error) {
      console.error('[ERROR] Cache DELETE PATTERN error:', error.message);
      return 0;
    }
  },

  // Check if key exists
  async exists(key) {
    try {
      const client = getRedisClient();
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache EXISTS error:', error.message);
      return false;
    }
  }
};

export default { getRedisClient, testRedisConnection, closeRedisConnection, cacheHelper };