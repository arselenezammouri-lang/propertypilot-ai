/**
 * Rileva richieste verso l'app in sviluppo locale (npm run dev).
 * Usato per limitare override founder / preview AGENCY: in production
 * contano solo DB + Stripe; gli utenti paganti su localhost usano i dati reali.
 */
export function isLocalDevHostname(host: string | null | undefined): boolean {
  if (!host || typeof host !== 'string') return false;
  const trimmed = host.trim().toLowerCase();
  let hostname: string;
  if (trimmed.startsWith('[')) {
    const end = trimmed.indexOf(']');
    hostname = end === -1 ? trimmed : trimmed.slice(1, end);
  } else {
    hostname = trimmed.split(':')[0];
  }
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}
