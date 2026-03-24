import {
  buildRobotsMetadata,
  shouldBlockAllIndexing,
} from '@/lib/seo/build-robots';
import { getBaseUrl } from '@/lib/env';

describe('buildRobotsMetadata', () => {
  const saved: Record<string, string | undefined> = {};

  function saveEnv(key: string) {
    saved[key] = process.env[key];
  }

  function restoreEnv(key: string) {
    if (saved[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = saved[key];
    }
  }

  beforeEach(() => {
    saveEnv('NEXT_PUBLIC_BLOCK_SEARCH_INDEXING');
    saveEnv('VERCEL_ENV');
  });

  afterEach(() => {
    restoreEnv('NEXT_PUBLIC_BLOCK_SEARCH_INDEXING');
    restoreEnv('VERCEL_ENV');
  });

  it('production: disallow API, dashboard, signout, _next, contact; sitemap URL', () => {
    delete process.env.NEXT_PUBLIC_BLOCK_SEARCH_INDEXING;
    delete process.env.VERCEL_ENV;

    expect(shouldBlockAllIndexing()).toBe(false);
    const r = buildRobotsMetadata();
    const disallow = r.rules?.[0]?.disallow;
    expect(Array.isArray(disallow)).toBe(true);
    expect(disallow).toContain('/api/');
    expect(disallow).toContain('/dashboard/');
    expect(disallow).toContain('/auth/signout');
    expect(disallow).toContain('/_next/');
    expect(disallow).toContain('/contact');
    expect(r.sitemap).toBe(`${getBaseUrl().replace(/\/$/, '')}/sitemap.xml`);
  });

  it('blocks all indexing when NEXT_PUBLIC_BLOCK_SEARCH_INDEXING=true', () => {
    process.env.NEXT_PUBLIC_BLOCK_SEARCH_INDEXING = 'true';
    delete process.env.VERCEL_ENV;

    expect(shouldBlockAllIndexing()).toBe(true);
    const r = buildRobotsMetadata();
    expect(r.rules?.[0]?.disallow).toEqual(['/']);
    expect(r.sitemap).toBeUndefined();
  });

  it('blocks all indexing when VERCEL_ENV=preview', () => {
    delete process.env.NEXT_PUBLIC_BLOCK_SEARCH_INDEXING;
    process.env.VERCEL_ENV = 'preview';

    expect(shouldBlockAllIndexing()).toBe(true);
    const r = buildRobotsMetadata();
    expect(r.rules?.[0]?.disallow).toEqual(['/']);
    expect(r.sitemap).toBeUndefined();
  });
});
