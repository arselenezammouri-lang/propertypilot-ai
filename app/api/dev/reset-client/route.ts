import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Solo development: invia Clear-Site-Data (cache + storage) e reindirizza.
 * Utile quando un Service Worker vecchio blocca la UI "Sei Offline".
 * In production risponde 404.
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const nextPath = request.nextUrl.searchParams.get('next') || '/';
  const target = new URL(nextPath.startsWith('/') ? nextPath : `/${nextPath}`, request.url);
  const res = NextResponse.redirect(target, 302);
  res.headers.set('Clear-Site-Data', '"cache", "storage"');
  return res;
}
