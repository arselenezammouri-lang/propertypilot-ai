/**
 * K6 Load Test
 * 
 * Test di carico per verificare scalabilità
 * 
 * Installazione: npm install -g k6
 * Esecuzione: k6 run scripts/performance/load-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const apiResponseTime = new Trend('api_response_time');

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 10 },   // Stay at 10 users
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% < 500ms, 99% < 1000ms
    http_req_failed: ['rate<0.01'], // Error rate < 1%
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test 1: Health check (no auth required)
  const healthResponse = http.get(`${BASE_URL}/api/health`);
  const healthCheck = check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  if (!healthCheck) {
    errorRate.add(1);
  }
  apiResponseTime.add(healthResponse.timings.duration);

  sleep(1);

  // Test 2: Homepage (no auth required)
  const homeResponse = http.get(`${BASE_URL}/`);
  const homeCheck = check(homeResponse, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  if (!homeCheck) {
    errorRate.add(1);
  }
  apiResponseTime.add(homeResponse.timings.duration);

  sleep(1);

  // Test 3: Pricing page (no auth required)
  const pricingResponse = http.get(`${BASE_URL}/pricing`);
  const pricingCheck = check(pricingResponse, {
    'pricing page status is 200': (r) => r.status === 200,
    'pricing page response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  if (!pricingCheck) {
    errorRate.add(1);
  }
  apiResponseTime.add(pricingResponse.timings.duration);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'load-test-results.json': JSON.stringify(data, null, 2),
  };
}

function textSummary(data, options) {
  const indent = options.indent || '';
  const enableColors = options.enableColors || false;
  
  let summary = '\n';
  summary += `${indent}📊 Load Test Summary\n`;
  summary += `${indent}====================\n\n`;
  
  // HTTP metrics
  if (data.metrics.http_req_duration) {
    const duration = data.metrics.http_req_duration;
    summary += `${indent}Response Times:\n`;
    summary += `${indent}  Average: ${duration.values.avg.toFixed(2)}ms\n`;
    summary += `${indent}  P50: ${duration.values.med.toFixed(2)}ms\n`;
    summary += `${indent}  P95: ${duration.values['p(95)'].toFixed(2)}ms\n`;
    summary += `${indent}  P99: ${duration.values['p(99)'].toFixed(2)}ms\n`;
    summary += `${indent}  Max: ${duration.values.max.toFixed(2)}ms\n\n`;
  }
  
  if (data.metrics.http_req_failed) {
    const failed = data.metrics.http_req_failed;
    summary += `${indent}Error Rate: ${(failed.values.rate * 100).toFixed(2)}%\n\n`;
  }
  
  if (data.metrics.http_reqs) {
    const reqs = data.metrics.http_reqs;
    summary += `${indent}Total Requests: ${reqs.values.count}\n`;
    summary += `${indent}Requests/sec: ${reqs.values.rate.toFixed(2)}\n\n`;
  }
  
  // Thresholds
  if (data.root_group.checks) {
    summary += `${indent}Checks:\n`;
    data.root_group.checks.forEach(check => {
      const status = check.passes === check.fails ? '⚠️' : check.passes > 0 ? '✅' : '❌';
      summary += `${indent}  ${status} ${check.name}: ${check.passes}/${check.passes + check.fails}\n`;
    });
  }
  
  return summary;
}
