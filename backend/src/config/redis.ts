import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redisClient: Redis | null = null;
let redisLogged = false;

export const connectRedis = async (): Promise<void> => {
  try {
    const options =
      process.env.REDIS_URL
        ? process.env.REDIS_URL
        : { host: process.env.REDIS_HOST || 'localhost', port: parseInt(process.env.REDIS_PORT || '6379', 10) };

    redisClient =
      typeof options === 'string'
        ? new Redis(options)
        : new Redis({ host: options.host, port: options.port, connectTimeout: 3000, lazyConnect: true });

    redisClient.on('connect', () => {
      redisLogged = false;
      logger.info('Redis connected successfully');
    });

    redisClient.on('error', () => {
      if (!redisLogged) {
        redisLogged = true;
        logger.warn('Redis is unavailable - continuing without cache');
      }
    });

    redisClient.on('ready', () => {
      redisLogged = false;
      logger.info('Redis ready');
    });

    await redisClient.connect();
  } catch (error) {
    if (!redisLogged) {
      redisLogged = true;
      logger.warn(`Redis unavailable: ${(error as Error).message}. Continuing without cache.`);
    }
    redisClient = null;
  }
};

export const cacheService = {
  async get(key: string): Promise<string | null> {
    if (!redisClient) return null;
    return await redisClient.get(key);
  },

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    if (!redisClient) return;
    await redisClient.setex(key, ttl, value);
  },

  async del(key: string): Promise<void> {
    if (!redisClient) return;
    await redisClient.del(key);
  },

  async invalidatePattern(pattern: string): Promise<void> {
    if (!redisClient) return;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  }
};

export default redisClient;
