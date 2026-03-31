import { Resend } from 'resend';

let connectionSettings: any;

/**
 * Get Resend credentials.
 * Priority: RESEND_API_KEY (Vercel/production) -> Replit Connectors
 */
async function getCredentials(): Promise<{ apiKey: string; fromEmail: string }> {
  // Vercel / Standalone: use standard env vars
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@propertypilot.ai';

  if (apiKey) {
    return { apiKey, fromEmail };
  }

  // Replit: try connectors (optional - only when Replit env vars exist)
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (hostname && xReplitToken) {
    connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
      {
        headers: {
          Accept: 'application/json',
          'X_REPLIT_TOKEN': xReplitToken,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => data.items?.[0]);

    if (connectionSettings?.settings?.api_key) {
      return {
        apiKey: connectionSettings.settings.api_key,
        fromEmail: connectionSettings.settings.from_email || fromEmail,
      };
    }
  }

  throw new Error(
    'Resend not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in Vercel Environment Variables.'
  );
}

export async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail || 'noreply@propertypilot.ai',
  };
}

/**
 * Check if email sending is available (for graceful degradation)
 */
export function isEmailConfigured(): boolean {
  return !!(
    process.env.RESEND_API_KEY ||
    (process.env.REPLIT_CONNECTORS_HOSTNAME && (process.env.REPL_IDENTITY || process.env.WEB_REPL_RENEWAL))
  );
}
