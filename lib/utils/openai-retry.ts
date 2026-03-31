import OpenAI from 'openai';

export interface RetryOptions {
  maxRetries: number;
  timeoutMs: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  timeoutMs: 45000,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getExponentialDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const delay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000;
  return Math.min(delay + jitter, maxDelay);
}

function isRetryableError(error: any): boolean {
  if (error.status === 429) return true;
  if (error.status === 500) return true;
  if (error.status === 502) return true;
  if (error.status === 503) return true;
  if (error.status === 504) return true;
  if (error.code === 'ETIMEDOUT') return true;
  if (error.code === 'ECONNRESET') return true;
  if (error.code === 'ECONNREFUSED') return true;
  if (error.name === 'AbortError') return false;
  return false;
}

export async function withRetryAndTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: any = null;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, config.timeoutMs);

    try {
      const result = await operation(controller.signal);
      
      clearTimeout(timeoutId);
      return result;
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      lastError = error;

      console.error(`[OPENAI RETRY] Attempt ${attempt + 1} failed:`, {
        status: error.status,
        code: error.code,
        message: error.message?.substring(0, 100),
      });

      if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
        console.error(`[OPENAI RETRY] Request timed out after ${config.timeoutMs}ms`);
      }

      if (!isRetryableError(error)) {
        console.error('[OPENAI RETRY] Non-retryable error, throwing immediately');
        throw error;
      }

      if (attempt < config.maxRetries) {
        const delay = getExponentialDelay(attempt, config.baseDelayMs, config.maxDelayMs);
        await sleep(delay);
      }
    }
  }

  console.error('[OPENAI RETRY] All retries exhausted');
  throw lastError;
}

export function createOpenAIWithTimeout(apiKey: string): OpenAI {
  return new OpenAI({
    apiKey,
    timeout: 45000,
    maxRetries: 0,
  });
}
