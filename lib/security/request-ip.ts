import type { NextRequest } from 'next/server';

/**
 * Client IP for Edge middleware (no Node-only APIs).
 * Trust order matches `getClientIp` in rate-limit.ts for API routes.
 */
export function getEdgeClientIp(request: NextRequest): string {
  const headers = request.headers;
  const candidates = [
    headers.get('cf-connecting-ip'),
    headers.get('x-vercel-forwarded-for'),
    headers.get('x-real-ip'),
    headers.get('x-forwarded-for'),
  ];

  for (const value of candidates) {
    if (value) {
      const first = value.split(',')[0]?.trim();
      if (first) return first;
    }
  }

  return 'unknown';
}
