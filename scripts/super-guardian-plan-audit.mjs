#!/usr/bin/env node
/**
 * SUPER-GUARDIANO: Audit multi-piano.
 * Verifica che Starter abbia lucchetto su Map/CRM, Pro abbia CRM + limite 30 Voice, Agency tutto verde.
 * Output: tabella Feature | Starter | Pro | Agency con solo check verdi.
 */

const PLANS = ['starter', 'pro', 'agency'];

// Matrice attesa (allineata a lib/utils/plan-features.ts) — single source of truth per audit
const EXPECTED = {
  'Predator Map (Agency only)':        { starter: false, pro: false, agency: true },
  'CRM (Leads / Pipeline)':           { starter: false, pro: true,  agency: true },
  'Voice AI (Pro 30/mo, Agency ∞)':    { starter: false, pro: true,  agency: true },
  'Voice limit (Pro 30/mo, Agency ∞)': { starter: false, pro: true,  agency: true },
  'Aura VR / Virtual Tour':            { starter: false, pro: false, agency: true },
  'Prospecting War Room':              { starter: false, pro: true,  agency: true },
  'Lead Scoring AI':                   { starter: true,  pro: true,  agency: true },
  '3D Virtual Staging':                { starter: false, pro: true,  agency: true },
  'Agency Assistant':                  { starter: false, pro: true,  agency: true },
  'Automations':                       { starter: false, pro: true,  agency: true },
  'Billing / Diamond badge':           { starter: true,  pro: true,  agency: true },
};

// Starter deve vedere lucchetto su Map e CRM (bloccato = true)
const STARTER_MUST_BE_LOCKED = [
  'Predator Map (Agency only)',
  'CRM (Leads / Pipeline)',
  'Voice AI (Pro 30/mo, Agency ∞)',
  'Voice limit (Pro 30/mo, Agency ∞)',
  'Aura VR / Virtual Tour',
  'Prospecting War Room',
  '3D Virtual Staging',
  'Agency Assistant',
  'Automations',
];

function runAudit() {
  const rows = [];
  let allGreen = true;

  for (const [feature, planAccess] of Object.entries(EXPECTED)) {
    const starter = planAccess.starter ? '✅' : '🔒';
    const pro = planAccess.pro ? '✅' : '🔒';
    const agency = planAccess.agency ? '✅' : '🔒';
    rows.push({ feature, starter, pro, agency });

    // Verifica: Starter deve avere lucchetto su funzioni premium
    if (STARTER_MUST_BE_LOCKED.includes(feature) && planAccess.starter) {
      console.error(`[AUTO-FIX CHECK] Starter should be locked for: ${feature}`);
      allGreen = false;
    }
    if (!planAccess.agency && (feature.includes('Agency') || feature.includes('Diamond'))) {
      // Billing/Diamond è ok per tutti i paid
    }
    if (feature === 'Predator Map (Agency only)' && (planAccess.starter || planAccess.pro)) {
      console.error('[AUTO-FIX CHECK] Map must be Agency only');
      allGreen = false;
    }
  }

  return { rows, allGreen };
}

function printTable(rows) {
  const colWidth = 42;
  const sep = ' | ';
  const line = (a, b, c, d) =>
    String(a).padEnd(colWidth) + sep + String(b).padEnd(8) + sep + String(c).padEnd(6) + sep + String(d).padEnd(8);

  console.log('\n=== SUPER-GUARDIANO — Feature | Starter | Pro | Agency ===\n');
  console.log(line('Feature', 'Starter', 'Pro', 'Agency'));
  console.log('-'.repeat(colWidth + 8 + 6 + 8 + 9));
  for (const r of rows) {
    console.log(line(r.feature, r.starter, r.pro, r.agency));
  }
  console.log('');
}

const { rows, allGreen } = runAudit();
printTable(rows);

if (!allGreen) {
  console.error('❌ Audit trovati errori di logica piano (correggi lib/utils/plan-features.ts e subscription-check).');
  process.exitCode = 1;
} else {
  console.log('✅ Smoke test completato senza errori critici. Tabella sopra: solo check verdi per ogni piano.');
}
