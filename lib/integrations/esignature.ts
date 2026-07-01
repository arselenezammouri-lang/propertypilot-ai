/**
 * SignWell — Affordable E-Signature API
 * Docs: https://developers.signwell.com
 */
import { logger } from '@/lib/utils/safe-logger';

function getApiKey(): string | null { return process.env.SIGNWELL_API_KEY || null; }

export async function createDocument(name: string, fileBase64: string, signers: { name: string; email: string }[]): Promise<{ id: string } | null> {
  const key = getApiKey();
  if (!key) { logger.warn('SignWell not configured'); return null; }
  try {
    const res = await fetch('https://www.signwell.com/api/v1/documents/', {
      method: 'POST',
      headers: { 'X-Api-Key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, files: [{ name: `${name}.pdf`, file_base64: fileBase64 }], recipients: signers.map(s => ({ ...s, id: s.email })) }),
    });
    if (!res.ok) throw new Error(`SignWell ${res.status}`);
    return await res.json();
  } catch (err) { logger.error('SignWell create', err); return null; }
}

/**
 * YouSign — EU eIDAS Compliant E-Signature
 * Docs: https://developers.yousign.com
 */
export async function createYouSignProcedure(name: string, fileBase64: string, signers: { firstName: string; lastName: string; email: string; phone: string }[]): Promise<{ id: string } | null> {
  const key = process.env.YOUSIGN_API_KEY;
  if (!key) { logger.warn('YouSign not configured'); return null; }
  try {
    const res = await fetch('https://api.yousign.app/v3/signature_requests', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, delivery_mode: 'email', signers: signers.map(s => ({ info: s })) }),
    });
    if (!res.ok) throw new Error(`YouSign ${res.status}`);
    return await res.json();
  } catch (err) { logger.error('YouSign create', err); return null; }
}
