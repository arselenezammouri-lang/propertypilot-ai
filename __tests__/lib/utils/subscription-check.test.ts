import { requireActiveSubscription, requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { STRIPE_PLANS } from '@/lib/stripe/config';

// Mock Supabase service
jest.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

// Mock Supabase server - create a shared chain that can be configured per test
const createMockChain = () => ({
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
});

let mockChain = createMockChain();

const mockSupabaseClient = {
  from: jest.fn(() => mockChain),
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

describe('Subscription Check', () => {
  describe('requireActiveSubscription', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockChain = createMockChain();
    });

    it('should allow access for PRO plan', async () => {
      mockChain.single.mockResolvedValue({
        data: {
          status: 'pro',
          stripe_subscription_id: 'sub_test123',
        },
        error: null,
      });

      const result = await requireActiveSubscription(mockSupabaseClient as any, 'user-123');
      
      expect(result.allowed).toBe(true);
      expect(result.planType).toBe('pro');
    });

    it('should deny access for FREE plan', async () => {
      mockChain.single.mockResolvedValue({
        data: {
          status: 'free',
          stripe_subscription_id: null,
        },
        error: null,
      });

      const result = await requireActiveSubscription(mockSupabaseClient as any, 'user-123');
      
      expect(result.allowed).toBe(false);
      expect(result.planType).toBe('free');
      expect(result.error).toContain('abbonamento');
    });

    it('should handle missing subscription gracefully', async () => {
      mockChain.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });

      const result = await requireActiveSubscription(mockSupabaseClient as any, 'user-123');
      
      // Should default to free plan
      expect(result.allowed).toBe(false);
      expect(result.planType).toBe('free');
    });
  });

  describe('requireProOrAgencySubscription', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockChain = createMockChain();
    });

    it('should allow access for PRO plan', async () => {
      mockChain.single.mockResolvedValue({
        data: {
          status: 'pro',
          stripe_subscription_id: 'sub_test123',
        },
        error: null,
      });

      const result = await requireProOrAgencySubscription(mockSupabaseClient as any, 'user-123');
      
      expect(result.allowed).toBe(true);
      expect(result.planType).toBe('pro');
    });

    it('should deny access for FREE plan', async () => {
      mockChain.single.mockResolvedValue({
        data: {
          status: 'free',
          stripe_subscription_id: null,
        },
        error: null,
      });

      const result = await requireProOrAgencySubscription(mockSupabaseClient as any, 'user-123');
      
      expect(result.allowed).toBe(false);
      // The error message should contain "Premium" or "PRO" or "AGENCY"
      expect(result.error).toMatch(/Premium|PRO|AGENCY|piano/i);
    });
  });

  describe('STRIPE_PLANS limits', () => {
    it('should have correct limits for each plan', () => {
      expect(STRIPE_PLANS.starter.limits.listingsPerMonth).toBe(50);
      expect(STRIPE_PLANS.pro.limits.listingsPerMonth).toBe(200);
      expect(STRIPE_PLANS.agency.limits.listingsPerMonth).toBe(-1); // Unlimited
    });
  });
});
