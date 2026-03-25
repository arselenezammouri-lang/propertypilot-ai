/**
 * Environment Variables Validation Script
 * Run before build/deploy to ensure required vars are set.
 * Usage: node scripts/validate-env.js [options]
 *   --strict   Fail if any optional var is missing (production deploy)
 *   --no-fail  Report only, never exit 1 (useful for local dev)
 */

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const envLocal = path.join(cwd, '.env.local');
const envExample = path.join(cwd, '.env.example');

// Load .env.local then .env (dotenv-style parsing)
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed) return;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) return;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  });
}

loadEnvFile(envLocal);
loadEnvFile(path.join(cwd, '.env'));

const noFail = process.argv.includes('--no-fail');

const REQUIRED = [
  { key: 'NEXT_PUBLIC_SUPABASE_URL', desc: 'Supabase project URL' },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', desc: 'Supabase anonymous key' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', desc: 'Supabase service role (server-side)' },
  { key: 'NEXT_PUBLIC_APP_URL', desc: 'App public URL (e.g. https://propertypilot-ai.vercel.app)' },
];

const REQUIRED_FOR_PAYMENTS = [
  { key: 'STRIPE_SECRET_KEY', desc: 'Stripe secret key' },
  { key: 'STRIPE_WEBHOOK_SECRET', desc: 'Stripe webhook signing secret' },
  { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', desc: 'Stripe publishable key' },
];

const REQUIRED_FOR_EMAIL = [
  { key: 'RESEND_API_KEY', desc: 'Resend API key for transactional emails' },
  { key: 'RESEND_FROM_EMAIL', desc: 'Resend verified sender email' },
];

const REQUIRED_FOR_AI = [
  { key: 'OPENAI_API_KEY', desc: 'OpenAI API key for listings generation' },
];

/** Supabase JWT (anon / service_role): three base64url segments — avoid false positives from `your-` inside payload. */
function looksLikeJwt(val) {
  const parts = val.split('.');
  return (
    parts.length === 3 &&
    parts.every((p) => p.length > 10) &&
    val.startsWith('eyJ')
  );
}

function isPlaceholder(val) {
  if (!val || val.length < 5) return true;
  if (looksLikeJwt(val)) return false;
  return (
    /^(sk-)?xxxxx|your-supabase|re_xxxxx/i.test(val) ||
    val.includes('tudominio') ||
    /^eyJ.*\.\.\.$/.test(val)
  );
}

function checkVars(vars, groupName) {
  const missing = [];
  const placeholders = [];
  vars.forEach(({ key, desc }) => {
    const val = process.env[key];
    if (!val) missing.push({ key, desc });
    else if (isPlaceholder(val)) placeholders.push({ key });
  });
  return { missing, placeholders };
}

let hasErrors = false;
const isStrict = process.argv.includes('--strict');

console.log('\n🔐 Environment Variables Validation - PropertyPilot AI\n');

if (!fs.existsSync(envLocal)) {
  console.log('⚠️  .env.local non trovato.');
  if (fs.existsSync(envExample)) {
    console.log('   Crea il file: cp .env.example .env.local');
    console.log('   Poi modifica .env.local con le tue chiavi reali.\n');
  }
}

// Required (always)
const req1 = checkVars(REQUIRED, 'Core');
if (req1.missing.length > 0) {
  hasErrors = true;
  req1.missing.forEach(({ key, desc }) => console.log(`❌ Missing: ${key} (${desc})`));
}
if (req1.placeholders.length > 0) {
  req1.placeholders.forEach(({ key }) => console.log(`⚠️  Placeholder: ${key} - replace with real value`));
}
if (req1.missing.length === 0 && req1.placeholders.length === 0) {
  console.log('✅ Core vars (Supabase, APP_URL)');
}

// Payments
const req2 = checkVars(REQUIRED_FOR_PAYMENTS, 'Payments');
if (req2.missing.length > 0) {
  console.log('\n⚠️  Payments: missing Stripe vars - checkout will not work');
  req2.missing.forEach(({ key }) => console.log(`   - ${key}`));
}
if (req2.missing.length === 0 && req2.placeholders.length === 0) {
  console.log('✅ Stripe/payments');
}

// Email
const req3 = checkVars(REQUIRED_FOR_EMAIL, 'Email');
if (req3.missing.length > 0) {
  console.log('\n⚠️  Email: missing Resend vars - contact form will fail');
  req3.missing.forEach(({ key }) => console.log(`   - ${key}`));
}
if (req3.missing.length === 0 && req3.placeholders.length === 0) {
  console.log('✅ Resend/email');
}

// AI
const req4 = checkVars(REQUIRED_FOR_AI, 'AI');
if (req4.missing.length > 0) {
  console.log('\n⚠️  AI: missing OpenAI key - listing generation will fail');
}
if (req4.missing.length === 0 && req4.placeholders.length === 0) {
  console.log('✅ OpenAI');
}

// Stripe Price IDs (optional but recommended – checkout fails without them)
const STRIPE_PRICE_IDS = [
  'NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_PRO_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID',
  'NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID',
];
const missingPriceIds = STRIPE_PRICE_IDS.filter(key => !process.env[key] || isPlaceholder(process.env[key]));
if (missingPriceIds.length > 0) {
  console.log('\n⚠️  Stripe Price IDs: missing or placeholder – checkout may not work');
  missingPriceIds.forEach(key => console.log(`   - ${key}`));
} else {
  console.log('✅ Stripe Price IDs (Starter, Pro, Agency, Agency Boost)');
}

// Optional but recommended
const optional = ['CONTACT_EMAIL', 'ADMIN_FORCE_LOGIN_SECRET', 'GOOGLE_CLIENT_ID'];
optional.forEach(key => {
  const val = process.env[key];
  if (!val && isStrict) {
    console.log(`⚠️  Optional: ${key} not set`);
  }
});

console.log('');
if (hasErrors) {
  console.log('❌ Validation failed. Set missing vars in .env.local and retry.');
  console.log('   In locale: le variabili sono iniettate da Vercel/CI al deploy.');
  console.log('   Per build locale: copia .env.example → .env.local e compila.\n');
  process.exit(noFail ? 0 : 1);
}
console.log('✅ All required vars present. Ready for build.\n');
