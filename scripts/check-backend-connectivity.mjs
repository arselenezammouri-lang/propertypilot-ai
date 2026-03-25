#!/usr/bin/env node
/**
 * Verifies local backend + Supabase reachability before long-running dev/QA.
 * Loads .env then .env.local (same order as validate-env.js).
 *
 * Usage: node scripts/check-backend-connectivity.mjs
 * Env:   BACKEND_CHECK_URL — default http://127.0.0.1:3000 (override if dev on another port)
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(resolve(root, '.env'));
loadEnvFile(resolve(root, '.env.local'));

const base =
  process.env.BACKEND_CHECK_URL?.replace(/\/$/, '') ||
  process.env.PLAYWRIGHT_BASE_URL?.replace(/\/$/, '') ||
  'http://127.0.0.1:3000';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();

function fail(msg) {
  console.error(`\n[check-backend-connectivity] ${msg}\n`);
  process.exit(1);
}

async function main() {
  console.log('\n[check-backend-connectivity] Backend:', base);

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12_000);
    const healthRes = await fetch(`${base}/api/health`, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(t);

    if (!healthRes.ok) {
      const text = await healthRes.text().catch(() => '');
      fail(
        `GET /api/health returned ${healthRes.status}. Avvia il server: npm run dev\n${text.slice(0, 200)}`
      );
    }

    const body = await healthRes.json().catch(() => null);
    if (body?.checks?.supabase?.status !== 'ok') {
      const msg = body?.checks?.supabase?.message || 'unknown';
      fail(
        `Supabase check failed from server: ${msg}. Verifica NEXT_PUBLIC_SUPABASE_URL, chiavi e progetto attivo nel dashboard Supabase.`
      );
    }

    console.log('[check-backend-connectivity] OK: /api/health, Supabase raggiungibile dal server Node.');
  } catch (e) {
    if (e?.name === 'AbortError') {
      fail(
        `Timeout verso ${base}/api/health. Il server Next è avviato? Esegui: npm run dev (e riprova questo script in un altro terminale).`
      );
    }
    fail(
      `Impossibile contattare ${base}: ${e?.message || e}. Avvia npm run dev oppure imposta BACKEND_CHECK_URL / PLAYWRIGHT_BASE_URL.`
    );
  }

  if (supabaseUrl) {
    try {
      const u = new URL(supabaseUrl);
      if (u.protocol !== 'https:' || !u.hostname.endsWith('.supabase.co')) {
        console.warn(
          '[check-backend-connectivity] WARN: NEXT_PUBLIC_SUPABASE_URL dovrebbe essere https://….supabase.co'
        );
      } else {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 10_000);
        const probe = await fetch(supabaseUrl.replace(/\/$/, '') + '/', {
          method: 'GET',
          signal: ctrl.signal,
          redirect: 'follow',
        }).catch(() => null);
        clearTimeout(t);
        if (!probe) {
          console.warn(
            '[check-backend-connectivity] WARN: richiesta verso Supabase non riuscita (firewall/VPN?). Il browser potrebbe avere lo stesso problema.'
          );
        } else {
          console.log('[check-backend-connectivity] OK: host Supabase raggiungibile dalla tua rete.');
        }
      }
    } catch {
      console.warn('[check-backend-connectivity] WARN: NEXT_PUBLIC_SUPABASE_URL non è un URL valido.');
    }
  } else {
    console.warn('[check-backend-connectivity] WARN: NEXT_PUBLIC_SUPABASE_URL mancante.');
  }

  console.log('[check-backend-connectivity] Fatto.\n');
}

main();
