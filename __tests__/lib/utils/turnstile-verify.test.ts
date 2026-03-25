import {
  isTurnstileEnforced,
  isTurnstileMisconfigured,
  isTurnstileWidgetConfigured,
  verifyTurnstileToken,
} from '@/lib/utils/turnstile-verify';

describe('turnstile-verify', () => {
  const originalFetch = global.fetch;
  let prevSecret: string | undefined;
  let prevSite: string | undefined;

  beforeEach(() => {
    prevSecret = process.env.TURNSTILE_SECRET_KEY;
    prevSite = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (prevSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = prevSecret;
    if (prevSite === undefined) delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    else process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = prevSite;
  });

  it('isTurnstileEnforced is true only when both keys are set', () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    expect(isTurnstileEnforced()).toBe(false);
    process.env.TURNSTILE_SECRET_KEY = 'sec';
    expect(isTurnstileEnforced()).toBe(false);
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'site';
    expect(isTurnstileEnforced()).toBe(true);
  });

  it('isTurnstileMisconfigured when only site key is set', () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'site';
    expect(isTurnstileWidgetConfigured()).toBe(true);
    expect(isTurnstileMisconfigured()).toBe(true);
    process.env.TURNSTILE_SECRET_KEY = 'sec';
    expect(isTurnstileMisconfigured()).toBe(false);
  });

  it('verifyTurnstileToken returns success when API says success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    }) as unknown as typeof fetch;

    const r = await verifyTurnstileToken('tok', 'secret', '1.2.3.4');
    expect(r).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('verifyTurnstileToken returns failure on invalid response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
    }) as unknown as typeof fetch;

    const r = await verifyTurnstileToken('bad', 'secret', null);
    expect(r.success).toBe(false);
    if (!r.success) expect(r.errorCodes).toContain('invalid-input-response');
  });
});
