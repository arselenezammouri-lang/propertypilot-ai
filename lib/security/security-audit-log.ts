/**
 * Structured security audit events (JSON lines → stdout).
 * Safe fields only: no bodies, tokens, or raw PII. Optional ip_hash from hash-client-ip-audit (Node only).
 * Edge-safe: no Node crypto here (middleware can import this file).
 */

export type SecurityAuditAction =
  | 'edge_bot_block'
  | 'edge_rate_limit'
  | 'origin_rejected_trusted'
  | 'origin_rejected_embed'
  | 'payload_too_large'
  | 'method_not_allowed';

export type SecurityAuditEvent = {
  action: SecurityAuditAction;
  path: string;
  method?: string;
  status?: number;
  /** Machine-readable reason sub-code */
  detail?: string;
};

function isAuditEnabled(): boolean {
  if (process.env.SECURITY_AUDIT_LOG === 'false') return false;
  if (process.env.SECURITY_AUDIT_LOG === 'true') return true;
  return process.env.NODE_ENV === 'production';
}

/**
 * Emits one JSON line: `{ "type":"security_audit", ... }` for log drains (Vercel, Datadog, etc.).
 */
/** Edge / browser: same 16-hex prefix as Node `hash-client-ip-audit` (first 8 bytes of SHA-256). */
export async function hashClientIpForAuditEdge(
  ip: string | null | undefined
): Promise<string | undefined> {
  if (!ip || ip === 'unknown') return undefined;
  const salt = process.env.SECURITY_AUDIT_IP_SALT?.trim();
  if (!salt || typeof globalThis.crypto === 'undefined' || !globalThis.crypto.subtle) {
    return undefined;
  }
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const buf = await globalThis.crypto.subtle.digest('SHA-256', data);
  const arr = new Uint8Array(buf);
  let hex = '';
  for (let i = 0; i < 8; i++) {
    hex += arr[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export function logSecurityAudit(
  event: SecurityAuditEvent,
  extra?: { ipHash?: string; origin?: string }
): void {
  if (!isAuditEnabled()) return;

  const line = JSON.stringify({
    type: 'security_audit',
    ts: new Date().toISOString(),
    action: event.action,
    path: event.path,
    method: event.method,
    status: event.status,
    detail: event.detail,
    ...(extra?.ipHash ? { ip_hash: extra.ipHash } : {}),
    ...(extra?.origin ? { origin: extra.origin } : {}),
  });

  console.log(line);
}
