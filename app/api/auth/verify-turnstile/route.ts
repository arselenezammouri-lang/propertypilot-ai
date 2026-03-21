import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp } from '@/lib/utils/rate-limit';
import {
  isTurnstileEnforced,
  isTurnstileMisconfigured,
  verifyTurnstileToken,
} from '@/lib/utils/turnstile-verify';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  token: z.string().min(1, 'token required'),
});

/**
 * Validates Turnstile token before Supabase auth (login/signup).
 * When keys are not configured, returns success so local/dev keeps working.
 */
export async function POST(request: NextRequest) {
  if (isTurnstileMisconfigured()) {
    return NextResponse.json(
      { ok: false, error: 'turnstile_misconfigured' },
      { status: 503 }
    );
  }

  if (!isTurnstileEnforced()) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY!.trim();

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'token required' }, { status: 400 });
  }

  const ip = getClientIp(request);
  const result = await verifyTurnstileToken(parsed.data.token, secret, ip);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: 'verification_failed', codes: result.errorCodes },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true });
}
