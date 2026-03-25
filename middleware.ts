import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { refreshSessionInMiddleware } from '@/lib/supabase/middleware-session-refresh';
import { copySessionCookiesTo } from '@/lib/supabase/apply-session-cookies';
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
import {
  isUpstashAiUserRateLimitConfigured,
  limitAiUserRequestUpstash,
} from '@/lib/security/upstash-ai-user-rate-limit';
import { shouldBlockAllIndexing } from '@/lib/seo/build-robots';

function withNoIndexWhenBlocked(response: NextResponse): NextResponse {
  if (shouldBlockAllIndexing()) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

function jsonWithSession(
  sessionResponse: NextResponse,
  body: object,
  status: number,
  extraHeaders?: Record<string, string>
): NextResponse {
  const res = new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
  copySessionCookiesTo(sessionResponse, res);
  return res;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api/')) {
    const { user, response: sessionResponse } =
      await refreshSessionInMiddleware(request);

    const useRedis = isUpstashApiRateLimitConfigured();
    const ip = getEdgeClientIp(request);
    const isAiPost =
      request.method === 'POST' && isAiCostlyApiPath(pathname);
    const userId = user?.id ?? null;

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
        return withNoIndexWhenBlocked(
          jsonWithSession(sessionResponse, { error: 'Too many requests' }, 429, {
            'Retry-After': String(upstash.retryAfterSec),
          })
        );
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
        return withNoIndexWhenBlocked(
          jsonWithSession(sessionResponse, { error: 'Too many requests' }, 429, {
            'Retry-After': String(aiUp.retryAfterSec),
          })
        );
      }
    }

    if (
      useRedis &&
      isAiPost &&
      userId &&
      isUpstashAiUserRateLimitConfigured()
    ) {
      const userUp = await limitAiUserRequestUpstash(userId);
      if (!userUp.ok) {
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
            detail: 'ai_user_upstash',
          },
          { ipHash }
        );
        return withNoIndexWhenBlocked(
          jsonWithSession(sessionResponse, { error: 'Too many requests' }, 429, {
            'Retry-After': String(userUp.retryAfterSec),
          })
        );
      }
    }

    const skipAiUserRedis =
      Boolean(useRedis && isAiPost && userId && isUpstashAiUserRateLimitConfigured());

    const guard = evaluateApiGuard(request, {
      skipGeneralMemoryRateLimit: useRedis,
      skipAiMemoryRateLimit: Boolean(useRedis && isAiPost && isUpstashAiRateLimitConfigured()),
      skipAiUserMemoryRateLimit: skipAiUserRedis,
      authenticatedUserId: userId,
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
        return withNoIndexWhenBlocked(
          jsonWithSession(sessionResponse, { error: 'Forbidden' }, 403)
        );
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
      return withNoIndexWhenBlocked(
        jsonWithSession(sessionResponse, { error: 'Too many requests' }, 429, {
          'Retry-After': String(guard.retryAfterSec),
        })
      );
    }

    return withNoIndexWhenBlocked(sessionResponse);
  }

  return withNoIndexWhenBlocked(await updateSession(request));
}

export const config = {
  matcher: [
    // Only run auth on HTML routes. Skip static assets to avoid any work on images/files.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)$).*)',
  ],
};
