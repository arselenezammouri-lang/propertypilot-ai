import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Service Role Supabase client — lazy singleton.
 * 
 * This client bypasses Row Level Security (RLS) and should ONLY be used
 * for server-side operations that require elevated privileges:
 * - Rate limiting (reading/writing generation_logs)
 * - Generation counting (incrementing generations_count)
 * - Webhook processing
 * 
 * ⚠️ NEVER expose this client to the frontend
 */

let _instance: SupabaseClient | null = null;

function getSupabaseService(): SupabaseClient {
  if (_instance) return _instance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
      'Set these in your Vercel environment variables.'
    );
  }

  _instance = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _instance;
}

/** Lazy-initialized service role client. Safe to import without env vars at build time. */
export const supabaseService = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseService() as any)[prop];
  },
});
