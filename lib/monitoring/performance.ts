/**
 * Performance Monitoring - Real User Monitoring (RUM)
 * Tracks Core Web Vitals and custom metrics
 */

if (typeof window !== 'undefined') {
  // Core Web Vitals
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS(metric => trackWebVital('CLS', metric));
    onFID(metric => trackWebVital('FID', metric));
    onFCP(metric => trackWebVital('FCP', metric));
    onLCP(metric => trackWebVital('LCP', metric));
    onTTFB(metric => trackWebVital('TTFB', metric));
    onINP(metric => trackWebVital('INP', metric));
  }).catch(() => {
    // web-vitals not available, skip
  });
}

function trackWebVital(name: string, metric: any) {
  // Send to analytics
  if (window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Send to API for server-side tracking
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, value: metric.value, id: metric.id }),
      keepalive: true,
    }).catch(() => {
      // Silently fail
    });
  }
}

/**
 * Track page load performance
 */
export function trackPageLoad() {
  if (typeof window === 'undefined') return;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    const metrics = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseStart - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart,
      dom: navigation.domContentLoadedEventEnd - navigation.domInteractive,
      load: navigation.loadEventEnd - navigation.fetchStart,
    };

    // Track to analytics
    if (window.gtag) {
      window.gtag('event', 'page_load', {
        event_category: 'Performance',
        ...metrics,
      });
    }
  }
}

/**
 * Track API call performance
 */
export function trackAPIPerformance(endpoint: string, duration: number, success: boolean) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'api_call', {
      event_category: 'Performance',
      event_label: endpoint,
      value: Math.round(duration),
      success,
    });
  }
}
