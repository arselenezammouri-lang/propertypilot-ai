#!/usr/bin/env node
/**
 * Pre-merge “founder” su macchina locale: carica .env + .env.local, poi
 * qa:launch, smoke pubblico, e billing E2E solo se E2E_FOUNDER_* o E2E_TEST_* sono valorizzati.
 *
 * Uso: npm run qa:premerge:local
 */

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: resolve(root, '.env') });
dotenv.config({ path: resolve(root, '.env.local'), override: true });

function hasBillingCreds() {
  const fe = process.env.E2E_FOUNDER_EMAIL?.trim();
  const fp = process.env.E2E_FOUNDER_PASSWORD?.trim();
  if (fe && fp) return true;
  const te = process.env.E2E_TEST_EMAIL?.trim();
  const tp = process.env.E2E_TEST_PASSWORD?.trim();
  return !!(te && tp);
}

function npmRun(script) {
  const r = spawnSync('npm', ['run', script], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });
  return r.status === null ? 1 : r.status;
}

let code = npmRun('qa:launch');
if (code !== 0) process.exit(code);

code = npmRun('smoke:public');
if (code !== 0) process.exit(code);

if (!hasBillingCreds()) {
  console.log(
    '\n[qa-premerge-local] Billing E2E skipped: set E2E_FOUNDER_EMAIL+E2E_FOUNDER_PASSWORD or E2E_TEST_EMAIL+E2E_TEST_PASSWORD in .env.local\n'
  );
  process.exit(0);
}

code = npmRun('test:e2e:billing');
process.exit(code);
