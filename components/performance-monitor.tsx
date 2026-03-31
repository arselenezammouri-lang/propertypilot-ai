"use client";

import { useEffect } from 'react';
import { trackPageLoad } from '@/lib/monitoring/performance';

/**
 * Performance Monitor Component
 * Tracks Core Web Vitals and page load performance
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Track page load performance
    if (typeof window !== 'undefined') {
      // Wait for page to fully load
      if (document.readyState === 'complete') {
        trackPageLoad();
      } else {
        window.addEventListener('load', trackPageLoad);
        return () => window.removeEventListener('load', trackPageLoad);
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
