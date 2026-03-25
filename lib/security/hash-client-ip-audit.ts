/**
 * Node-only: IP fingerprint for audit logs. Do not import from Edge middleware.
 */
import { createHash } from 'crypto';

export function hashClientIpForAudit(ip: string | null | undefined): string | undefined {
  if (!ip || ip === 'unknown') return undefined;
  const salt = process.env.SECURITY_AUDIT_IP_SALT?.trim();
  if (!salt) return undefined;
  const full = createHash('sha256').update(`${salt}:${ip}`).digest('hex');
  return full.slice(0, 16);
}
