/**
 * Next.js Instrumentation Hook
 * DISABLED: Sentry/telemetry off for launch - speed over monitoring
 */

export async function register() {
  // Sentry disabled - was causing slowdown. Re-enable post-launch if needed.
  // if (process.env.NEXT_RUNTIME === 'nodejs') {
  //   await import('./sentry.server.config');
  // }
  // if (process.env.NEXT_RUNTIME === 'edge') {
  //   await import('./sentry.edge.config');
  // }
}
