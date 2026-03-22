const {
  buildContentSecurityPolicyReportOnly,
} = require('../../../lib/security/content-security-policy.cjs');

describe('buildContentSecurityPolicyReportOnly', () => {
  it('includes unsafe-eval in dev', () => {
    const csp = buildContentSecurityPolicyReportOnly({ isDev: true });
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain('https://challenges.cloudflare.com');
    expect(csp).toContain('https://*.supabase.co');
    expect(csp).toContain('https://calendly.com');
  });

  it('omits unsafe-eval in production mode', () => {
    const csp = buildContentSecurityPolicyReportOnly({ isDev: false });
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).toContain('upgrade-insecure-requests');
  });

  it('appends report-uri when provided', () => {
    const csp = buildContentSecurityPolicyReportOnly({
      isDev: false,
      reportUri: 'https://example.com/csp-report',
    });
    expect(csp).toContain('report-uri https://example.com/csp-report');
  });
});
