import { Redis } from 'ioredis';

const r = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined
});

r.on('error', (error) => {
  console.error('Redis Client Error:', error);
});

export const redis = {
  get: async (key: string) => {
    return await r.get(key);
  },
  set: async (key: string, value: string, ttl?: number) => {
    if (ttl) {
      return await r.set(key, value, 'EX', ttl);
    }
    return await r.set(key, value);
  },
  del: async (key: string) => {
    return await r.del(key);
  }
}; 