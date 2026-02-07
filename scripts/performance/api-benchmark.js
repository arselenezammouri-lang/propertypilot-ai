/**
 * API Performance Benchmark
 * 
 * Testa i tempi di risposta delle API critiche
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const ITERATIONS = 10; // Numero di richieste per endpoint

const endpoints = [
  {
    name: 'Health Check',
    path: '/api/health',
    method: 'GET',
    requiresAuth: false,
  },
  {
    name: 'Generate Comprehensive (Mock)',
    path: '/api/generate-comprehensive',
    method: 'POST',
    requiresAuth: true,
    body: JSON.stringify({
      address: '123 Test St',
      price: 500000,
      propertyType: 'apartment',
      transactionType: 'sale',
    }),
  },
];

async function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + endpoint.path);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const startTime = Date.now();
    const client = url.protocol === 'https:' ? https : http;

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          status: res.statusCode,
          duration,
          size: data.length,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (endpoint.body) {
      req.write(endpoint.body);
    }

    req.end();
  });
}

async function benchmarkEndpoint(endpoint) {
  const results = [];
  const errors = [];

  console.log(`\n📊 Testing: ${endpoint.name}`);
  console.log(`   ${endpoint.method} ${endpoint.path}`);

  for (let i = 0; i < ITERATIONS; i++) {
    try {
      const result = await makeRequest(endpoint);
      results.push(result);
      process.stdout.write(`   Run ${i + 1}/${ITERATIONS}: ${result.duration}ms (${result.status})\r`);
    } catch (error) {
      errors.push(error);
      process.stdout.write(`   Run ${i + 1}/${ITERATIONS}: ERROR\r`);
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(''); // New line

  if (results.length === 0) {
    console.log(`   ❌ All requests failed`);
    return null;
  }

  // Calculate statistics
  const durations = results.map(r => r.duration);
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  const sorted = [...durations].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];

  const successRate = (results.length / ITERATIONS) * 100;
  const avgSize = results.reduce((sum, r) => sum + r.size, 0) / results.length;

  return {
    endpoint: endpoint.name,
    path: endpoint.path,
    successRate: `${successRate.toFixed(1)}%`,
    avg: `${avg.toFixed(0)}ms`,
    min: `${min}ms`,
    max: `${max}ms`,
    p50: `${p50}ms`,
    p95: `${p95}ms`,
    p99: `${p99}ms`,
    avgSize: `${(avgSize / 1024).toFixed(2)}KB`,
    errors: errors.length,
  };
}

async function runBenchmarks() {
  console.log('🚀 API Performance Benchmark');
  console.log('============================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Iterations per endpoint: ${ITERATIONS}`);
  console.log(`\n⚠️  Note: Some endpoints may fail without authentication. This is expected.`);

  const results = [];

  for (const endpoint of endpoints) {
    const result = await benchmarkEndpoint(endpoint);
    if (result) {
      results.push(result);
    }
  }

  // Print summary
  console.log('\n📈 Summary');
  console.log('============================');
  console.table(results);

  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log('   - P50 should be < 200ms for simple endpoints');
  console.log('   - P95 should be < 500ms for most endpoints');
  console.log('   - P99 should be < 1000ms for critical endpoints');
  console.log('   - Success rate should be 100%');
}

runBenchmarks().catch(console.error);
