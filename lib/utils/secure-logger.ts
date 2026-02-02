/**
 * PropertyPilot AI - Secure Logger
 * Prevents accidental exposure of sensitive data in logs
 */

const SENSITIVE_PATTERNS = [
  /sk_live_[a-zA-Z0-9]+/g,
  /sk_test_[a-zA-Z0-9]+/g,
  /pk_live_[a-zA-Z0-9]+/g,
  /pk_test_[a-zA-Z0-9]+/g,
  /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
  /[a-zA-Z0-9]{32,}/g,
  /password["\s:=]+["']?[^"'\s]+["']?/gi,
  /secret["\s:=]+["']?[^"'\s]+["']?/gi,
  /api[_-]?key["\s:=]+["']?[^"'\s]+["']?/gi,
  /bearer\s+[a-zA-Z0-9._-]+/gi,
];

function sanitize(input: unknown): string {
  if (input === null || input === undefined) {
    return String(input);
  }

  let str = typeof input === 'string' ? input : JSON.stringify(input, null, 2);

  for (const pattern of SENSITIVE_PATTERNS) {
    str = str.replace(pattern, (match) => {
      if (match.length < 8) return match;
      return match.substring(0, 4) + '****' + match.substring(match.length - 4);
    });
  }

  return str;
}

const isDev = process.env.NODE_ENV === 'development';

export const secureLogger = {
  info: (...args: unknown[]) => {
    if (isDev) {
      console.log('[INFO]', ...args.map(sanitize));
    }
  },

  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args.map(sanitize));
  },

  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args.map(sanitize));
  },

  debug: (...args: unknown[]) => {
    if (isDev) {
      console.debug('[DEBUG]', ...args.map(sanitize));
    }
  },

  api: (endpoint: string, status: number, duration?: number) => {
    const durationStr = duration ? ` (${duration}ms)` : '';
    console.log(`[API] ${endpoint} → ${status}${durationStr}`);
  },

  ai: (operation: string, model: string, tokens?: number) => {
    const tokensStr = tokens ? ` | ${tokens} tokens` : '';
    console.log(`[AI] ${operation} | ${model}${tokensStr}`);
  },

  security: (event: string, details?: Record<string, unknown>) => {
    const safeDetails = details ? ` | ${sanitize(details)}` : '';
    console.warn(`[SECURITY] ${event}${safeDetails}`);
  }
};

export default secureLogger;
