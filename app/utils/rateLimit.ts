import { redis } from './redis'

export async function checkRateLimit(ip: string, type: string, limit: number, windowInSeconds: number): Promise<boolean> {
  const key = `ratelimit-${type}:${ip}`
  const current = await redis.get(key)
  
  if (!current) {
    await redis.set(key, '1', windowInSeconds)
    return true
  }

  const count = parseInt(current)
  if (count >= limit) {
    return false
  }

  await redis.set(key, (count + 1).toString(), windowInSeconds)
  return true
} 