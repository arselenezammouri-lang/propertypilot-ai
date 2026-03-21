import { NextResponse, type NextRequest } from 'next/server';
import { refreshSessionInMiddleware } from '@/lib/supabase/middleware-session-refresh';

const PROTECTED_ROUTES = ['/dashboard'];

export async function updateSession(request: NextRequest) {
  const { user, response } = await refreshSessionInMiddleware(request);

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
