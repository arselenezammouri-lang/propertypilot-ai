/**
 * Server-side Cloudflare Turnstile verification.
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

export type TurnstileVerifyResult =
  | { success: true }
  | { success: false; errorCodes: string[]; message: string };

export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  remoteIp: string | null
): Promise<TurnstileVerifyResult> {
  const body = new URLSearchParams();
  body.set('secret', secretKey);
  body.set('response', token);
  if (remoteIp) body.set('remoteip', remoteIp);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    return {
      success: false,
      errorCodes: ['network'],
      message: 'Turnstile verification unreachable',
    };
  }

  const data = (await res.json()) as {
    success?: boolean;
    'error-codes'?: string[];
  };

  if (data.success === true) {
    return { success: true };
  }

  const errorCodes = data['error-codes'] ?? ['unknown'];
  return {
    success: false,
    errorCodes,
    message: errorCodes.join(', '),
  };
}

export function isTurnstileEnforced(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY?.trim() && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()
  );
}

/** True when the public site key is set (client may render the widget). */
export function isTurnstileWidgetConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());
}

/** Misconfigured: widget would show in browser but server cannot verify. */
export function isTurnstileMisconfigured(): boolean {
  return isTurnstileWidgetConfigured() && !process.env.TURNSTILE_SECRET_KEY?.trim();
}
