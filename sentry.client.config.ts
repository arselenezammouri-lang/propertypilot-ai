/**
 * Sentry Client Configuration
 * This file configures Sentry for the client-side of Next.js
 */

import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry if DSN is configured
const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: sentryDsn || undefined,
  // DISABLED for launch: telemetry off, we want speed
  enabled: false,
  
  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Set sample rate for Session Replay
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0, // If sampling entire sessions, sample 100% of sessions with an error
  
  environment: process.env.NODE_ENV || "development",
  
  // Disable debug logging in development unless DSN is configured
  debug: process.env.NODE_ENV === "development" && !!process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NEXT_PUBLIC_SENTRY_DEBUG === "true",
  
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
    }
    
    // Don't send events in development unless explicitly enabled
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_SENTRY_DEBUG !== "true") {
      return null;
    }
    
    return event;
  },
  
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "atomicFindClose",
    "fb_xd_fragment",
    "bmi_SafeAddOnload",
    "EBCallBackMessageReceived",
    "conduitPage",
  ],
});
