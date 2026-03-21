/**
 * Supabase session refresh for Edge middleware (same cookie contract as updateSession).
 * Use for /api/* when you need getUser() before returning (e.g. per-user rate limits).
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const DB_TIMEOUT_MS = 5000;

function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), DB_TIMEOUT_MS);
  return fetch(input, { ...init, signal: init?.signal ?? ctrl.signal }).finally(
    () => clearTimeout(id)
  );
}

export type MiddlewareSessionResult = {
  user: { id: string } | null;
  /** Pass-through response with refreshed auth cookies (use as final response for /api/*). */
  response: NextResponse;
};

/**
 * Reads session from cookies and refreshes tokens if needed (mutates `response` cookies).
 */
export async function refreshSessionInMiddleware(
  request: NextRequest
): Promise<MiddlewareSessionResult> {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: fetchWithTimeout },
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ? { id: data.user.id } : null;
  } catch {
    user = null;
  }

  return { user, response };
}
