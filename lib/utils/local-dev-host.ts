/**
 * Rileva richieste verso l'app in sviluppo locale (npm run dev).
 * Usato per limitare override founder / preview AGENCY: in production
 * contano solo DB + Stripe; gli utenti paganti su localhost usano i dati reali.
 */

export function isLocalDevHostname(host: string | null | undefined): boolean {
  if (!host || typeof host !== 'string') return false;
  try {
    const raw = host.trim();
    const withProto = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `http://${raw}`;
    const { hostname } = new URL(withProto);
    const h = hostname.replace(/^\[|\]$/g, '').toLowerCase();
    return h === 'localhost' || h === '127.0.0.1' || h === '::1';
  } catch {
    return false;
  }
}

/** Founder → preview AGENCY: host locale oppure `next dev` (NODE_ENV=development). Mai su deploy production. */
export function isFounderSubscriptionPreviewAllowed(
  requestHost: string | null | undefined
): boolean {
  if (isLocalDevHostname(requestHost)) return true;
  return process.env.NODE_ENV === 'development';
}
