import { withRetry, fetchWithRetry } from '@/lib/utils/retry';

describe('Retry Utility', () => {
  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const result = await withRetry(fn);
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and succeed', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValueOnce('success');
      
      const result = await withRetry(fn, { maxRetries: 3, initialDelay: 1 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    }, 10000);

    it('should fail after max retries', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('network error'));
      
      await expect(withRetry(fn, { maxRetries: 2, initialDelay: 1 })).rejects.toThrow('network error');
      // Initial call + retries (maxRetries = 2 means 2 retries after initial)
      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    }, 10000);

    it('should not retry non-retryable errors', async () => {
      const error = new Error('Validation error');
      (error as any).status = 400;
      
      const fn = jest.fn().mockRejectedValue(error);
      
      await expect(withRetry(fn, { retryableStatuses: [500, 502, 503] })).rejects.toThrow('Validation error');
      expect(fn).toHaveBeenCalledTimes(1); // No retries
    });

    it('should use exponential backoff', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('network error'));
      const startTime = Date.now();
      
      try {
        await withRetry(fn, { 
          maxRetries: 2,
          initialDelay: 10,
          backoffMultiplier: 2,
        });
      } catch {
        // Expected to fail
      }
      
      const duration = Date.now() - startTime;
      // Should have waited at least initialDelay + (initialDelay * multiplier) = 10 + 20 = 30ms
      expect(duration).toBeGreaterThanOrEqual(25);
      expect(fn).toHaveBeenCalledTimes(3);
    }, 10000);
  });

  describe('fetchWithRetry', () => {
    it('should retry on 500 error', async () => {
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        } as Response);
      
      // The error thrown will have status 500 in retryableStatuses, so it should retry
      const response = await fetchWithRetry('/api/test', {}, { 
        retryableStatuses: [500], 
        initialDelay: 1,
        maxRetries: 3,
      });
      
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    }, 10000);
  });
});
