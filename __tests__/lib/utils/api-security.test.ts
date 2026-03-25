/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  assertOriginAllowed,
  assertRequestBodyWithinLimit,
  getDefaultMaxApiBodyBytes,
  getTrustedApiOrigins,
  mergeNoStoreHeaders,
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

  it('adds Cache-Control no-store on success JSON', async () => {
    const wrapped = withApiSecurity(async () => NextResponse.json({ ok: true }), {
      allowedMethods: ['POST'],
    });
    const req = new NextRequest('http://localhost/x', { method: 'POST', body: '{}' });
    const res = await wrapped(req);
    expect(res.headers.get('Cache-Control')).toContain('no-store');
  });
});

describe('getTrustedApiOrigins / assertOriginAllowed', () => {
  const prevNode = process.env.NODE_ENV;
  const prevStrict = process.env.API_STRICT_BROWSER_ORIGIN;
  const prevAllowed = process.env.API_ALLOWED_ORIGINS;
  const prevEmbed = process.env.API_EMBED_ALLOWED_ORIGINS;

  afterEach(() => {
    process.env.NODE_ENV = prevNode;
    if (prevStrict === undefined) delete process.env.API_STRICT_BROWSER_ORIGIN;
    else process.env.API_STRICT_BROWSER_ORIGIN = prevStrict;
    if (prevAllowed === undefined) delete process.env.API_ALLOWED_ORIGINS;
    else process.env.API_ALLOWED_ORIGINS = prevAllowed;
    if (prevEmbed === undefined) delete process.env.API_EMBED_ALLOWED_ORIGINS;
    else process.env.API_EMBED_ALLOWED_ORIGINS = prevEmbed;
  });

  it('getTrustedApiOrigins includes request origin and API_ALLOWED_ORIGINS', () => {
    process.env.API_ALLOWED_ORIGINS = 'https://staging.example.com, https://other.com/path';
    const req = new NextRequest('https://app.example.com/api/x');
    const set = getTrustedApiOrigins(req);
    expect(set.has('https://app.example.com')).toBe(true);
    expect(set.has('https://staging.example.com')).toBe(true);
    expect(set.has('https://other.com')).toBe(true);
  });

  it('assertOriginAllowed trusted rejects foreign origin in production when strict', () => {
    process.env.NODE_ENV = 'production';
    process.env.API_STRICT_BROWSER_ORIGIN = 'true';
    const req = new NextRequest('https://app.example.com/api/x', {
      method: 'POST',
      headers: { Origin: 'https://evil.com' },
    });
    expect(assertOriginAllowed(req, 'trusted')?.status).toBe(403);
  });

  it('assertOriginAllowed embed allows listed origin', () => {
    process.env.API_EMBED_ALLOWED_ORIGINS = 'https://partner-site.com';
    const req = new NextRequest('https://app.example.com/api/embed', {
      method: 'POST',
      headers: { Origin: 'https://partner-site.com' },
    });
    expect(assertOriginAllowed(req, 'embed')).toBeNull();
  });
});

describe('mergeNoStoreHeaders', () => {
  it('sets Cache-Control when missing', () => {
    const res = NextResponse.json({ a: 1 });
    mergeNoStoreHeaders(res);
    expect(res.headers.get('Cache-Control')).toContain('no-store');
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
