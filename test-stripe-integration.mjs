import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

console.log('💳 Testing Stripe Integration...\n');
console.log('='.repeat(60));

// Check Stripe configuration
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Test 1: Check environment variables
console.log('1️⃣ Checking Stripe Environment Variables...\n');

if (stripeSecretKey) {
  if (stripeSecretKey.startsWith('sk_test_')) {
    results.passed.push({ test: 'Stripe Secret Key (Test mode)' });
    console.log('   ✅ Stripe Secret Key: Test mode configured');
  } else if (stripeSecretKey.startsWith('sk_live_')) {
    results.passed.push({ test: 'Stripe Secret Key (Live mode)' });
    console.log('   ✅ Stripe Secret Key: LIVE mode configured');
  } else {
    results.failed.push({ test: 'Stripe Secret Key format', error: 'Invalid format' });
    console.log('   ❌ Stripe Secret Key: Invalid format');
  }
} else {
  results.warnings.push({ test: 'Stripe Secret Key', warning: 'Not configured' });
  console.log('   ⚠️  Stripe Secret Key: Not configured');
}

if (stripePublishableKey) {
  if (stripePublishableKey.startsWith('pk_test_')) {
    results.passed.push({ test: 'Stripe Publishable Key (Test mode)' });
    console.log('   ✅ Stripe Publishable Key: Test mode configured');
  } else if (stripePublishableKey.startsWith('pk_live_')) {
    results.passed.push({ test: 'Stripe Publishable Key (Live mode)' });
    console.log('   ✅ Stripe Publishable Key: LIVE mode configured');
  } else {
    results.failed.push({ test: 'Stripe Publishable Key format', error: 'Invalid format' });
    console.log('   ❌ Stripe Publishable Key: Invalid format');
  }
} else {
  results.warnings.push({ test: 'Stripe Publishable Key', warning: 'Not configured' });
  console.log('   ⚠️  Stripe Publishable Key: Not configured');
}

if (stripeWebhookSecret) {
  if (stripeWebhookSecret.startsWith('whsec_')) {
    results.passed.push({ test: 'Stripe Webhook Secret' });
    console.log('   ✅ Stripe Webhook Secret: Configured');
  } else {
    results.warnings.push({ test: 'Stripe Webhook Secret', warning: 'Unexpected format' });
    console.log('   ⚠️  Stripe Webhook Secret: Unexpected format');
  }
} else {
  results.warnings.push({ test: 'Stripe Webhook Secret', warning: 'Not configured (required for webhooks)' });
  console.log('   ⚠️  Stripe Webhook Secret: Not configured');
}

// Test 2: Check Price IDs
console.log('\n2️⃣ Checking Stripe Price IDs...\n');

const priceIds = {
  starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  agency: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID,
  boost: process.env.NEXT_PUBLIC_STRIPE_BOOST_PRICE_ID,
};

for (const [plan, priceId] of Object.entries(priceIds)) {
  if (priceId) {
    if (priceId.startsWith('price_')) {
      results.passed.push({ test: `Price ID ${plan}` });
      console.log(`   ✅ ${plan}: ${priceId.substring(0, 20)}...`);
    } else {
      results.failed.push({ test: `Price ID ${plan} format`, error: 'Invalid format' });
      console.log(`   ❌ ${plan}: Invalid format`);
    }
  } else {
    results.warnings.push({ test: `Price ID ${plan}`, warning: 'Not configured' });
    console.log(`   ⚠️  ${plan}: Not configured`);
  }
}

// Test 3: Check Stripe config file
console.log('\n3️⃣ Checking Stripe Config File...\n');

try {
  const fs = await import('fs');
  const configPath = join(__dirname, 'lib/stripe/config.ts');
  
  if (fs.existsSync(configPath)) {
    results.passed.push({ test: 'Stripe config file exists' });
    console.log('   ✅ Stripe config file found');
    
    const configContent = fs.readFileSync(configPath, 'utf-8');
    
    // Check for critical functions
    if (configContent.includes('getPlanByPriceId')) {
      results.passed.push({ test: 'getPlanByPriceId function' });
      console.log('   ✅ getPlanByPriceId function found');
    } else {
      results.failed.push({ test: 'getPlanByPriceId function', error: 'Not found' });
      console.log('   ❌ getPlanByPriceId function not found');
    }
    
    if (configContent.includes('STRIPE_PLANS')) {
      results.passed.push({ test: 'STRIPE_PLANS configuration' });
      console.log('   ✅ STRIPE_PLANS configuration found');
    } else {
      results.failed.push({ test: 'STRIPE_PLANS configuration', error: 'Not found' });
      console.log('   ❌ STRIPE_PLANS configuration not found');
    }
  } else {
    results.failed.push({ test: 'Stripe config file', error: 'File not found' });
    console.log('   ❌ Stripe config file not found');
  }
} catch (error) {
  results.failed.push({ test: 'Stripe config check', error: error.message });
  console.log(`   ❌ Error checking config: ${error.message}`);
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
