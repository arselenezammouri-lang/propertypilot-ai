/**
 * Centralized auth helper for API routes.
 * Use this (or apiWrapper) to avoid duplicating createClient + getUser + 401 logic.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isLocalMockModeEnabled } from '@/lib/utils/local-dev';
import { LOCAL_MOCK_USER_ID, getLocalMockPlan } from '@/lib/api/local-mock-service';

export type AuthenticatedUser = {
  user: User;
  supabase: SupabaseClient;
};

export type AuthResult =
  | { ok: true; user: User; supabase: SupabaseClient }
  | { ok: false; response: NextResponse };

/**
 * Returns the authenticated user and Supabase client, or a 401 NextResponse.
 * Use in API routes:
 *
 *   const auth = await getAuthenticatedUser();
 *   if (!auth.ok) return auth.response;
 *   const { user, supabase } = auth;
 */
export async function getAuthenticatedUser(): Promise<AuthResult> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    if (isLocalMockModeEnabled()) {
      const mockPlan = getLocalMockPlan();
      const mockUser = {
        id: LOCAL_MOCK_USER_ID,
        aud: 'authenticated',
        email: 'local-mock@propertypilot.local',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: { role: 'founder', source: 'local-mock', plan: mockPlan },
        created_at: new Date().toISOString(),
      } as User;

      return { ok: true, user: mockUser, supabase };
    }

    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Non autorizzato', success: false },
        { status: 401 }
      ),
    };
  }

  return { ok: true, user, supabase };
}
