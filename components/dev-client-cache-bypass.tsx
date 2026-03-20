'use client';

import { useEffect } from 'react';

/**
 * On `next dev`, tears down any stale service workers and Cache Storage buckets
 * so the browser does not serve an old app shell or cached API responses.
 */
export function DevClientCacheBypass() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => void r.unregister());
      });
    }

    if ('caches' in window) {
      void caches.keys().then((keys) => {
        keys.forEach((k) => void caches.delete(k));
      });
    }
  }, []);

  return null;
}
