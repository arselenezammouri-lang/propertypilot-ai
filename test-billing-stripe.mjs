import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

console.log('💳 Testing Billing & Stripe Integration...\n');
console.log('='.repeat(60));

const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Test 1: Stripe Configuration
console.log('1️⃣ Checking Stripe Configuration Files...\n');

const stripeFiles = [
  'lib/stripe/config.ts',
  'app/api/stripe/checkout/route.ts',
  'app/api/stripe/webhook/route.ts',
  'app/api/stripe/portal/route.ts',
  'app/api/stripe/cancel-subscription/route.ts',
  'app/api/stripe/upgrade/route.ts',
  'app/api/stripe/sync/route.ts',
];

for (const file of stripeFiles) {
  const filePath = join(__dirname, file);
  if (existsSync(filePath)) {
    results.passed.push({ test: `Stripe file: ${file}` });
    console.log(`   ✅ ${file}`);
  } else {
    results.failed.push({ test: `Stripe file: ${file}`, error: 'File not found' });
    console.log(`   ❌ ${file} - Not found`);
  }
}

// Test 2: Webhook Security
console.log('\n2️⃣ Checking Webhook Security...\n');

const webhookFile = join(__dirname, 'app/api/stripe/webhook/route.ts');
if (existsSync(webhookFile)) {
  const content = readFileSync(webhookFile, 'utf-8');
  
  // Check for webhook signature verification
  if (content.includes('stripe.webhooks.constructEvent') || content.includes('constructEvent')) {
    results.passed.push({ test: 'Webhook signature verification' });
    console.log('   ✅ Webhook signature verification found');
  } else {
    results.failed.push({ test: 'Webhook signature verification', error: 'Missing signature verification - SECURITY RISK!' });
    console.log('   ❌ Webhook signature verification missing - SECURITY RISK!');
  }

  // Check for critical event handlers
  const events = [
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
  ];

  for (const event of events) {
    if (content.includes(event)) {
      results.passed.push({ test: `Webhook handler: ${event}` });
      console.log(`   ✅ Handler for ${event} found`);
    } else {
      results.failed.push({ test: `Webhook handler: ${event}`, error: 'Missing handler' });
      console.log(`   ❌ Handler for ${event} missing`);
    }
  }
} else {
  results.failed.push({ test: 'Webhook file', error: 'File not found' });
  console.log('   ❌ Webhook file not found');
}

// Test 3: Checkout Security
console.log('\n3️⃣ Checking Checkout Security...\n');

const checkoutFile = join(__dirname, 'app/api/stripe/checkout/route.ts');
if (existsSync(checkoutFile)) {
  const content = readFileSync(checkoutFile, 'utf-8');
  
  // Check for authentication
  if (content.includes('getUser') || content.includes('createClient')) {
    results.passed.push({ test: 'Checkout authentication' });
    console.log('   ✅ Checkout has authentication check');
  } else {
    results.failed.push({ test: 'Checkout authentication', error: 'Missing authentication - SECURITY RISK!' });
    console.log('   ❌ Checkout missing authentication - SECURITY RISK!');
  }

  // Check for metadata with userId
  if (content.includes('metadata') && content.includes('userId')) {
    results.passed.push({ test: 'Checkout metadata with userId' });
    console.log('   ✅ Checkout includes userId in metadata');
  } else {
    results.warnings.push({ test: 'Checkout metadata', warning: 'May not include userId in metadata' });
    console.log('   ⚠️  Checkout may not include userId in metadata');
  }

  // Check for price validation
  if (content.includes('getPlanByPriceId') || content.includes('price_id')) {
    results.passed.push({ test: 'Checkout price validation' });
    console.log('   ✅ Checkout validates price_id');
  } else {
    results.warnings.push({ test: 'Checkout price validation', warning: 'May not validate price_id' });
    console.log('   ⚠️  Checkout may not validate price_id');
  }
}

// Test 4: Billing Page
console.log('\n4️⃣ Checking Billing Page...\n');

const billingPage = join(__dirname, 'app/dashboard/billing/page.tsx');
if (existsSync(billingPage)) {
  results.passed.push({ test: 'Billing page exists' });
  console.log('   ✅ Billing page found');
  
  const content = readFileSync(billingPage, 'utf-8');
  
  // Check for subscription display
  if (content.includes('subscription') || content.includes('plan')) {
    results.passed.push({ test: 'Billing page shows subscription' });
    console.log('   ✅ Billing page displays subscription info');
  }
  
  // Check for upgrade buttons
  if (content.includes('Upgrade') || content.includes('upgrade')) {
    results.passed.push({ test: 'Billing page has upgrade options' });
    console.log('   ✅ Billing page has upgrade options');
  }
} else {
  results.failed.push({ test: 'Billing page', error: 'File not found' });
  console.log('   ❌ Billing page not found');
}

// Test 5: Price Configuration
console.log('\n5️⃣ Checking Price Configuration...\n');

const configFile = join(__dirname, 'lib/stripe/config.ts');
if (existsSync(configFile)) {
  const content = readFileSync(configFile, 'utf-8');
  
  // Check for STRIPE_PLANS
  if (content.includes('STRIPE_PLANS')) {
    results.passed.push({ test: 'STRIPE_PLANS configuration' });
    console.log('   ✅ STRIPE_PLANS configuration found');
    
    // Check for all plans
    const plans = ['free', 'starter', 'pro', 'agency'];
    for (const plan of plans) {
      if (content.includes(`'${plan}'`) || content.includes(`"${plan}"`)) {
        results.passed.push({ test: `Plan ${plan} configured` });
        console.log(`   ✅ Plan ${plan} configured`);
      }
    }
  }
  
  // Check for getPlanByPriceId
  if (content.includes('getPlanByPriceId')) {
    results.passed.push({ test: 'getPlanByPriceId function' });
    console.log('   ✅ getPlanByPriceId function found');
  }
} else {
  results.failed.push({ test: 'Stripe config file', error: 'File not found' });
  console.log('   ❌ Stripe config file not found');
}

// Print summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 TEST SUMMARY:\n');
console.log(`✅ Passed: ${results.passed.length}`);
console.log(`❌ Failed: ${results.failed.length}`);
console.log(`⚠️  Warnings: ${results.warnings.length}`);
console.log(`📈 Total: ${results.passed.length + results.failed.length + results.warnings.length}\n`);

if (results.failed.length > 0) {
  console.log('❌ FAILED TESTS:\n');
  results.failed.forEach(({ test, error }) => {
    console.log(`  - ${test}: ${error}\n`);
  });
}

if (results.warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  results.warnings.forEach(({ test, warning }) => {
    console.log(`  - ${test}: ${warning}\n`);
  });
}

process.exit(results.failed.length > 0 ? 1 : 0);
