import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { evaluateApiGuard } from '@/lib/security/middleware-api-guard';
import { hashClientIpForAuditEdge, logSecurityAudit } from '@/lib/security/security-audit-log';
import { getEdgeClientIp } from '@/lib/security/request-ip';
import {
  isUpstashApiRateLimitConfigured,
  limitApiRequestUpstash,
} from '@/lib/security/upstash-api-rate-limit';
import { isAiCostlyApiPath } from '@/lib/security/ai-costly-api-path';
import {
  isUpstashAiRateLimitConfigured,
  limitAiRequestUpstash,
} from '@/lib/security/upstash-ai-rate-limit';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api/')) {
    const useRedis = isUpstashApiRateLimitConfigured();
    const ip = getEdgeClientIp(request);
    const isAiPost =
      request.method === 'POST' && isAiCostlyApiPath(pathname);

    if (useRedis) {
      const upstash = await limitApiRequestUpstash(`api:${ip}`);
      if (!upstash.ok) {
        const rawIp = ip;
        const ipHash = await hashClientIpForAuditEdge(
          rawIp === 'unknown' ? undefined : rawIp
        );
        logSecurityAudit(
          {
            action: 'edge_rate_limit',
            path: pathname,
            method: request.method,
            status: 429,
            detail: 'upstash',
          },
          { ipHash }
        );
        return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Retry-After': String(upstash.retryAfterSec),
          },
        });
      }
    }

    if (useRedis && isAiPost && isUpstashAiRateLimitConfigured()) {
      const aiUp = await limitAiRequestUpstash(`ai:${ip}`);
      if (!aiUp.ok) {
        const rawIp = ip;
        const ipHash = await hashClientIpForAuditEdge(
          rawIp === 'unknown' ? undefined : rawIp
        );
        logSecurityAudit(
          {
            action: 'edge_rate_limit',
            path: pathname,
            method: request.method,
            status: 429,
            detail: 'ai_upstash',
          },
          { ipHash }
        );
        return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Retry-After': String(aiUp.retryAfterSec),
          },
        });
      }
    }

    const guard = evaluateApiGuard(request, {
      skipGeneralMemoryRateLimit: useRedis,
      skipAiMemoryRateLimit: Boolean(useRedis && isAiPost && isUpstashAiRateLimitConfigured()),
    });
    if (guard) {
      const rawIp = getEdgeClientIp(request);
      const ipHash = await hashClientIpForAuditEdge(
        rawIp === 'unknown' ? undefined : rawIp
      );
      if (guard.type === 'bot') {
        logSecurityAudit(
          {
            action: 'edge_bot_block',
            path: pathname,
            method: request.method,
            status: 403,
            detail: guard.reason,
          },
          { ipHash }
        );
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });
      }
      logSecurityAudit(
        {
          action: 'edge_rate_limit',
          path: pathname,
          method: request.method,
          status: 429,
          detail: guard.type === 'rate' ? guard.detail : undefined,
        },
        { ipHash }
      );
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Retry-After': String(guard.retryAfterSec),
        },
      });
    }
    // Still refresh Supabase session cookies on API calls (browser fetch with credentials).
    return await updateSession(request);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    // Only run auth on HTML routes. Skip static assets to avoid any work on images/files.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)$).*)',
  ],
};
