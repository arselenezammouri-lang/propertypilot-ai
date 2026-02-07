/**
 * Web Vitals Check
 * 
 * Verifica che i Core Web Vitals siano tracciati correttamente
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function checkWebVitalsEndpoint() {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/api/analytics/web-vitals');
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const testData = {
      name: 'LCP',
      value: 2500,
      id: 'test-id',
      delta: 2500,
      entries: [],
    };

    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data,
        });
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(testData));
    req.end();
  });
}

async function checkTrackingEndpoint() {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/api/analytics/track');
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const testData = {
      event: 'test_event',
      properties: {
        test: true,
      },
    };

    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data,
        });
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(testData));
    req.end();
  });
}

async function runChecks() {
  console.log('📊 Web Vitals & Analytics Check');
  console.log('================================\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Check Web Vitals endpoint
  console.log('1️⃣  Checking Web Vitals endpoint...');
  try {
    const webVitalsResult = await checkWebVitalsEndpoint();
    if (webVitalsResult.status === 200 || webVitalsResult.status === 201) {
      console.log('   ✅ Web Vitals endpoint is working');
    } else {
      console.log(`   ⚠️  Web Vitals endpoint returned ${webVitalsResult.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Web Vitals endpoint error: ${error.message}`);
  }

  // Check Tracking endpoint
  console.log('\n2️⃣  Checking Analytics Tracking endpoint...');
  try {
    const trackingResult = await checkTrackingEndpoint();
    if (trackingResult.status === 200 || trackingResult.status === 201) {
      console.log('   ✅ Analytics Tracking endpoint is working');
    } else {
      console.log(`   ⚠️  Analytics Tracking endpoint returned ${trackingResult.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Analytics Tracking endpoint error: ${error.message}`);
  }

  console.log('\n💡 Note: These endpoints may require authentication in production.');
  console.log('   Make sure they are accessible or properly protected.');
}

runChecks().catch(console.error);
