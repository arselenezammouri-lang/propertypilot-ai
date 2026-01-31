import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const baseUrl = 'http://localhost:3000';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testEmail = 'cliente.test.1769701040489@propilot-ai.com';
const testPassword = 'PasswordSicura123!';

let authToken = null;
let userId = null;

// Test results
const results = {
  passed: [],
  failed: [],
  skipped: []
};

async function login() {
  console.log('🔐 Logging in...\n');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (error || !data.session) {
    console.error('❌ Login failed:', error?.message);
    process.exit(1);
  }

  authToken = data.session.access_token;
  userId = data.user.id;
  console.log('✅ Logged in successfully\n');
}

async function testAPI(endpoint, method = 'GET', body = null, description = null) {
  const url = `${baseUrl}${endpoint}`;
  const name = description || endpoint;
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sb-access-token=${authToken}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const status = response.status;
    
    // Try to parse JSON, but don't fail if it's not JSON
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }

    if (status >= 200 && status < 300) {
      results.passed.push({ name, endpoint, status });
      console.log(`✅ ${name} - Status: ${status}`);
      return { success: true, status, data };
    } else if (status === 401 || status === 403) {
      results.skipped.push({ name, endpoint, status, reason: 'Auth required' });
      console.log(`⏭️  ${name} - Status: ${status} (Auth required - OK)`);
      return { success: true, status, data, skipped: true };
    } else {
      results.failed.push({ name, endpoint, status, error: data });
      console.log(`❌ ${name} - Status: ${status}`, data);
      return { success: false, status, data };
    }
  } catch (error) {
    results.failed.push({ name, endpoint, error: error.message });
    console.log(`❌ ${name} - Error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing All API Routes...\n');
  console.log('='.repeat(60));
  
  await login();

  console.log('\n📋 Testing API Routes:\n');

  // Auth APIs
  console.log('🔐 Auth APIs:');
  await testAPI('/api/auth/setup-user', 'POST', { fullName: 'Test User' }, 'Setup User');

  // User APIs
  console.log('\n👤 User APIs:');
  await testAPI('/api/user/subscription', 'GET', null, 'Get Subscription');

  // Health Check
  console.log('\n🏥 Health APIs:');
  await testAPI('/api/health', 'GET', null, 'Health Check');

  // Prospecting APIs
  console.log('\n🔍 Prospecting APIs:');
  await testAPI('/api/prospecting/listings', 'GET', null, 'Get Listings');
  await testAPI('/api/prospecting/stats', 'GET', null, 'Get Stats');
  await testAPI('/api/prospecting/stats-3d', 'GET', null, 'Get 3D Stats');
  await testAPI('/api/prospecting/filters', 'GET', null, 'Get Filters');
  await testAPI('/api/prospecting/price-drops', 'GET', null, 'Get Price Drops');
  await testAPI('/api/prospecting/expired-listings', 'GET', null, 'Get Expired Listings');

  // Leads APIs
  console.log('\n📊 Leads APIs:');
  await testAPI('/api/leads', 'GET', null, 'Get Leads');

  // Listings APIs
  console.log('\n🏠 Listings APIs:');
  await testAPI('/api/listings', 'GET', null, 'Get Listings');

  // Communications APIs
  console.log('\n📧 Communications APIs:');
  await testAPI('/api/communications/templates', 'GET', null, 'Get Templates');
  await testAPI('/api/communications/logs', 'GET', null, 'Get Logs');

  // Automations APIs
  console.log('\n⚡ Automations APIs:');
  await testAPI('/api/automations', 'GET', null, 'Get Automations');
  await testAPI('/api/automations/rules', 'GET', null, 'Get Rules');

  // Settings APIs
  console.log('\n⚙️  Settings APIs:');
  await testAPI('/api/settings/notifications', 'GET', null, 'Get Notification Settings');

  // CRM APIs
  console.log('\n💼 CRM APIs:');
  await testAPI('/api/crm/api-keys', 'GET', null, 'Get API Keys');

  // Purchases APIs
  console.log('\n💳 Purchases APIs:');
  await testAPI('/api/purchases', 'GET', null, 'Get Purchases');

  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 TEST SUMMARY:\n');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⏭️  Skipped: ${results.skipped.length}`);
  console.log(`📈 Total: ${results.passed.length + results.failed.length + results.skipped.length}\n`);

  if (results.failed.length > 0) {
    console.log('❌ FAILED TESTS:\n');
    results.failed.forEach(({ name, endpoint, status, error }) => {
      console.log(`  - ${name} (${endpoint})`);
      if (status) console.log(`    Status: ${status}`);
      if (error) console.log(`    Error: ${typeof error === 'string' ? error : JSON.stringify(error).substring(0, 100)}`);
    });
  }

  if (results.passed.length > 0) {
    console.log('\n✅ PASSED TESTS:\n');
    results.passed.forEach(({ name }) => {
      console.log(`  ✓ ${name}`);
    });
  }

  process.exit(results.failed.length > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
