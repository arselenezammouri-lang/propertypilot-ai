import { evaluateBotGuard } from '@/lib/security/bot-guard';

describe('evaluateBotGuard', () => {
  it('allows normal browsers when empty UA blocking is off', () => {
    expect(
      evaluateBotGuard('Mozilla/5.0 Chrome/120', {
        blockEmptyUserAgent: false,
        blockScannerUserAgent: true,
      })
    ).toEqual({ allow: true });
  });

  it('blocks empty UA when enabled', () => {
    expect(
      evaluateBotGuard('', {
        blockEmptyUserAgent: true,
        blockScannerUserAgent: false,
      })
    ).toEqual({ allow: false, reason: 'empty_ua' });
    expect(
      evaluateBotGuard(null, {
        blockEmptyUserAgent: true,
        blockScannerUserAgent: false,
      })
    ).toEqual({ allow: false, reason: 'empty_ua' });
  });

  it('blocks scanner-like user agents when enabled', () => {
    expect(
      evaluateBotGuard('sqlmap/1.0', {
        blockEmptyUserAgent: false,
        blockScannerUserAgent: true,
      })
    ).toEqual({ allow: false, reason: 'scanner_ua' });
  });
});
