"use client";

import { useMemo } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type SupabaseBrowserInit = {
  client: SupabaseClient | null;
  /** Set when NEXT_PUBLIC_SUPABASE_* are missing or invalid (before any network call). */
  configError: string | null;
};

/**
 * Single init per mount: validates public Supabase env and creates the browser client once.
 * Avoids opaque "Failed to fetch" when URL/key are wrong.
 */
export function useSupabaseBrowserClient(): SupabaseBrowserInit {
  return useMemo(() => {
    try {
      return { client: createClient(), configError: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Supabase configuration error";
      return { client: null, configError: msg };
    }
  }, []);
}
