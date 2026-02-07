/**
 * Sentry Error Tracking - Helper Functions
 * 
 * These functions work whether Sentry is installed or not.
 * If Sentry is installed, errors are sent to Sentry.
 * If not, they fall back to console logging.
 */

let Sentry: any = null;

// Try to import Sentry (will be null if not installed)
try {
  Sentry = require("@sentry/nextjs");
} catch {
  // Sentry not installed, use fallback
}

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, { 
      extra: context,
      tags: {
        component: context?.component || 'unknown',
      },
    });
  } else {
    // Fallback to logger in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sentry disabled] Exception:', error, context);
    }
  }
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) => {
  if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level: level === 'info' ? 'info' : level === 'warning' ? 'warning' : 'error',
      extra: context,
    });
  } else {
    // Fallback to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level.toUpperCase()}] ${message}`, context || '');
    }
  }
};

export const setUser = (userId: string, email?: string, username?: string) => {
  if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser({
      id: userId,
      email: email,
      username: username,
    });
  }
};

export const addBreadcrumb = (message: string, category?: string, level?: 'info' | 'warning' | 'error', data?: Record<string, any>) => {
  if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message,
      category: category || 'default',
      level: level || 'info',
      data,
    });
  }
};
