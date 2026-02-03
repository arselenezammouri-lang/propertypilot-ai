'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { GeoProvider } from '@/contexts/geo-context';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';

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
        <PWAInstallPrompt />
      </GeoProvider>
    </QueryClientProvider>
  );
}
