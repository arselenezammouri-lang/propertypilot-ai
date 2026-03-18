import { tryLocalMockResponse } from '@/lib/api/local-mock-service';

/**
 * Frontend API client – typed fetch with consistent response shape.
 * Use fetchApi<T>() instead of raw fetch() for /api/* calls to get
 * unified error handling and ApiResponse<T> typing.
 */

export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; message?: string; status?: number };

/**
 * Fetch an API route and return a typed ApiResponse.
 * - On 2xx: parses JSON and returns { success: true, data } (or { success: false } if body has success: false).
 * - On 4xx/5xx: returns { success: false, error, message?, status }; does not throw.
 * - On non-JSON body (e.g. HTML error page), returns { success: false, error: statusText, status }.
 */
export async function fetchApi<T = unknown>(
  url: string,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch (error) {
    const mockData = tryLocalMockResponse(url, init?.method, 'network_error');
    if (mockData !== null) {
      return { success: true, data: mockData as T };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore di rete',
    };
  }

  let body: unknown;
  try {
    const text = await res.text();
    body = text ? JSON.parse(text) : null;
  } catch {
    const mockData = tryLocalMockResponse(url, init?.method, `non_json_${res.status}`);
    if (mockData !== null) {
      return { success: true, data: mockData as T };
    }

    return {
      success: false,
      error: res.statusText || 'Errore di rete',
      status: res.status,
    };
  }

  if (!res.ok) {
    const mockData = tryLocalMockResponse(url, init?.method, `status_${res.status}`);
    if (mockData !== null && (res.status === 401 || res.status === 403 || res.status >= 500)) {
      return { success: true, data: mockData as T };
    }

    const obj = body as Record<string, unknown>;
    return {
      success: false,
      error: (obj?.error as string) || res.statusText || 'Errore',
      message: obj?.message as string | undefined,
      status: res.status,
    };
  }

  if (body !== null && typeof body === 'object' && 'success' in body && (body as { success: boolean }).success === false) {
    const obj = body as { error?: string; message?: string };
    return {
      success: false,
      error: obj.error || 'Errore',
      message: obj.message,
      status: res.status,
    };
  }

  const data = (body && typeof body === 'object' && 'data' in body ? (body as { data: T }).data : body) as T;
  return { success: true, data };
}

/**
 * Helper: throw if ApiResponse is failure, otherwise return data.
 * Use when you want fetchApi to throw on error (e.g. in a mutation that should bubble).
 */
export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (response.success) return response.data;
  const err = new Error(response.message || response.error);
  (err as Error & { status?: number }).status = response.status;
  throw err;
}
