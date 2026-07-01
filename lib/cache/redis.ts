/**
 * Upstash Redis (serverless caching)
 * Docs: https://docs.upstash.com/redis
 */
import { logger } from '@/lib/utils/safe-logger';

const getConfig = () => ({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

async function redisCommand(command: string[]): Promise<unknown> {
  const { url, token } = getConfig();
  if (!url || !token) return null;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
    });
    if (!res.ok) throw new Error(`Redis ${res.status}`);
    const data = await res.json();
    return data.result;
  } catch (err) { logger.error('Redis error', err); return null; }
}

/** Get cached value */
export async function get(key: string): Promise<string | null> {
  const result = await redisCommand(['GET', key]);
  return typeof result === 'string' ? result : null;
}

/** Set value with optional TTL (seconds) */
export async function set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
  const cmd = ttlSeconds ? ['SET', key, value, 'EX', String(ttlSeconds)] : ['SET', key, value];
  const result = await redisCommand(cmd);
  return result === 'OK';
}

/** Delete a key */
export async function del(key: string): Promise<boolean> {
  const result = await redisCommand(['DEL', key]);
  return result === 1;
}

/** Get JSON value */
export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = await get(key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/** Set JSON value with optional TTL */
export async function setJSON(key: string, value: unknown, ttlSeconds?: number): Promise<boolean> {
  return set(key, JSON.stringify(value), ttlSeconds);
}

/** Check if Redis is configured */
export function isConfigured(): boolean {
  const { url, token } = getConfig();
  return Boolean(url && token);
}
