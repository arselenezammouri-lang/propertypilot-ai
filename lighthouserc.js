/**
 * Lighthouse CI Configuration
 * 
 * Performance testing per frontend
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/pricing',
        'http://localhost:3000/login',
      ],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'ready',
      startServerReadyTimeout: 60000,
      numberOfRuns: 3, // 3 runs per URL per avere media più accurata
    },
    assert: {
      assertions: {
        // Performance thresholds
        'categories:performance': ['error', { minScore: 0.7 }], // Minimo 70
        'categories:accessibility': ['error', { minScore: 0.9 }], // Minimo 90
        'categories:best-practices': ['error', { minScore: 0.8 }], // Minimo 80
        'categories:seo': ['error', { minScore: 0.8 }], // Minimo 80
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }], // < 2s
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }], // < 2.5s
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }], // < 0.1
        'total-blocking-time': ['warn', { maxNumericValue: 300 }], // < 300ms
        'speed-index': ['warn', { maxNumericValue: 3000 }], // < 3s
        
        // Resource sizes
        'total-byte-weight': ['warn', { maxNumericValue: 5000000 }], // < 5MB
        'dom-size': ['warn', { maxNumericValue: 1500 }], // < 1500 nodes
      },
    },
    upload: {
      target: 'temporary-public-storage', // Upload results for viewing
    },
  },
};
