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

console.log('🔄 Testing Complete User Flow...\n');
console.log('='.repeat(60));

const results = {
  passed: [],
  failed: [],
  warnings: []
};

async function testCompleteFlow() {
  // Step 1: Create new user
  console.log('1️⃣ Testing Signup Flow...\n');
  
  const testEmail = `flow.test.${Date.now()}@propilot-ai.com`;
  const testPassword = 'TestFlow123!';
  const testName = 'Flow Test User';

  try {
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testName,
        },
      },
    });

    if (signupError) {
      results.failed.push({ test: 'Signup', error: signupError.message });
      console.log(`   ❌ Signup failed: ${signupError.message}`);
      return;
    }

    if (!signupData.user) {
      results.failed.push({ test: 'Signup', error: 'No user returned' });
      console.log('   ❌ Signup failed: No user returned');
      return;
    }

    results.passed.push({ test: 'Signup' });
    console.log(`   ✅ User created: ${signupData.user.id}`);
    console.log(`   ✅ Email: ${testEmail}`);

    // Step 2: Login
    console.log('\n2️⃣ Testing Login Flow...\n');
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (loginError || !loginData.session) {
      results.failed.push({ test: 'Login', error: loginError?.message || 'No session' });
      console.log(`   ❌ Login failed: ${loginError?.message || 'No session'}`);
      return;
    }

    results.passed.push({ test: 'Login' });
    console.log(`   ✅ Login successful`);
    console.log(`   ✅ Session active: ${!!loginData.session}`);

    // Step 3: Check profile
    console.log('\n3️⃣ Testing Profile Creation...\n');
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', loginData.user.id)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        results.warnings.push({ test: 'Profile creation', warning: 'Profile not created by trigger' });
        console.log('   ⚠️  Profile not found (trigger may not be set up)');
      } else {
        results.failed.push({ test: 'Profile access', error: profileError.message });
        console.log(`   ❌ Profile error: ${profileError.message}`);
      }
    } else {
      results.passed.push({ test: 'Profile access' });
      console.log(`   ✅ Profile found: ${profile.full_name || 'No name'}`);
    }

    // Step 4: Check subscription
    console.log('\n4️⃣ Testing Subscription Creation...\n');
    
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', loginData.user.id)
      .maybeSingle();

    if (subError) {
      if (subError.code === 'PGRST116') {
        results.warnings.push({ test: 'Subscription creation', warning: 'Subscription not created by trigger' });
        console.log('   ⚠️  Subscription not found (trigger may not be set up)');
      } else {
        results.failed.push({ test: 'Subscription access', error: subError.message });
        console.log(`   ❌ Subscription error: ${subError.message}`);
      }
    } else if (subscription) {
      results.passed.push({ test: 'Subscription access' });
      console.log(`   ✅ Subscription found: ${subscription.status}`);
    }

    // Step 5: Test API access
    console.log('\n5️⃣ Testing API Access...\n');
    
    // Test that user can access their own data
    const { data: ownProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', loginData.user.id)
      .single();

    if (ownProfile) {
      results.passed.push({ test: 'API access to own data' });
      console.log('   ✅ Can access own profile via API');
    } else {
      results.warnings.push({ test: 'API access', warning: 'Cannot access own profile' });
      console.log('   ⚠️  Cannot access own profile');
    }

    // Step 6: Test RLS (cannot access other users data)
    console.log('\n6️⃣ Testing Row Level Security...\n');
    
    const { data: otherUsers, error: rlsError } = await supabase
      .from('profiles')
      .select('id')
      .neq('id', loginData.user.id)
      .limit(1);

    if (rlsError) {
      results.passed.push({ test: 'RLS protection' });
      console.log(`   ✅ RLS working: ${rlsError.message}`);
    } else if (otherUsers && otherUsers.length > 0) {
      results.failed.push({ test: 'RLS protection', error: 'Can access other users data!' });
      console.log('   ❌ SECURITY ISSUE: Can access other users data!');
    } else {
      results.passed.push({ test: 'RLS protection' });
      console.log('   ✅ RLS working: Cannot access other users data');
    }

    console.log('\n✅ Complete Flow Test Finished!\n');

  } catch (error) {
    results.failed.push({ test: 'Complete flow', error: error.message });
    console.error('❌ Fatal error:', error);
  }
}

async function runTests() {
  await testCompleteFlow();

  // Print summary
  console.log('='.repeat(60));
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
}

runTests().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
