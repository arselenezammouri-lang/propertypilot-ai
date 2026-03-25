/**
 * @jest-environment node
 */
import {
  hashClientIpForAuditEdge,
  logSecurityAudit,
} from '@/lib/security/security-audit-log';

describe('security-audit-log', () => {
  const prevAudit = process.env.SECURITY_AUDIT_LOG;
  const prevSalt = process.env.SECURITY_AUDIT_IP_SALT;
  const prevNode = process.env.NODE_ENV;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    if (prevAudit === undefined) delete process.env.SECURITY_AUDIT_LOG;
    else process.env.SECURITY_AUDIT_LOG = prevAudit;
    if (prevSalt === undefined) delete process.env.SECURITY_AUDIT_IP_SALT;
    else process.env.SECURITY_AUDIT_IP_SALT = prevSalt;
    process.env.NODE_ENV = prevNode;
  });

  it('logSecurityAudit is a no-op when disabled', () => {
    process.env.SECURITY_AUDIT_LOG = 'false';
    process.env.NODE_ENV = 'production';
    logSecurityAudit({ action: 'edge_rate_limit', path: '/api/x', status: 429 });
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('logSecurityAudit writes JSON when enabled in production', () => {
    process.env.SECURITY_AUDIT_LOG = 'true';
    process.env.NODE_ENV = 'production';
    logSecurityAudit(
      { action: 'edge_bot_block', path: '/api/y', method: 'GET', status: 403, detail: 'empty_ua' },
      { origin: 'https://x.com' }
    );
    expect(logSpy).toHaveBeenCalled();
    const line = logSpy.mock.calls[0][0] as string;
    const obj = JSON.parse(line);
    expect(obj.type).toBe('security_audit');
    expect(obj.action).toBe('edge_bot_block');
    expect(obj.origin).toBe('https://x.com');
  });

  it('hashClientIpForAuditEdge returns stable prefix with salt', async () => {
    process.env.SECURITY_AUDIT_IP_SALT = 'test-salt';
    const a = await hashClientIpForAuditEdge('203.0.113.1');
    const b = await hashClientIpForAuditEdge('203.0.113.1');
    expect(a).toBe(b);
    expect(a?.length).toBe(16);
  });
});
