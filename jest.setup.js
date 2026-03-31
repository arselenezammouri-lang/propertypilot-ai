// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      maybeSingle: jest.fn(),
    })),
  })),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_123'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'
process.env.NODE_ENV = 'test'
process.env.OPENAI_API_KEY = 'sk-test-key-for-testing'

// Mock Next.js Request/Response
class MockNextRequest {
  constructor(url, init = {}) {
    this.url = typeof url === 'string' ? url : url.href || 'http://localhost:3000';
    this.method = init.method || 'GET';
    this.headers = new Headers(init.headers || {});
    this._body = init.body || null;
    this._json = null;
    this.nextUrl = {
      origin: 'http://localhost:3000',
      pathname: new URL(this.url).pathname,
      searchParams: new URLSearchParams(new URL(this.url).search),
    };
  }

  async json() {
    if (this._json) return this._json;
    if (!this._body) return {};
    if (typeof this._body === 'string') {
      this._json = JSON.parse(this._body);
    } else {
      this._json = this._body;
    }
    return this._json;
  }

  async text() {
    if (typeof this._body === 'string') return this._body;
    return JSON.stringify(this._body || '');
  }
}

class MockNextResponse {
  static json(data, init = {}) {
    return {
      status: init.status || 200,
      json: async () => data,
      ok: (init.status || 200) < 400,
    };
  }
}

// Make available globally
global.NextRequest = MockNextRequest;
global.NextResponse = MockNextResponse;