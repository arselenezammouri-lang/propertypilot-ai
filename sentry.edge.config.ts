/**
 * Sentry Edge Configuration
 * This file configures Sentry for Edge Runtime (Middleware, Edge API routes)
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  // DISABLED for launch: telemetry off
  enabled: false,
  tracesSampleRate: 0,
  
  environment: process.env.NODE_ENV || "development",
  
  debug: process.env.NODE_ENV === "development",
  
  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
    }
    
    return event;
  },
});
