/**
 * PropertyPilot AI - In-Memory Rate Limiter
 * Silicon Valley Elite Security - Protects AI costs with efficient memory-based limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  'ai-generation': { maxRequests: 10, windowMs: 60 * 1000 }, // 10 requests/min for AI
  'ai-expensive': { maxRequests: 5, windowMs: 60 * 1000 },   // 5 requests/min for expensive AI ops
  'scraping': { maxRequests: 3, windowMs: 60 * 1000 },        // 3 requests/min for scraping
  'api-general': { maxRequests: 60, windowMs: 60 * 1000 },    // 60 requests/min general
  'auth': { maxRequests: 5, windowMs: 60 * 1000 },            // 5 login attempts/min
  'checkout': { maxRequests: 3, windowMs: 60 * 1000 },        // 3 checkout attempts/min
};

class InMemoryRateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  private startCleanup() {
    if (this.cleanupInterval) return;
    
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (entry.resetTime <= now) {
          this.store.delete(key);
        }
      }
    }, 60 * 1000);
  }

  check(
    identifier: string,
    category: keyof typeof DEFAULT_CONFIGS = 'api-general'
  ): { allowed: boolean; remaining: number; resetIn: number; message?: string } {
    const config = DEFAULT_CONFIGS[category] || DEFAULT_CONFIGS['api-general'];
    const key = `${category}:${identifier}`;
    const now = Date.now();

    let entry = this.store.get(key);

    if (!entry || entry.resetTime <= now) {
      entry = { count: 0, resetTime: now + config.windowMs };
      this.store.set(key, entry);
    }

    const remaining = Math.max(0, config.maxRequests - entry.count);
    const resetIn = Math.max(0, Math.ceil((entry.resetTime - now) / 1000));

    if (entry.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetIn,
        message: `Rate limit exceeded. Please wait ${resetIn} seconds before trying again.`
      };
    }

    entry.count++;
    return { allowed: true, remaining: remaining - 1, resetIn };
  }

  reset(identifier: string, category: string) {
    const key = `${category}:${identifier}`;
    this.store.delete(key);
  }

  getStats() {
    return {
      totalKeys: this.store.size,
      categories: Object.keys(DEFAULT_CONFIGS)
    };
  }
}

export const rateLimiter = new InMemoryRateLimiter();

export function getRateLimitHeaders(result: { remaining: number; resetIn: number }) {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetIn.toString(),
  };
}

export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  category: keyof typeof DEFAULT_CONFIGS = 'api-general'
) {
  return async (request: Request): Promise<Response> => {
    const ip = getClientIP(request) || 'unknown';
    const result = rateLimiter.check(ip, category);

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: result.message,
          retryAfter: result.resetIn
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': result.resetIn.toString(),
            ...getRateLimitHeaders(result)
          }
        }
      );
    }

    const response = await handler(request);
    
    const headers = new Headers(response.headers);
    headers.set('X-RateLimit-Remaining', result.remaining.toString());
    headers.set('X-RateLimit-Reset', result.resetIn.toString());

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  };
}

function getClientIP(request: Request): string | null {
  const headers = [
    'x-real-ip',
    'x-forwarded-for',
    'cf-connecting-ip',
    'x-client-ip',
    'x-cluster-client-ip'
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      const ip = value.split(',')[0].trim();
      if (ip && ip !== 'unknown') return ip;
    }
  }

  return null;
}
