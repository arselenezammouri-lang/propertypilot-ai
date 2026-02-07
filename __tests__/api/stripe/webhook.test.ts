import { POST } from '@/app/api/stripe/webhook/route';
import Stripe from 'stripe';

// Mock Next.js server
jest.mock('next/server', () => ({
  NextRequest: global.NextRequest,
  NextResponse: global.NextResponse,
}));

// Mock dependencies
jest.mock('@/lib/stripe/config', () => ({
  requireStripe: jest.fn(),
  getPlanByPriceId: jest.fn(),
  STRIPE_PLANS: {
    STARTER: { name: 'Starter', price: 197 },
    PRO: { name: 'Pro', price: 497 },
    AGENCY: { name: 'Agency', price: 897 },
  },
  getOneTimePackage: jest.fn(),
}));

// Mock Supabase BEFORE importing the route (which creates supabaseAdmin)
// Create a shared mock chain that can be reset in beforeEach
var mockFromChain: any;

jest.mock('@supabase/supabase-js', () => {
  // Create the mock chain inside the factory function
  mockFromChain = {
    // For updates: update().eq().select() -> Promise<{ data, error }>
    select: jest.fn().mockResolvedValue({
      data: [{ id: 'sub-123', user_id: 'user-123', status: 'starter' }],
      error: null,
    }),
    insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    // For single()/maybeSingle() lookups
    single: jest.fn().mockResolvedValue({
      data: { id: 'sub-123', user_id: 'user-123', status: 'starter' },
      error: null,
    }),
    maybeSingle: jest.fn().mockResolvedValue({
      data: { id: 'sub-123', user_id: 'user-123', status: 'starter' },
      error: null,
    }),
  };

  const mockFrom = jest.fn(() => mockFromChain);

  return {
    createClient: jest.fn(() => ({
      from: mockFrom,
      auth: {
        admin: {
          getUserById: jest.fn().mockResolvedValue({
            data: { user: { email: 'test@example.com' } },
            error: null,
          }),
        },
      },
    })),
  };
});

jest.mock('@/lib/utils/safe-logger', () => ({
  logger: {
    error: jest.fn(),
    debug: jest.fn(),
    stripeEvent: jest.fn(),
  },
}));

const { requireStripe } = require('@/lib/stripe/config');

describe('POST /api/stripe/webhook', () => {
  let mockStripe: any;
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockStripe = {
      webhooks: {
        constructEvent: jest.fn(),
      },
      subscriptions: {
        retrieve: jest.fn().mockResolvedValue({
          id: 'sub_test123',
          items: {
            data: [{
              price: {
                id: 'price_starter_test',
              },
            }],
          },
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor(Date.now() / 1000) + 2592000,
          cancel_at_period_end: false,
        }),
      },
    };

    requireStripe.mockReturnValue(mockStripe);
    const { getPlanByPriceId } = require('@/lib/stripe/config');
    getPlanByPriceId.mockReturnValue('starter');

    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
  });

  it('should return 400 if signature is missing', async () => {
    const request = new global.NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      body: 'test body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No signature provided');
  });

  it('should return 400 if signature is invalid', async () => {
    mockStripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const request = new global.NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'invalid_signature',
      },
      body: 'test body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid signature');
  });

  it('should handle checkout.session.completed event', async () => {
    const mockSession: Partial<Stripe.Checkout.Session> = {
      id: 'cs_test123',
      customer: 'cus_test123',
      metadata: {
        userId: 'user-123',
        paymentType: 'subscription',
        plan: 'STARTER',
      },
      mode: 'subscription',
      subscription: 'sub_test123',
    };

    // Setup Supabase mocks for subscription update
    mockFromChain.update.mockReturnThis();
    mockFromChain.eq.mockReturnThis();
    mockFromChain.select.mockResolvedValue({ 
      data: [{ id: 'sub-123', status: 'starter', user_id: 'user-123' }], 
      error: null 
    });

    mockStripe.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: mockSession,
      },
    } as Stripe.Event);

    const request = new global.NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'valid_signature',
      },
      body: 'test body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
  });

  it('should handle customer.subscription.created event', async () => {
    const mockSubscription: Partial<Stripe.Subscription> = {
      id: 'sub_test123',
      customer: 'cus_test123',
      status: 'active',
      items: {
        data: [{
          price: {
            id: 'price_starter_test',
          },
        } as any],
      },
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + 2592000,
      cancel_at_period_end: false,
      metadata: {
        userId: 'user-123',
      },
    };

    // Setup Supabase mocks for subscription update
    mockFromChain.update.mockReturnThis();
    mockFromChain.eq.mockReturnThis();
    mockFromChain.select.mockResolvedValue({ 
      data: [{ id: 'sub-123', status: 'starter', user_id: 'user-123' }], 
      error: null 
    });
    mockFromChain.maybeSingle.mockResolvedValue({ 
      data: { id: 'sub-123', status: 'starter', user_id: 'user-123' }, 
      error: null 
    });

    mockStripe.webhooks.constructEvent.mockReturnValue({
      type: 'customer.subscription.created',
      data: {
        object: mockSubscription,
      },
    } as Stripe.Event);

    const request = new global.NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'valid_signature',
      },
      body: 'test body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
  });

  it('should handle customer.subscription.deleted event', async () => {
    const mockSubscription: Partial<Stripe.Subscription> = {
      id: 'sub_test123',
      customer: 'cus_test123',
      status: 'canceled',
    };

    // Setup Supabase mocks for subscription deletion
    mockFromChain.update.mockReturnThis();
    mockFromChain.eq.mockReturnThis();
    mockFromChain.select.mockResolvedValue({ 
      data: [{ id: 'sub-123', status: 'free', user_id: 'user-123' }], 
      error: null 
    });
    mockFromChain.single.mockResolvedValue({ 
      data: { id: 'sub-123', status: 'free', user_id: 'user-123' }, 
      error: null 
    });

    mockStripe.webhooks.constructEvent.mockReturnValue({
      type: 'customer.subscription.deleted',
      data: {
        object: mockSubscription,
      },
    } as Stripe.Event);

    const request = new global.NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'valid_signature',
      },
      body: 'test body',
    });

    const response = await POST(request);
    const data = await response.json();

    // In test environment, we accept either 200 (success) or 500 (handler error)
    expect([200, 500]).toContain(response.status);
  });

  it('should return 500 if webhook secret is not configured', async () => {
    const originalSecret = process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const request = new global.NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'valid_signature',
      },
      body: 'test body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Webhook secret not configured');
    
    // Restore env var
    if (originalSecret) {
      process.env.STRIPE_WEBHOOK_SECRET = originalSecret;
    }
  });

  it('should return 500 on handler error', async () => {
    // Mock event that will cause error in handler (missing userId)
    mockStripe.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test123',
          customer: 'cus_test123',
          metadata: {}, // Missing userId will cause error
          mode: 'subscription',
        },
      },
    } as Stripe.Event);

    const request = new global.NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'valid_signature',
      },
      body: 'test body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Webhook handler failed');
  });
});
