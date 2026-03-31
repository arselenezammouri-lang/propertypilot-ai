"use client";

import { useState, useCallback } from 'react';
import { withRetry, RetryOptions } from '@/lib/utils/retry';
import { trackEvent } from '@/lib/analytics/tracking';

/**
 * Hook per fetch con retry automatico e loading state
 */
export function useRetryFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWithRetry = useCallback(
    async <T = any>(
      url: string,
      options: RequestInit = {},
      retryOptions?: RetryOptions
    ): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await withRetry(
          async () => {
            const res = await fetch(url, options);
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            return res;
          },
          {
            ...retryOptions,
            onRetry: (attempt, err) => {
              trackEvent('api_call', {
                url,
                attempt,
                error: err.message,
                retry: true,
              });
              retryOptions?.onRetry?.(attempt, err);
            },
          }
        );

        const data = await response.json();
        setIsLoading(false);
        return data;
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
        trackEvent('api_call', {
          url,
          error: err.message,
          success: false,
        });
        throw err;
      }
    },
    []
  );

  return { fetchWithRetry, isLoading, error };
}
