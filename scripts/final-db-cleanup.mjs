#!/usr/bin/env node
/**
 * TABULA RASA — Final DB cleanup before commercial launch.
 * Deletes ALL records from: external_listings, leads, communication_logs,
 * automations_logs, automations_assignments (FK order respected).
 * Does NOT delete: profiles, subscriptions, listings (saved AI listings), automations_rules.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function deleteAllFrom(table) {
  const { data, error } = await supabase.from(table).select('id').limit(1);
  if (error && error.code !== 'PGRST116') {
    console.warn(`  ⚠️ ${table}: ${error.message} (skipping)`);
    return { deleted: 0, skipped: true };
  }
  // Supabase doesn't support DELETE without a filter; we need to delete in chunks by selecting ids
  let total = 0;
  const pageSize = 500;
  for (;;) {
    const { data: rows, error: selectErr } = await supabase
      .from(table)
      .select('id')
      .range(0, pageSize - 1);
    if (selectErr) {
      console.warn(`  ⚠️ ${table} select: ${selectErr.message}`);
      break;
    }
    if (!rows || rows.length === 0) break;
    const ids = rows.map((r) => r.id);
    const { error: deleteErr } = await supabase.from(table).delete().in('id', ids);
    if (deleteErr) {
      console.warn(`  ⚠️ ${table} delete: ${deleteErr.message}`);
      break;
    }
    total += rows.length;
    if (rows.length < pageSize) break;
  }
  return { deleted: total, skipped: false };
}

async function run() {
  console.log('🧹 TABULA RASA — Final DB cleanup\n');

  // Order: respect FKs — child tables first, then leads, then external_listings
  const tables = [
    'communication_logs',
    'automations_logs',
    'automations_assignments',
    'lead_notes',
    'lead_status_history',
    'leads',
    'external_listings',
  ];

  for (const table of tables) {
    process.stdout.write(`  ${table}... `);
    const { deleted, skipped } = await deleteAllFrom(table);
    if (skipped) console.log('skip');
    else console.log(deleted === 0 ? '0 (already empty)' : `deleted ${deleted}`);
  }

  // Optional: automation_logs (alternate table name in some code paths)
  process.stdout.write('  automation_logs... ');
  const r = await deleteAllFrom('automation_logs');
  if (r.skipped) console.log('skip (table may not exist)');
  else console.log(r.deleted === 0 ? '0 (already empty)' : `deleted ${r.deleted}`);

  console.log('\n✅ TABULA RASA complete. Database is empty; dashboard will show "Nessun annuncio trovato" / empty states.');
}

run().catch((err) => {
  console.error('❌ Cleanup failed:', err);
  process.exit(1);
});
