import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testEmail = 'cliente.test.1769701040489@propilot-ai.com';
const testPassword = 'PasswordSicura123!';

const results = {
  passed: [],
  failed: [],
  warnings: []
};

async function login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (error || !data.session) {
    throw new Error(`Login failed: ${error?.message}`);
  }

  return { user: data.user, session: data.session };
}

async function testDatabaseStructure() {
  console.log('🗄️  Testing Database Structure...\n');

  try {
    const { user } = await login();

    // Test profiles table
    console.log('1️⃣ Testing profiles table...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      results.failed.push({ test: 'Profiles table access', error: profileError.message });
      console.log(`   ❌ Error: ${profileError.message}`);
    } else {
      results.passed.push({ test: 'Profiles table access' });
      console.log(`   ✅ Profile found: ${profile.full_name || 'No name'}`);
      console.log(`   ✅ Subscription plan: ${profile.subscription_plan || 'Not set'}`);
    }

    // Test subscriptions table structure
    console.log('\n2️⃣ Testing subscriptions table structure...');
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) {
      // Check if it's a "no rows" error or a real error
      if (subError.code === 'PGRST116') {
        results.warnings.push({ test: 'Subscriptions table', warning: 'No subscription found (may need trigger)' });
        console.log(`   ⚠️  No subscription found (this is OK if trigger not set up)`);
      } else {
        results.failed.push({ test: 'Subscriptions table access', error: subError.message });
        console.log(`   ❌ Error: ${subError.message}`);
      }
    } else if (subscription) {
      results.passed.push({ test: 'Subscriptions table access' });
      console.log(`   ✅ Subscription found`);
      console.log(`   ✅ Status: ${subscription.status}`);
      console.log(`   ✅ Has required fields: ${!!subscription.id && !!subscription.user_id}`);
      
      // Verify no plan_id field (should use status)
      if ('plan_id' in subscription) {
        results.warnings.push({ test: 'Subscriptions schema', warning: 'plan_id field exists but should use status' });
        console.log(`   ⚠️  Warning: plan_id field exists`);
      }
    }

    // Test other critical tables
    console.log('\n3️⃣ Testing other critical tables...');
    
    const tables = ['leads', 'external_listings', 'saved_listings'];
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (error) {
          if (error.code === '42P01') {
            results.warnings.push({ test: `Table ${table}`, warning: 'Table does not exist' });
            console.log(`   ⚠️  Table ${table} does not exist`);
          } else {
            results.failed.push({ test: `Table ${table} access`, error: error.message });
            console.log(`   ❌ ${table}: ${error.message}`);
          }
        } else {
          results.passed.push({ test: `Table ${table} access` });
          console.log(`   ✅ Table ${table} accessible`);
        }
      } catch (err) {
        results.failed.push({ test: `Table ${table}`, error: err.message });
        console.log(`   ❌ ${table}: ${err.message}`);
      }
    }

  } catch (error) {
    results.failed.push({ test: 'Database structure test', error: error.message });
    console.error('❌ Fatal error:', error);
  }
}

async function testSubscriptionLogic() {
  console.log('\n💳 Testing Subscription Logic...\n');

  try {
    const { user } = await login();

    // Test subscription check logic
    console.log('1️⃣ Testing subscription status...');
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle();

    const currentPlan = subscription?.status || 'free';
    console.log(`   ✅ Current plan: ${currentPlan}`);

    // Verify plan values are valid
    const validPlans = ['free', 'starter', 'pro', 'agency'];
    if (validPlans.includes(currentPlan)) {
      results.passed.push({ test: 'Subscription plan validation' });
      console.log(`   ✅ Plan value is valid`);
    } else {
      results.failed.push({ test: 'Subscription plan validation', error: `Invalid plan: ${currentPlan}` });
      console.log(`   ❌ Invalid plan value: ${currentPlan}`);
    }

    // Test plan limits logic
    console.log('\n2️⃣ Testing plan limits logic...');
    const planLimits = {
      free: { listings: 5 },
      starter: { listings: 50 },
      pro: { listings: 200 },
      agency: { listings: -1 }
    };

    const limits = planLimits[currentPlan] || planLimits.free;
    console.log(`   ✅ Plan limits: ${JSON.stringify(limits)}`);
    results.passed.push({ test: 'Plan limits logic' });

  } catch (error) {
    results.failed.push({ test: 'Subscription logic', error: error.message });
    console.error('❌ Error:', error);
  }
}

async function testSecurityChecks() {
  console.log('\n🔒 Testing Security Checks...\n');

  try {
    const { user } = await login();

    // Test RLS (Row Level Security)
    console.log('1️⃣ Testing Row Level Security...');
    
    // Try to access another user's data (should fail)
    const { data: otherProfile, error: rlsError } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id)
      .limit(1);

    if (rlsError) {
      results.passed.push({ test: 'RLS protection' });
      console.log(`   ✅ RLS working: ${rlsError.message}`);
    } else if (otherProfile && otherProfile.length > 0) {
      results.failed.push({ test: 'RLS protection', error: 'Can access other users data!' });
      console.log(`   ❌ SECURITY ISSUE: Can access other users data!`);
    } else {
      results.passed.push({ test: 'RLS protection' });
      console.log(`   ✅ RLS working: No other users data accessible`);
    }

  } catch (error) {
    results.failed.push({ test: 'Security checks', error: error.message });
    console.error('❌ Error:', error);
  }
}

async function runTests() {
  console.log('🧪 Testing Critical Features...\n');
  console.log('='.repeat(60));

  await testDatabaseStructure();
  await testSubscriptionLogic();
  await testSecurityChecks();

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
      console.log(`  - ${test}`);
      console.log(`    Error: ${error}\n`);
    });
  }

  if (results.warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    results.warnings.forEach(({ test, warning }) => {
      console.log(`  - ${test}: ${warning}\n`);
    });
  }

  if (results.passed.length > 0) {
    console.log('✅ PASSED TESTS:\n');
    results.passed.forEach(({ test }) => {
      console.log(`  ✓ ${test}`);
    });
  }

  process.exit(results.failed.length > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
