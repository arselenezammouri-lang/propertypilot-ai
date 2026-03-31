import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        const response = await fetch(url);
        const text = await response.text();
        let body: unknown;
        try {
          body = text ? JSON.parse(text) : null;
        } catch {
          throw new Error(response.ok ? 'Invalid JSON' : (response.statusText || 'API request failed'));
        }
        if (!response.ok) {
          const err = body as { message?: string; error?: string } | null;
          throw new Error(err?.message || err?.error || response.statusText || 'API request failed');
        }
        return body;
      },
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export async function apiRequest<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const text = await response.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(response.ok ? 'Invalid JSON' : (response.statusText || 'API request failed'));
  }
  if (!response.ok) {
    const err = body as { message?: string; error?: string } | null;
    throw new Error(err?.message || err?.error || response.statusText || 'API request failed');
  }
  return body as T;
}
