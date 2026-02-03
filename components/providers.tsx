'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, lazy, Suspense } from 'react';
import { GeoProvider } from '@/contexts/geo-context';

const PWAInstallPrompt = lazy(() => import('@/components/pwa-install-prompt').then(mod => ({ default: mod.PWAInstallPrompt })));

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: async ({ queryKey }) => {
          const url = queryKey[0] as string;
          const response = await fetch(url);
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || error.error || 'API request failed');
          }
          
          return response.json();
        },
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <GeoProvider>
        {children}
        <Suspense fallback={null}>
          <PWAInstallPrompt />
        </Suspense>
      </GeoProvider>
    </QueryClientProvider>
  );
}
