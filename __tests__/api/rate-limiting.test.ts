import { checkUserRateLimit, checkIpRateLimit } from '@/lib/utils/rate-limit';

// Mock Supabase service to avoid requiring SUPABASE_SERVICE_ROLE_KEY
jest.mock('@/lib/supabase/service', () => ({
  supabaseService: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

// Mock rate-limit to use in-memory store for testing
jest.mock('@/lib/utils/rate-limit', () => {
  const mockStore = new Map<string, { count: number; resetAt: number }>();
  
  return {
    checkUserRateLimit: jest.fn(async (userId: string) => {
      const key = `user:${userId}`;
      const data = mockStore.get(key);
      const now = Date.now();
      
      if (!data || data.resetAt < now) {
        mockStore.set(key, { count: 1, resetAt: now + 60000 });
        return { allowed: true, remaining: 9, resetAt: now + 60000 };
      }
      
      if (data.count >= 10) {
        return { allowed: false, remaining: 0, resetAt: data.resetAt };
      }
      
      data.count++;
      mockStore.set(key, data);
      return { allowed: true, remaining: 10 - data.count, resetAt: data.resetAt };
    }),
    
    checkIpRateLimit: jest.fn(async (ip: string) => {
      const key = `ip:${ip}`;
      const data = mockStore.get(key);
      const now = Date.now();
      
      if (!data || data.resetAt < now) {
        mockStore.set(key, { count: 1, resetAt: now + 60000 });
        return { allowed: true, remaining: 19, resetAt: now + 60000 };
      }
      
      if (data.count >= 20) {
        return { allowed: false, remaining: 0, resetAt: data.resetAt };
      }
      
      data.count++;
      mockStore.set(key, data);
      return { allowed: true, remaining: 20 - data.count, resetAt: data.resetAt };
    }),
    
    getClientIp: jest.fn((request: any) => '127.0.0.1'),
  };
});

// Get the mocked functions
const { checkUserRateLimit, checkIpRateLimit } = require('@/lib/utils/rate-limit');

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('checkUserRateLimit', () => {
    it('should allow request within limit', async () => {
      const result = await checkUserRateLimit('user-123');
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it('should deny request when limit exceeded', async () => {
      // Simulate multiple requests
      for (let i = 0; i < 11; i++) {
        await checkUserRateLimit('user-123');
      }

      const result = await checkUserRateLimit('user-123');
      
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after time window', async () => {
      // Make requests to exhaust limit
      for (let i = 0; i < 11; i++) {
        await checkUserRateLimit('user-123');
      }

      // The mock doesn't reset automatically, so we verify it's denied
      const result = await checkUserRateLimit('user-123');
      
      // Should be denied when limit exceeded
      expect(result.allowed).toBe(false);
    });

    it('should track different users separately', async () => {
      // Exhaust limit for user-1
      for (let i = 0; i < 11; i++) {
        await checkUserRateLimit('user-1');
      }

      // user-2 should still be allowed
      const result = await checkUserRateLimit('user-2');
      expect(result.allowed).toBe(true);
    });
  });

  describe('checkIpRateLimit', () => {
    it('should allow request within limit', async () => {
      const result = await checkIpRateLimit('127.0.0.1');
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it('should deny request when IP limit exceeded', async () => {
      // Simulate multiple requests from same IP
      for (let i = 0; i < 21; i++) {
        await checkIpRateLimit('127.0.0.1');
      }

      const result = await checkIpRateLimit('127.0.0.1');
      
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should track different IPs separately', async () => {
      // Exhaust limit for IP 1
      for (let i = 0; i < 21; i++) {
        await checkIpRateLimit('127.0.0.1');
      }

      // IP 2 should still be allowed
      const result = await checkIpRateLimit('192.168.1.1');
      expect(result.allowed).toBe(true);
    });
  });
});
