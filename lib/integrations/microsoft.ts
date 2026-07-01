/**
 * Microsoft Graph API — Outlook + Calendar integration
 * Docs: https://learn.microsoft.com/en-us/graph/overview
 */
import { logger } from '@/lib/utils/safe-logger';

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

export function getMicrosoftOAuthUrl(redirectUri: string): string {
  const clientId = process.env.MICROSOFT_OAUTH_CLIENT_ID;
  const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
  if (!clientId) return '';
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20Mail.Read%20Calendars.ReadWrite`;
}

export async function exchangeMicrosoftCode(code: string, redirectUri: string): Promise<{ access_token: string; refresh_token: string } | null> {
  const clientId = process.env.MICROSOFT_OAUTH_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_OAUTH_CLIENT_SECRET;
  const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
  if (!clientId || !clientSecret) return null;
  try {
    const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
    });
    if (!res.ok) throw new Error(`MS token ${res.status}`);
    return await res.json();
  } catch (err) { logger.error('MS token', err); return null; }
}

/** Create calendar event */
export async function createCalendarEvent(accessToken: string, event: { subject: string; start: string; end: string; location?: string; attendees?: string[] }): Promise<{ id: string } | null> {
  try {
    const body = {
      subject: event.subject,
      start: { dateTime: event.start, timeZone: 'Europe/Rome' },
      end: { dateTime: event.end, timeZone: 'Europe/Rome' },
      ...(event.location ? { location: { displayName: event.location } } : {}),
      ...(event.attendees ? { attendees: event.attendees.map(e => ({ emailAddress: { address: e }, type: 'required' })) } : {}),
    };
    const res = await fetch(`${GRAPH_BASE}/me/events`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`MS calendar ${res.status}`);
    return await res.json();
  } catch (err) { logger.error('MS calendar', err); return null; }
}
