import { createClient } from '@supabase/supabase-js';

/**
 * Service Role Supabase client
 * 
 * This client bypasses Row Level Security (RLS) and should ONLY be used
 * for server-side operations that require elevated privileges:
 * - Rate limiting (reading/writing generation_logs)
 * - Generation counting (incrementing generations_count)
 * - Webhook processing (already has its own admin client)
 * 
 * ⚠️ NEVER expose this client to the frontend
 */

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service operations');
}

export const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
