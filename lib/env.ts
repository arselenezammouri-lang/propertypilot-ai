/**
 * Centralized environment and app URL configuration.
 * Use getAppUrl() instead of repeating process.env.NEXT_PUBLIC_APP_URL || '...'
 * so staging and production use a single source of truth.
 */

import type { NextRequest } from 'next/server';

const DEFAULT_APP_URL = 'https://propertypilot-ai.vercel.app';

/**
 * Returns the public base URL of the app.
 * - In API routes: pass request to prefer request.nextUrl.origin (correct host in proxies).
 * - In pages/components or when request is not available: uses NEXT_PUBLIC_APP_URL or default.
 */
export function getAppUrl(request?: NextRequest): string {
  if (typeof request !== 'undefined' && request?.nextUrl?.origin) {
    return request.nextUrl.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL;
}

/**
 * Base URL for sitemap/robots and other static config (no request available).
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL;
}
