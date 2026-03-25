/**
 * Validates public Supabase env before creating the browser client.
 * Fails fast with a clear message when .env.local is wrong (common cause of "Failed to fetch" on login).
 */

const SUPABASE_HOST_SUFFIX = '.supabase.co';

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

  if (!rawUrl || !anonKey) {
    throw new Error(
      '[PropertyPilot] Supabase non configurato: imposta NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (vedi .env.example).'
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(
      `[PropertyPilot] NEXT_PUBLIC_SUPABASE_URL non è un URL valido: "${rawUrl.slice(0, 80)}${rawUrl.length > 80 ? '…' : ''}"`
    );
  }

  const isLocalHost =
    parsed.hostname === 'localhost' ||
    parsed.hostname === '127.0.0.1' ||
    parsed.hostname.endsWith('.local');
  if (parsed.protocol !== 'https:' && !(isLocalHost && parsed.protocol === 'http:')) {
    throw new Error(
      '[PropertyPilot] NEXT_PUBLIC_SUPABASE_URL deve usare https:// (o http:// solo per localhost / 127.0.0.1 in sviluppo).'
    );
  }

  const host = parsed.hostname.toLowerCase();
  const isLocalSupabase =
    host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
  const allowCustom =
    process.env.NEXT_PUBLIC_SUPABASE_ALLOW_CUSTOM_HOST === 'true' ||
    process.env.NEXT_PUBLIC_SUPABASE_ALLOW_CUSTOM_HOST === '1';
  if (!isLocalSupabase && !host.endsWith(SUPABASE_HOST_SUFFIX) && !allowCustom) {
    throw new Error(
      `[PropertyPilot] L’host Supabase deve terminare con ${SUPABASE_HOST_SUFFIX} (host attuale: "${host}"). Self-hosted: imposta NEXT_PUBLIC_SUPABASE_ALLOW_CUSTOM_HOST=true in .env.local.`
    );
  }

  if (anonKey.length < 20) {
    throw new Error(
      '[PropertyPilot] NEXT_PUBLIC_SUPABASE_ANON_KEY sembra incompleta o errata (troppo corta). Verifica in Supabase → Settings → API.'
    );
  }

  return { url: rawUrl.replace(/\/$/, ''), anonKey };
}
