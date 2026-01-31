import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

console.log('🤖 Testing AI Features Configuration...\n');
console.log('='.repeat(60));

const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Test 1: OpenAI Configuration
console.log('1️⃣ Checking OpenAI Configuration...\n');

const openaiKey = process.env.OPENAI_API_KEY;
if (openaiKey) {
  if (openaiKey.startsWith('sk-')) {
    results.passed.push({ test: 'OpenAI API Key format' });
    console.log('   ✅ OpenAI API Key: Configured');
  } else {
    results.failed.push({ test: 'OpenAI API Key format', error: 'Invalid format' });
    console.log('   ❌ OpenAI API Key: Invalid format');
  }
} else {
  results.warnings.push({ test: 'OpenAI API Key', warning: 'Not configured' });
  console.log('   ⚠️  OpenAI API Key: Not configured');
}

// Test 2: AI Feature Files
console.log('\n2️⃣ Checking AI Feature Files...\n');

const aiFiles = [
  'lib/ai/generateListingContent.ts',
  'lib/ai/leadScoring.ts',
  'lib/ai/voice-agent.ts',
  'lib/ai/aria-brain.ts',
];

for (const file of aiFiles) {
  const filePath = join(__dirname, file);
  if (existsSync(filePath)) {
    results.passed.push({ test: `AI file: ${file}` });
    console.log(`   ✅ ${file}`);
  } else {
    results.failed.push({ test: `AI file: ${file}`, error: 'File not found' });
    console.log(`   ❌ ${file} - Not found`);
  }
}

// Test 3: API Routes for AI Features
console.log('\n3️⃣ Checking AI API Routes...\n');

const aiRoutes = [
  'app/api/generate/route.ts',
  'app/api/generate-perfect-copy/route.ts',
  'app/api/generate-followup/route.ts',
  'app/api/generate-video-script/route.ts',
  'app/api/generate-hashtags/route.ts',
  'app/api/generate-titles/route.ts',
  'app/api/generate-social-post/route.ts',
  'app/api/lead-score/route.ts',
  'app/api/aria/chat/route.ts',
  'app/api/prospecting/call/route.ts',
];

for (const route of aiRoutes) {
  const routePath = join(__dirname, route);
  if (existsSync(routePath)) {
    // Check if route has proper error handling
    const content = readFileSync(routePath, 'utf-8');
    if (content.includes('createClient') && content.includes('getUser')) {
      results.passed.push({ test: `AI route: ${route}` });
      console.log(`   ✅ ${route}`);
    } else {
      results.warnings.push({ test: `AI route: ${route}`, warning: 'Missing auth check' });
      console.log(`   ⚠️  ${route} - Missing auth check`);
    }
  } else {
    results.failed.push({ test: `AI route: ${route}`, error: 'File not found' });
    console.log(`   ❌ ${route} - Not found`);
  }
}

// Test 4: Rate Limiting
console.log('\n4️⃣ Checking Rate Limiting...\n');

const rateLimitFile = join(__dirname, 'lib/utils/rate-limit.ts');
if (existsSync(rateLimitFile)) {
  results.passed.push({ test: 'Rate limiting utility' });
  console.log('   ✅ Rate limiting utility found');
  
  const content = readFileSync(rateLimitFile, 'utf-8');
  if (content.includes('checkUserRateLimit')) {
    results.passed.push({ test: 'User rate limiting function' });
    console.log('   ✅ User rate limiting function found');
  }
  if (content.includes('checkIpRateLimit')) {
    results.passed.push({ test: 'IP rate limiting function' });
    console.log('   ✅ IP rate limiting function found');
  }
} else {
  results.failed.push({ test: 'Rate limiting utility', error: 'File not found' });
  console.log('   ❌ Rate limiting utility not found');
}

// Test 5: Subscription Checks
console.log('\n5️⃣ Checking Subscription Protection...\n');

const subCheckFile = join(__dirname, 'lib/utils/subscription-check.ts');
if (existsSync(subCheckFile)) {
  results.passed.push({ test: 'Subscription check utility' });
  console.log('   ✅ Subscription check utility found');
  
  const content = readFileSync(subCheckFile, 'utf-8');
  if (content.includes('requireProOrAgencySubscription')) {
    results.passed.push({ test: 'PRO/Agency subscription check' });
    console.log('   ✅ PRO/Agency subscription check found');
  }
  if (content.includes('requireActiveSubscription')) {
    results.passed.push({ test: 'Active subscription check' });
    console.log('   ✅ Active subscription check found');
  }
} else {
  results.failed.push({ test: 'Subscription check utility', error: 'File not found' });
  console.log('   ❌ Subscription check utility not found');
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
