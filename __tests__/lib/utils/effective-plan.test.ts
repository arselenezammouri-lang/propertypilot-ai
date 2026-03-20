import { resolveUiSubscriptionPlan } from '@/lib/utils/effective-plan';
import { getFounderEmail } from '@/lib/utils/founder-access';

describe('resolveUiSubscriptionPlan', () => {
  it('returns agency for founder only when localDevHost is true', () => {
    expect(resolveUiSubscriptionPlan(getFounderEmail(), 'free', { localDevHost: true })).toBe(
      'agency'
    );
    expect(
      resolveUiSubscriptionPlan(getFounderEmail().toUpperCase(), null, { localDevHost: true })
    ).toBe('agency');
  });

  it('returns DB plan for founder when not local dev host', () => {
    expect(resolveUiSubscriptionPlan(getFounderEmail(), 'free', { localDevHost: false })).toBe(
      'free'
    );
  });

  it('returns DB plan for non-founder', () => {
    expect(resolveUiSubscriptionPlan('other@example.com', 'pro')).toBe('pro');
    expect(resolveUiSubscriptionPlan('other@example.com', 'FREE')).toBe('free');
  });
});
