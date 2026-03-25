import type { NextResponse } from 'next/server';

/** Copy Supabase auth cookies from session refresh response onto another response (e.g. 429 JSON). */
export function copySessionCookiesTo(from: NextResponse, to: NextResponse): void {
  for (const c of from.cookies.getAll()) {
    to.cookies.set(c.name, c.value, c);
  }
}
