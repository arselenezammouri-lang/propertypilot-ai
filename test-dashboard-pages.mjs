import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const baseUrl = 'http://localhost:3000';

// Dashboard pages to test
const dashboardPages = [
  '/dashboard',
  '/dashboard/prospecting',
  '/dashboard/map',
  '/dashboard/billing',
  '/dashboard/settings/workspace',
  '/dashboard/settings/notifications',
  '/dashboard/referral',
  '/dashboard/leads',
  '/dashboard/leads/pipeline',
  '/dashboard/crm/automations',
  '/dashboard/crm/settings',
  '/dashboard/perfect-copy',
  '/dashboard/refine-listing',
  '/dashboard/pdf',
  '/dashboard/agent-bio',
  '/dashboard/followup-emails',
  '/dashboard/video-scripts',
  '/dashboard/hashtags',
  '/dashboard/emotional-listing',
  '/dashboard/social-posts',
  '/dashboard/titles',
  '/dashboard/translate',
  '/dashboard/analyze',
  '/dashboard/auditor',
  '/dashboard/scraper',
  '/dashboard/agency-assistant',
  '/dashboard/agency-branding',
  '/dashboard/packages',
  '/dashboard/listings',
  '/dashboard/automations',
  '/dashboard/lead-score',
];

const results = {
  passed: [],
  failed: [],
  skipped: []
};

async function testPage(url) {
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'GET',
      redirect: 'follow',
    });

    const status = response.status;
    const finalUrl = response.url;

    // Check if redirected to login (expected for protected routes)
    if (finalUrl.includes('/auth/login')) {
      results.skipped.push({ url, status, reason: 'Redirected to login (expected)' });
      return { success: true, status, redirected: true };
    }

    // Check if page loaded successfully
    if (status >= 200 && status < 300) {
      const text = await response.text();
      
      // Check for common error patterns
      if (text.includes('Error:') || text.includes('error') || text.includes('500')) {
        results.failed.push({ url, status, reason: 'Error in page content' });
        return { success: false, status, error: 'Error in content' };
      }

      results.passed.push({ url, status });
      return { success: true, status };
    } else {
      results.failed.push({ url, status, reason: `HTTP ${status}` });
      return { success: false, status };
    }
  } catch (error) {
    results.failed.push({ url, error: error.message });
    return { success: false, error: error.message };
  }
}

async function checkPageFiles() {
  console.log('📁 Checking Dashboard Page Files...\n');
  
  const dashboardDir = resolve(__dirname, 'app/dashboard');
  const issues = [];

  async function scanDir(dir, basePath = '') {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
        
        if (entry.isDirectory()) {
          await scanDir(fullPath, relativePath);
        } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
          // Check if file exists and is readable
          if (existsSync(fullPath)) {
            console.log(`  ✓ ${relativePath}`);
          } else {
            issues.push({ path: relativePath, issue: 'File not found' });
            console.log(`  ❌ ${relativePath} - File not found`);
          }
        }
      }
    } catch (error) {
      issues.push({ path: basePath, issue: error.message });
    }
  }

  await scanDir(dashboardDir);
  
  if (issues.length > 0) {
    console.log(`\n⚠️  Found ${issues.length} file issues`);
  } else {
    console.log('\n✅ All page files found');
  }
  
  return issues;
}

async function runTests() {
  console.log('🧪 Testing Dashboard Pages...\n');
  console.log('='.repeat(60));
  
  // First check files
  await checkPageFiles();
  
  console.log('\n🌐 Testing Page Accessibility:\n');
  
  for (const page of dashboardPages) {
    await testPage(page);
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 TEST SUMMARY:\n');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⏭️  Skipped: ${results.skipped.length}`);
  console.log(`📈 Total: ${results.passed.length + results.failed.length + results.skipped.length}\n`);

  if (results.failed.length > 0) {
    console.log('❌ FAILED TESTS:\n');
    results.failed.forEach(({ url, status, reason, error }) => {
      console.log(`  - ${url}`);
      if (status) console.log(`    Status: ${status}`);
      if (reason) console.log(`    Reason: ${reason}`);
      if (error) console.log(`    Error: ${error}`);
    });
  }

  if (results.passed.length > 0) {
    console.log('\n✅ PASSED TESTS:\n');
    results.passed.forEach(({ url }) => {
      console.log(`  ✓ ${url}`);
    });
  }

  if (results.skipped.length > 0) {
    console.log('\n⏭️  SKIPPED (Redirected to login - expected):\n');
    results.skipped.forEach(({ url }) => {
      console.log(`  → ${url}`);
    });
  }

  process.exit(results.failed.length > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
