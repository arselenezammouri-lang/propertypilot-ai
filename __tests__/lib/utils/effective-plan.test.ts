import { resolveUiSubscriptionPlan } from '@/lib/utils/effective-plan';
import { getFounderEmail } from '@/lib/utils/founder-access';

describe('resolveUiSubscriptionPlan', () => {
  it('returns agency for founder email regardless of DB value', () => {
    expect(resolveUiSubscriptionPlan(getFounderEmail(), 'free')).toBe('agency');
    expect(resolveUiSubscriptionPlan(getFounderEmail().toUpperCase(), null)).toBe('agency');
  });

  it('returns DB plan for non-founder', () => {
    expect(resolveUiSubscriptionPlan('other@example.com', 'pro')).toBe('pro');
    expect(resolveUiSubscriptionPlan('other@example.com', 'FREE')).toBe('free');
  });
});
