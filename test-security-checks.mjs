import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

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

async function testProFeatureProtection() {
  console.log('🔒 Testing PRO Feature Protection...\n');

  try {
    const { user } = await login();

    // Check if user has free plan
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle();

    const currentPlan = subscription?.status || 'free';
    console.log(`   Current plan: ${currentPlan}`);

    // Test files that should check for PRO subscription
    const proProtectedFiles = [
      'app/api/lead-score/route.ts',
      'app/api/prospecting/call/route.ts',
      'app/api/prospecting/virtual-staging/route.ts',
    ];

    for (const file of proProtectedFiles) {
      const filePath = join(__dirname, file);
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf-8');
        
        if (content.includes('requireProOrAgencySubscription')) {
          results.passed.push({ test: `PRO protection in ${file}` });
          console.log(`   ✅ ${file} - Has PRO protection`);
        } else {
          results.failed.push({ test: `PRO protection in ${file}`, error: 'Missing requireProOrAgencySubscription check' });
          console.log(`   ❌ ${file} - Missing PRO protection!`);
        }
      }
    }

  } catch (error) {
    results.failed.push({ test: 'PRO feature protection', error: error.message });
    console.error('❌ Error:', error);
  }
}

async function testRateLimiting() {
  console.log('\n⏱️  Testing Rate Limiting Implementation...\n');

  const rateLimitFile = join(__dirname, 'lib/utils/rate-limit.ts');
  if (existsSync(rateLimitFile)) {
    const content = readFileSync(rateLimitFile, 'utf-8');
    
    // Check for rate limiting functions
    const checks = [
      { name: 'checkUserRateLimit', required: true },
      { name: 'checkIpRateLimit', required: true },
      { name: 'logGeneration', required: true },
      { name: 'incrementGenerationCount', required: true },
    ];

    for (const check of checks) {
      if (content.includes(check.name)) {
        results.passed.push({ test: `Rate limit function: ${check.name}` });
        console.log(`   ✅ ${check.name} found`);
      } else if (check.required) {
        results.failed.push({ test: `Rate limit function: ${check.name}`, error: 'Not found' });
        console.log(`   ❌ ${check.name} not found`);
      }
    }
  } else {
    results.failed.push({ test: 'Rate limiting file', error: 'File not found' });
    console.log('   ❌ Rate limiting file not found');
  }
}

async function testApiSecurity() {
  console.log('\n🛡️  Testing API Security...\n');

  const apiFiles = [
    'app/api/generate/route.ts',
    'app/api/generate-perfect-copy/route.ts',
    'app/api/lead-score/route.ts',
  ];

  for (const file of apiFiles) {
    const filePath = join(__dirname, file);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      
      // Check for authentication
      if (content.includes('getUser') || content.includes('createClient')) {
        results.passed.push({ test: `Auth check in ${file}` });
        console.log(`   ✅ ${file} - Has auth check`);
      } else {
        results.failed.push({ test: `Auth check in ${file}`, error: 'Missing authentication' });
        console.log(`   ❌ ${file} - Missing auth check!`);
      }

      // Check for error handling
      if (content.includes('try') && content.includes('catch')) {
        results.passed.push({ test: `Error handling in ${file}` });
        console.log(`   ✅ ${file} - Has error handling`);
      } else {
        results.warnings.push({ test: `Error handling in ${file}`, warning: 'May be missing error handling' });
        console.log(`   ⚠️  ${file} - May be missing error handling`);
      }
    }
  }
}

async function testEnvironmentSecurity() {
  console.log('\n🔐 Testing Environment Security...\n');

  // Check for exposed secrets
  const envFile = join(__dirname, '.env.local');
  if (existsSync(envFile)) {
    const content = readFileSync(envFile, 'utf-8');
    
    // Check if service role key is present (should be)
    if (content.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      results.passed.push({ test: 'Service role key configured' });
      console.log('   ✅ Service role key configured');
    } else {
      results.warnings.push({ test: 'Service role key', warning: 'Not found in .env.local' });
      console.log('   ⚠️  Service role key not found');
    }

    // Check if .env.local is in .gitignore
    const gitignore = join(__dirname, '.gitignore');
    if (existsSync(gitignore)) {
      const gitignoreContent = readFileSync(gitignore, 'utf-8');
      if (gitignoreContent.includes('.env.local') || gitignoreContent.includes('.env')) {
        results.passed.push({ test: '.env.local in .gitignore' });
        console.log('   ✅ .env.local is in .gitignore');
      } else {
        results.failed.push({ test: '.env.local in .gitignore', error: 'Not ignored - SECURITY RISK!' });
        console.log('   ❌ .env.local NOT in .gitignore - SECURITY RISK!');
      }
    }
  } else {
    results.warnings.push({ test: '.env.local file', warning: 'File not found' });
    console.log('   ⚠️  .env.local file not found');
  }
}

async function runTests() {
  console.log('🔒 Testing Security Features...\n');
  console.log('='.repeat(60));

  await testProFeatureProtection();
  await testRateLimiting();
  await testApiSecurity();
  await testEnvironmentSecurity();

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

  process.exit(results.failed.length > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
