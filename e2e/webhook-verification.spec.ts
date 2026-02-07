import { test, expect } from '@playwright/test';

/**
 * E2E Test: Webhook Verification
 * 
 * Testa che il webhook endpoint funzioni correttamente.
 * 
 * NOTA: Questo test richiede:
 * - Webhook endpoint accessibile
 * - Stripe test mode
 * - Possibilità di simulare eventi Stripe
 */
test.describe('Webhook Verification', () => {
  test('webhook endpoint should be accessible', async ({ request }) => {
    // Test che l'endpoint webhook esista e risponda
    const response = await request.post('/api/stripe/webhook', {
      data: JSON.stringify({ test: true }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Should return 400 (missing signature) rather than 404 (not found)
    // This confirms the endpoint exists
    expect([400, 401, 500]).toContain(response.status());
  });

  test('webhook should reject requests without signature', async ({ request }) => {
    const response = await request.post('/api/stripe/webhook', {
      data: JSON.stringify({
        type: 'checkout.session.completed',
        data: { object: {} },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Should return 400 for missing signature
    expect(response.status()).toBe(400);
    
    const body = await response.json();
    expect(body.error).toContain('signature');
  });

  test('webhook should reject invalid signatures', async ({ request }) => {
    const response = await request.post('/api/stripe/webhook', {
      data: JSON.stringify({
        type: 'checkout.session.completed',
        data: { object: {} },
      }),
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'invalid_signature',
      },
    });
    
    // Should return 400 for invalid signature
    expect(response.status()).toBe(400);
    
    const body = await response.json();
    expect(body.error).toContain('signature');
  });
});
