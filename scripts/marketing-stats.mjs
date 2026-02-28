#!/usr/bin/env node
/**
 * MARKETING STATS - Conteggio immobili elite per post LinkedIn
 * Esegui: node scripts/marketing-stats.mjs
 * Richiede: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Configura .env.local con NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('\n📊 PropertyPilot AI - Marketing Stats (Elite Deals)\n');

  const { data: all, error: allErr } = await supabase
    .from('external_listings')
    .select('id, location', { count: 'exact' });

  if (allErr) {
    console.error('❌ Errore:', allErr.message);
    process.exit(1);
  }

  const miami = (all || []).filter((r) =>
    (r.location || '').toLowerCase().includes('miami')
  );
  const milano = (all || []).filter((r) =>
    (r.location || '').toLowerCase().includes('milano')
  );
  const total = all?.length ?? 0;

  console.log('📍 Miami:', miami.length);
  console.log('📍 Milano:', milano.length);
  console.log('📦 Totale Elite Deals:', total);
  console.log('\n💡 Per il post LinkedIn:');
  console.log(`   "${miami.length} immobili elite a Miami, ${milano.length} a Milano."`);
  console.log('\n');
}

main();
