import { Redis } from '@upstash/redis';

const r = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export const redis = {
  get: async (key: string) => {
    return await r.get(key);
  },
  set: async (key: string, value: string, ttl?: number) => {
    if (ttl) {
      return await r.set(key, value, { ex: ttl });
    }
    return await r.set(key, value);
  },
  del: async (key: string) => {
    return await r.del(key);
  }
}; 