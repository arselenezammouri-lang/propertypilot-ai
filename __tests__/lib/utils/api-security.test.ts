/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  assertRequestBodyWithinLimit,
  getDefaultMaxApiBodyBytes,
  withApiSecurity,
} from '@/lib/utils/api-security';

describe('assertRequestBodyWithinLimit', () => {
  it('returns 413 when Content-Length exceeds max', async () => {
    const req = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      headers: { 'Content-Length': '2000000' },
      body: 'x',
    });
    const res = await assertRequestBodyWithinLimit(req, 1024);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(413);
  });

  it('allows when Content-Length is within max', async () => {
    const req = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      headers: { 'Content-Length': '10' },
      body: '0123456789',
    });
    const res = await assertRequestBodyWithinLimit(req, 1024);
    expect(res).toBeNull();
  });

});

describe('withApiSecurity', () => {
  it('returns 405 for disallowed method', async () => {
    const wrapped = withApiSecurity(
      async () => NextResponse.json({ ok: true }),
      { allowedMethods: ['POST'] }
    );
    const req = new NextRequest('http://localhost/x', { method: 'GET' });
    const res = await wrapped(req);
    expect(res.status).toBe(405);
  });
});

describe('getDefaultMaxApiBodyBytes', () => {
  const prev = process.env.API_MAX_BODY_BYTES;

  afterEach(() => {
    if (prev === undefined) delete process.env.API_MAX_BODY_BYTES;
    else process.env.API_MAX_BODY_BYTES = prev;
  });

  it('respects API_MAX_BODY_BYTES when valid', () => {
    process.env.API_MAX_BODY_BYTES = '2048';
    expect(getDefaultMaxApiBodyBytes()).toBe(2048);
  });
});
