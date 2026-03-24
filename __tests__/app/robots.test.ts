import robots from '@/app/robots';
import { getBaseUrl } from '@/lib/env';

describe('robots.txt config', () => {
  it('disallows API, dashboard tree, and signout; points sitemap to base URL', () => {
    const r = robots();
    const disallow = r.rules?.[0]?.disallow;
    expect(Array.isArray(disallow)).toBe(true);
    expect(disallow).toContain('/api/');
    expect(disallow).toContain('/dashboard/');
    expect(disallow).toContain('/auth/signout');
    expect(disallow).toContain('/_next/');
    expect(disallow).toContain('/contact');
    expect(r.sitemap).toBe(`${getBaseUrl().replace(/\/$/, '')}/sitemap.xml`);
  });
});
