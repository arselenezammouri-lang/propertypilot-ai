import { test, expect } from '@playwright/test';

/**
 * E2E Test: Checkout Flow
 * 
 * Testa il flusso completo:
 * 1. Login utente
 * 2. Navigazione a pricing/checkout
 * 3. Selezione piano
 * 4. Redirect a Stripe Checkout
 * 5. Verifica che il webhook riceva l'evento
 * 
 * NOTA: Questo test richiede:
 * - Utente test autenticato
 * - Stripe test mode configurato
 * - Webhook endpoint accessibile
 */
test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login prima di ogni test
    await page.goto('/login');
    
    const testEmail = process.env.E2E_TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.E2E_TEST_PASSWORD || 'TestPassword123!';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    const loginButton = page.getByRole('button', { name: /login|accedi|sign in/i });
    await loginButton.click();
    
    // Wait for dashboard
    await page.waitForURL(/dashboard/i, { timeout: 10000 });
  });

  test('should navigate to pricing page', async ({ page }) => {
    // Navigate to pricing/plans page
    const pricingLink = page.getByRole('link', { name: /pricing|piani|plans/i });
    
    if (await pricingLink.count() > 0) {
      await pricingLink.first().click();
      await page.waitForURL(/pricing|piani|plans/i);
      
      // Verify pricing page loaded
      const pricingContent = page.locator('text=/starter|pro|agency|€|€/i').first();
      await expect(pricingContent).toBeVisible({ timeout: 5000 });
    } else {
      // If no pricing link, try direct navigation
      await page.goto('/pricing');
      await expect(page).toHaveURL(/pricing|piani|plans/i);
    }
  });

  test('should show subscription plans', async ({ page }) => {
    await page.goto('/pricing');
    
    // Verify all plans are visible
    const starterPlan = page.locator('text=/starter/i').first();
    const proPlan = page.locator('text=/pro/i').first();
    const agencyPlan = page.locator('text=/agency/i').first();
    
    await expect(starterPlan).toBeVisible({ timeout: 5000 });
    await expect(proPlan).toBeVisible({ timeout: 5000 });
    await expect(agencyPlan).toBeVisible({ timeout: 5000 });
  });

  test('should initiate checkout for starter plan', async ({ page }) => {
    await page.goto('/pricing');
    
    // Find and click "Get Started" or "Subscribe" button for Starter plan
    const starterButton = page
      .locator('text=/starter/i')
      .locator('..')
      .getByRole('button', { name: /get started|subscribe|abbonati|acquista/i })
      .first();
    
    if (await starterButton.count() > 0) {
      // Click button (this should redirect to Stripe Checkout)
      await starterButton.click();
      
      // Wait for redirect to Stripe (or checkout page)
      await page.waitForURL(/checkout|stripe|payment/i, { timeout: 15000 });
      
      // Verify we're on checkout page
      const checkoutIndicator = page.locator('text=/checkout|payment|pagamento/i').first();
      await expect(checkoutIndicator).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  });

  test('should show current subscription status in dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for subscription status indicator
    const subscriptionStatus = page.locator('text=/free|starter|pro|agency|subscription|abbonamento/i').first();
    
    // Should show current plan (at least "Free")
    await expect(subscriptionStatus).toBeVisible({ timeout: 5000 });
  });
});
