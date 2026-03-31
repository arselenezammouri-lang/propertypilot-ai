import { POST } from '@/app/api/stripe/checkout/route';
import { createClient } from '@/lib/supabase/server';
import { getOrCreateCustomer, createCheckoutSession } from '@/lib/stripe';

// Mock Next.js server
jest.mock('next/server', () => ({
  NextRequest: global.NextRequest,
  NextResponse: global.NextResponse,
}));

// Mock dependencies
jest.mock('@/lib/supabase/server');
jest.mock('@/lib/stripe', () => ({
  getOrCreateCustomer: jest.fn(),
  createCheckoutSession: jest.fn(),
  PLAN_TO_PRICE_ID: {
    STARTER: 'price_starter_test',
    PRO: 'price_pro_test',
    AGENCY: 'price_agency_test',
  },
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockGetOrCreateCustomer = getOrCreateCustomer as jest.MockedFunction<typeof getOrCreateCustomer>;
const mockCreateCheckoutSession = createCheckoutSession as jest.MockedFunction<typeof createCheckoutSession>;

describe('POST /api/stripe/checkout', () => {
  let mockSupabase: any;
  let mockUser: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    };

    mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          email: 'test@example.com',
          full_name: 'Test User',
          stripe_customer_id: null,
        },
        error: null,
      }),
      update: jest.fn().mockReturnThis(),
    };

    mockCreateClient.mockResolvedValue(mockSupabase as any);
    mockGetOrCreateCustomer.mockResolvedValue({ id: 'cus_test123' } as any);
    mockCreateCheckoutSession.mockResolvedValue({
      id: 'cs_test123',
      url: 'https://checkout.stripe.com/test',
    } as any);
  });

  it('should create checkout session for valid plan', async () => {
    const request = new global.NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan: 'STARTER' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.sessionId).toBe('cs_test123');
    expect(data.url).toBe('https://checkout.stripe.com/test');
    expect(mockGetOrCreateCustomer).toHaveBeenCalledWith(
      'user-123',
      'test@example.com',
      'Test User'
    );
    expect(mockCreateCheckoutSession).toHaveBeenCalledWith(
      'cus_test123',
      'price_starter_test',
      'user-123',
      expect.stringContaining('/dashboard?success=true'),
      expect.stringContaining('/dashboard?canceled=true'),
      expect.objectContaining({
        plan: 'STARTER',
        email: 'test@example.com',
        paymentType: 'subscription',
      })
    );
  });

  it('should return 401 if user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authenticated' },
    });

    const request = new global.NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan: 'STARTER' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 404 if profile not found', async () => {
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'Profile not found' },
    });

    const request = new global.NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan: 'PRO' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Profile not found');
  });

  it('should return 400 for invalid plan', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const request = new global.NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan: 'INVALID' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request');
    
    consoleErrorSpy.mockRestore();
  });

  it('should save customer ID if not present', async () => {
    mockGetOrCreateCustomer.mockResolvedValue({ id: 'cus_new123' } as any);

    const request = new global.NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan: 'AGENCY' }),
    });

    await POST(request);

    expect(mockSupabase.update).toHaveBeenCalledWith({
      stripe_customer_id: 'cus_new123',
    });
  });

  it('should handle all plan types', async () => {
    const plans = ['STARTER', 'PRO', 'AGENCY'] as const;

    for (const plan of plans) {
      const request = new global.NextRequest('http://localhost:3000/api/stripe/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    }
  });

  it('should return 500 on internal error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockCreateCheckoutSession.mockRejectedValue(new Error('Stripe API error'));

    const request = new global.NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan: 'STARTER' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
    
    consoleErrorSpy.mockRestore();
  });
});
