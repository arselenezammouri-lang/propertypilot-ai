import { POST } from '@/app/api/auth/setup-user/route';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';
import { getResendClient } from '@/lib/resend-client';
import { emailTemplates } from '@/lib/email-templates';

// Mock Next.js server
jest.mock('next/server', () => ({
  NextRequest: global.NextRequest,
  NextResponse: global.NextResponse,
}));

// Mock Resend first to avoid initialization errors
jest.mock('resend', () => {
  return jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'email-123' }),
    },
  }));
});

// Mock dependencies
jest.mock('@/lib/supabase/server');
jest.mock('@/lib/supabase/service');
jest.mock('@/lib/resend-client');
jest.mock('@/lib/email-templates');
jest.mock('@/lib/utils/safe-logger', () => ({
  logger: {
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockSupabaseService = supabaseService as any;
const mockGetResendClient = getResendClient as jest.MockedFunction<typeof getResendClient>;
const mockEmailTemplates = emailTemplates as jest.Mocked<typeof emailTemplates>;

describe('POST /api/auth/setup-user', () => {
  let mockSupabase: any;
  let mockUser: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User',
      },
    };

    mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    };

    mockCreateClient.mockResolvedValue(mockSupabase as any);

    // Mock Supabase Service
    mockSupabaseService.from = jest.fn().mockReturnThis();
    mockSupabaseService.select = jest.fn().mockReturnThis();
    mockSupabaseService.insert = jest.fn().mockReturnThis();
    mockSupabaseService.eq = jest.fn().mockReturnThis();
    mockSupabaseService.maybeSingle = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });

    // Mock Resend
    mockGetResendClient.mockResolvedValue({
      client: {
        emails: {
          send: jest.fn().mockResolvedValue({ id: 'email-123' }),
        },
      },
      fromEmail: 'noreply@propilot-ai.com',
    } as any);

    // Mock Email Templates
    mockEmailTemplates.welcome = jest.fn().mockReturnValue({
      subject: 'Welcome to PropertyPilot AI',
      html: '<html>Welcome</html>',
    });
  });

  it('should create profile and subscription for new user', async () => {
    const request = new global.NextRequest('http://localhost:3000/api/auth/setup-user', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Test User' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('User setup completed');

    // Verify profile creation
    expect(mockSupabaseService.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user-123',
        full_name: 'Test User',
      })
    );

    // Verify subscription creation
    expect(mockSupabaseService.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        status: 'free',
      })
    );
  });

  it('should return 401 if user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authenticated' },
    });

    const request = new global.NextRequest('http://localhost:3000/api/auth/setup-user', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Test User' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
    expect(data.message).toContain('Session not found');
  });

  it('should retry user fetch if first attempt fails', async () => {
    let callCount = 0;
    mockSupabase.auth.getUser.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          data: { user: null },
          error: { message: 'Cookie not synced' },
        });
      }
      return Promise.resolve({
        data: { user: mockUser },
        error: null,
      });
    });

    const request = new global.NextRequest('http://localhost:3000/api/auth/setup-user', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Test User' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(2);
  });

  it('should not create duplicate profile if already exists', async () => {
    mockSupabaseService.maybeSingle.mockResolvedValueOnce({
      data: { id: 'user-123' },
      error: null,
    });

    const request = new global.NextRequest('http://localhost:3000/api/auth/setup-user', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Test User' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // Profile insert should not be called
    const insertCalls = mockSupabaseService.insert.mock.calls;
    const profileInsert = insertCalls.find(call => 
      call[0]?.id === 'user-123'
    );
    expect(profileInsert).toBeUndefined();
  });

  it('should not create duplicate subscription if already exists', async () => {
    mockSupabaseService.maybeSingle
      .mockResolvedValueOnce({ data: null, error: null }) // Profile doesn't exist
      .mockResolvedValueOnce({ data: { id: 'sub-123' }, error: null }); // Subscription exists

    const request = new global.NextRequest('http://localhost:3000/api/auth/setup-user', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Test User' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // Subscription insert should not be called
    const insertCalls = mockSupabaseService.insert.mock.calls;
    const subscriptionInsert = insertCalls.find(call => 
      call[0]?.status === 'free'
    );
    expect(subscriptionInsert).toBeUndefined();
  });

  it('should send welcome email for new users', async () => {
    const request = new global.NextRequest('http://localhost:3000/api/auth/setup-user', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Test User' }),
    });

    await POST(request);

    expect(mockEmailTemplates.welcome).toHaveBeenCalledWith('Test User');
    expect(mockGetResendClient).toHaveBeenCalled();
    
    const resendClient = await mockGetResendClient();
    expect(resendClient.client.emails.send).toHaveBeenCalledWith({
      from: 'noreply@propilot-ai.com',
      to: 'test@example.com',
      subject: 'Welcome to PropertyPilot AI',
      html: '<html>Welcome</html>',
    });
  });

  it('should use email prefix if fullName is not provided', async () => {
    const request = new global.NextRequest('http://localhost:3000/api/auth/setup-user', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    await POST(request);

    // Should use email prefix 'test' from test@example.com
    expect(mockEmailTemplates.welcome).toHaveBeenCalled();
  });

  it('should handle missing request body gracefully', async () => {
    const request = new global.NextRequest('http://localhost:3000/api/auth/setup-user', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should return 500 on internal error', async () => {
    mockSupabaseService.insert.mockRejectedValue(new Error('Database error'));

    const request = new global.NextRequest('http://localhost:3000/api/auth/setup-user', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'Test User' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
