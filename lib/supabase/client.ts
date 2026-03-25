import { createBrowserClient } from '@supabase/ssr';
import { getSupabasePublicConfig } from '@/lib/supabase/browser-config';

export function createClient() {
  const { url, anonKey } = getSupabasePublicConfig();
  return createBrowserClient(url, anonKey);
}
