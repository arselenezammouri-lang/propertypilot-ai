import { getSupabasePublicConfig } from '@/lib/supabase/browser-config';

describe('getSupabasePublicConfig', () => {
  const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const prevKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  afterEach(() => {
    if (prevUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
    if (prevKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = prevKey;
  });

  it('accepts valid cloud URL and strips trailing slash', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abcxyz.supabase.co/';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.test';
    const c = getSupabasePublicConfig();
    expect(c.url).toBe('https://abcxyz.supabase.co');
    expect(c.anonKey).toContain('eyJ');
  });

  it('throws when URL missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'x'.repeat(30);
    expect(() => getSupabasePublicConfig()).toThrow(/Supabase non configurato/);
  });

  it('throws when host is not supabase.co', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://evil.example.com';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'x'.repeat(30);
    expect(() => getSupabasePublicConfig()).toThrow(/supabase\.co/);
  });
});
