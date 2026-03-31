import { logger } from '@/lib/utils/safe-logger';

describe('Safe Logger', () => {
  const originalConsole = { ...console };

  beforeEach(() => {
    // Mock console methods
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.debug = jest.fn();
  });

  afterEach(() => {
    // Restore console
    Object.assign(console, originalConsole);
  });

  describe('Sanitization', () => {
    it('should sanitize sensitive data', () => {
      const context = {
        email: 'test@example.com',
        password: 'secret123',
        api_key: 'sk_live_xxx',
        user_id: '123',
      };

      logger.error('Test error', null, context);
      
      const errorCall = (console.error as jest.Mock).mock.calls[0][0];
      expect(errorCall).toContain('[REDACTED]');
      expect(errorCall).not.toContain('secret123');
      expect(errorCall).not.toContain('sk_live_xxx');
    });

    it('should preserve non-sensitive data', () => {
      const context = {
        action: 'create_listing',
        status: 'success',
      };

      logger.info('Test message', context);
      
      const logCall = (console.log as jest.Mock).mock.calls[0][0];
      expect(logCall).toContain('create_listing');
      expect(logCall).toContain('success');
    });
  });

  describe('Log Levels', () => {
    it('should log info messages', () => {
      logger.info('Test info');
      expect(console.log).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      logger.warn('Test warning');
      expect(console.warn).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      logger.error('Test error');
      expect(console.error).toHaveBeenCalled();
    });

    it('should log debug messages only in development', () => {
      // The logger checks NODE_ENV === 'development' at initialization
      // Since we're in test environment, debug won't be called
      // This test verifies the behavior is correct
      (console.debug as jest.Mock).mockClear();
      logger.debug('Test debug');
      
      // In test environment (NODE_ENV='test'), debug should NOT be called
      // Only in 'development' it would be called
      expect(console.debug).not.toHaveBeenCalled();
    });
  });

  describe('Specialized Loggers', () => {
    it('should log API requests', () => {
      logger.apiRequest('POST', '/api/test', { userId: '123' });
      expect(console.log).toHaveBeenCalled();
    });

    it('should log API responses', () => {
      logger.apiResponse('POST', '/api/test', 200);
      expect(console.log).toHaveBeenCalled();
    });

    it('should log Stripe events', () => {
      logger.stripeEvent('checkout.completed', { sessionId: 'test' });
      expect(console.log).toHaveBeenCalled();
    });
  });
});
