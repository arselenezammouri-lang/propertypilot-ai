'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { GeoProvider } from '@/contexts/geo-context';
import { tryLocalMockResponse } from '@/lib/api/local-mock-service';
import { isLocalMockModeEnabled } from '@/lib/utils/local-dev';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    const isDev = process.env.NODE_ENV === 'development';
    return new QueryClient({
      defaultOptions: {
        queries: {
          queryFn: async ({ queryKey }) => {
            const url = queryKey[0] as string;
            try {
              const response = await fetch(url);

              if (!response.ok) {
                const localMock =
                  isLocalMockModeEnabled()
                    ? tryLocalMockResponse(url, 'GET', `react_query_${response.status}`)
                    : null;
                if (localMock !== null && (response.status === 401 || response.status === 403 || response.status >= 500)) {
                  return localMock;
                }

                const rawText = await response.text();
                let errorMessage = 'API request failed';
                try {
                  const parsed = rawText ? JSON.parse(rawText) : null;
                  if (parsed && typeof parsed === 'object') {
                    const obj = parsed as Record<string, unknown>;
                    errorMessage =
                      (typeof obj.message === 'string' && obj.message) ||
                      (typeof obj.error === 'string' && obj.error) ||
                      errorMessage;
                  }
                } catch {
                  // keep default error message
                }
                throw new Error(errorMessage);
              }

              return response.json();
            } catch (error) {
              const localMock = isLocalMockModeEnabled()
                ? tryLocalMockResponse(url, 'GET', 'react_query_network_error')
                : null;
              if (localMock !== null) {
                return localMock;
              }
              throw error;
            }
          },
          staleTime: isDev ? 0 : 60 * 1000,
          retry: 1,
          refetchOnWindowFocus: isDev,
          refetchOnMount: isDev ? 'always' : true,
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <GeoProvider>
        {children}
      </GeoProvider>
    </QueryClientProvider>
  );
}
