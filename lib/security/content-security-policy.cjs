/**
 * Content-Security-Policy (Report-Only) — shared by next.config.mjs and tests.
 * Report-Only does not block; browsers log or POST violations only.
 */

/**
 * @param {{ isDev: boolean, reportUri?: string }} options
 * @returns {string}
 */
function buildContentSecurityPolicyReportOnly(options) {
  const { isDev, reportUri } = options;

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    'https://challenges.cloudflare.com',
  ];

  const directives = {
    'default-src': ["'self'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
    'object-src': ["'none'"],
    'script-src': scriptSrc,
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      'https://*.supabase.co',
      'wss://*.supabase.co',
      'https://challenges.cloudflare.com',
      'https://api.stripe.com',
      'https://*.ingest.sentry.io',
      'https://*.ingest.de.sentry.io',
    ],
    'frame-src': [
      "'self'",
      'https://calendly.com',
      'https://*.calendly.com',
      'https://challenges.cloudflare.com',
      'https://js.stripe.com',
      'https://hooks.stripe.com',
    ],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'media-src': ["'self'", 'https:'],
  };

  if (!isDev) {
    directives['upgrade-insecure-requests'] = [];
  }

  const parts = [];
  for (const [name, values] of Object.entries(directives)) {
    if (values.length === 0) {
      parts.push(name);
    } else {
      parts.push(`${name} ${values.join(' ')}`);
    }
  }

  if (reportUri && String(reportUri).trim()) {
    parts.push(`report-uri ${String(reportUri).trim()}`);
  }

  return parts.join('; ');
}

function shouldEmitCspReportOnly() {
  if (process.env.CSP_REPORT_ONLY_ENABLED === 'false') return false;
  if (process.env.CSP_REPORT_ONLY_ENABLED === 'true') return true;
  if (process.env.NODE_ENV === 'development') {
    return process.env.CSP_REPORT_ONLY_IN_DEV === 'true';
  }
  return true;
}

module.exports = {
  buildContentSecurityPolicyReportOnly,
  shouldEmitCspReportOnly,
};
