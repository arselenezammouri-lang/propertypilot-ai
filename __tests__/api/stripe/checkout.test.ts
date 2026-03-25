import { POST } from '@/app/api/stripe/checkout/route';
import { getOrCreateCustomer, createCheckoutSession } from '@/lib/stripe';
import { getAuthenticatedUser } from '@/lib/api/auth-helper';

// Mock Next.js server
jest.mock('next/server', () => ({
  NextRequest: global.NextRequest,
  NextResponse: global.NextResponse,
}));

jest.mock('@/lib/api/auth-helper');
jest.mock('@/lib/stripe', () => ({
  getOrCreateCustomer: jest.fn(),
  createCheckoutSession: jest.fn(),
  PLAN_TO_PRICE_ID: {
    STARTER: 'price_starter_test',
    PRO: 'price_pro_test',
    AGENCY: 'price_agency_test',
  },
}));

const mockGetAuthenticatedUser = getAuthenticatedUser as jest.MockedFunction<
  typeof getAuthenticatedUser
>;
const mockGetOrCreateCustomer = getOrCreateCustomer as jest.MockedFunction<typeof getOrCreateCustomer>;
const mockCreateCheckoutSession = createCheckoutSession as jest.MockedFunction<typeof createCheckoutSession>;

describe('POST /api/stripe/checkout', () => {
  let mockUser: any;
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' },
    };

    mockSupabase = {};

    mockGetAuthenticatedUser.mockResolvedValue({
      ok: true,
      user: mockUser,
      supabase: mockSupabase as any,
    });
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
    mockGetAuthenticatedUser.mockResolvedValue({
      ok: false,
      response: global.NextResponse.json(
        { error: 'Non autorizzato', success: false },
        { status: 401 }
      ),
    });

    const request = new global.NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan: 'STARTER' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Non autorizzato');
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
