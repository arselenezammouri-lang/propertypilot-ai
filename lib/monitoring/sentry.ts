/**
 * Error monitoring utility.
 * Usa safe-logger di default; con @sentry/nextjs configurato puoi
 * aggiungere Sentry.captureException per invio a Sentry.
 */
import { logger } from '@/lib/utils/safe-logger';

/**
 * Capture un'eccezione per monitoring.
 * Attualmente logga in console/server; con Sentry configurato
 * puoi aggiungere: Sentry?.captureException?.(error);
 */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error('captureException', { error: err.message, stack: err.stack, ...context });
}
