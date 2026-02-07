/**
 * Retry utility per API calls con exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableStatuses?: number[];
  onRetry?: (attempt: number, error: any) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 secondo
  maxDelay: 10000, // 10 secondi
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  onRetry: () => {},
};

/**
 * Esegue una funzione con retry automatico
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;
  let delay = opts.initialDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Non ritentare se non è un errore retryable
      const isRetryable = 
        opts.retryableStatuses.includes(error?.status) ||
        opts.retryableStatuses.includes(error?.response?.status) ||
        error?.code === 'ETIMEDOUT' ||
        error?.message?.includes('timeout') ||
        error?.message?.includes('network');

      if (!isRetryable || attempt === opts.maxRetries) {
        throw error;
      }

      // Callback retry
      opts.onRetry(attempt + 1, error);

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
    }
  }

  throw lastError;
}

/**
 * Wrapper per fetch con retry
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions?: RetryOptions
): Promise<Response> {
  return withRetry(
    async () => {
      const response = await fetch(url, options);
      
      // Se la risposta non è ok, lancia errore per triggerare retry
      if (!response.ok) {
        const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        if (retryOptions?.retryableStatuses?.includes(response.status)) {
          throw error;
        }
        // Se non è retryable, lancia comunque l'errore
        throw error;
      }
      
      return response;
    },
    retryOptions
  );
}
