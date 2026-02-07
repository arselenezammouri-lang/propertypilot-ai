/**
 * Safe Logger - Sistema di logging sicuro per produzione
 * 
 * REGOLE:
 * - NESSUN dato sensibile nei log (API keys, emails, user IDs, phone numbers, tokens)
 * - Log dettagliati solo in development
 * - Log sanitizzati in produzione
 * - Formato strutturato per monitoring
 * - Integrazione Sentry per error tracking
 */

import { captureException, captureMessage } from '@/lib/monitoring/sentry';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

class SafeLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Sanitizza un oggetto rimuovendo dati sensibili
   */
  private sanitize(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveKeys = [
      'password',
      'token',
      'api_key',
      'apiKey',
      'secret',
      'authorization',
      'auth',
      'email',
      'phone',
      'phoneNumber',
      'user_id',
      'userId',
      'call_id',
      'callId',
      'session_id',
      'sessionId',
      'stripe_customer_id',
      'stripe_subscription_id',
      'price_id',
      'card',
      'creditCard',
      'ssn',
      'socialSecurity',
    ];

    const sanitized: any = Array.isArray(data) ? [] : {};

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some(sk => lowerKey.includes(sk));

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Formatta il log con timestamp e livello
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(this.sanitize(context))}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Log info
   */
  info(message: string, context?: LogContext): void {
    const formatted = this.formatMessage('info', message, context);
    console.log(formatted);
  }

  /**
   * Log warning
   */
  warn(message: string, context?: LogContext): void {
    const formatted = this.formatMessage('warn', message, context);
    console.warn(formatted);
  }

  /**
   * Log error - sempre sanitizzato + Sentry integration
   */
  error(message: string, error?: any, context?: LogContext): void {
    let errorData: any = null;
    let errorInstance: Error | null = null;

    if (error) {
      if (error instanceof Error) {
        errorInstance = error;
        errorData = {
          name: error.name,
          message: error.message,
          stack: this.isDevelopment ? error.stack : '[REDACTED]',
        };
      } else if (typeof error === 'object') {
        errorData = this.sanitize(error);
        // Create Error instance for Sentry
        errorInstance = new Error(message);
      } else {
        errorData = String(error);
        errorInstance = new Error(message);
      }
    } else {
      errorInstance = new Error(message);
    }

    const fullContext = { ...context, error: errorData };
    const formatted = this.formatMessage('error', message, fullContext);
    console.error(formatted);

    // Send to Sentry if error instance exists
    if (errorInstance) {
      captureException(errorInstance, {
        message,
        ...this.sanitize(context || {}),
      });
    }
  }

  /**
   * Log debug - solo in development
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const formatted = this.formatMessage('debug', message, context);
      console.debug(formatted);
    }
  }

  /**
   * Log API request - sanitizzato
   */
  apiRequest(method: string, path: string, context?: LogContext): void {
    const sanitizedContext = {
      method,
      path,
      ...this.sanitize(context || {}),
    };
    this.info(`API Request: ${method} ${path}`, sanitizedContext);
  }

  /**
   * Log API response - sanitizzato
   */
  apiResponse(method: string, path: string, statusCode: number, context?: LogContext): void {
    const sanitizedContext = {
      method,
      path,
      statusCode,
      ...this.sanitize(context || {}),
    };
    this.info(`API Response: ${method} ${path} ${statusCode}`, sanitizedContext);
  }

  /**
   * Log subscription check - sanitizzato
   */
  subscriptionCheck(allowed: boolean, planType: string, context?: LogContext): void {
    const sanitizedContext = {
      allowed,
      planType,
      ...this.sanitize(context || {}),
    };
    this.debug(`Subscription Check: ${allowed ? 'ALLOWED' : 'DENIED'} (${planType})`, sanitizedContext);
  }

  /**
   * Log Stripe event - sanitizzato
   */
  stripeEvent(eventType: string, context?: LogContext): void {
    const sanitizedContext = {
      eventType,
      ...this.sanitize(context || {}),
    };
    this.info(`Stripe Event: ${eventType}`, sanitizedContext);
  }
}

// Singleton instance
export const logger = new SafeLogger();

// Export types
export type { LogContext, LogLevel };
