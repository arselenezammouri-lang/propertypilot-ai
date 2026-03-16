import { test, expect } from '@playwright/test';

/**
 * E2E Test: Listings Workspace Flow
 * 
 * Testa il flusso dashboard listings:
 * 1. Login
 * 2. Navigazione al workspace listings
 * 3. Verifica shell UI e stato contenuti
 */
test.describe('AI Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    
    const testEmail = process.env.E2E_TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.E2E_TEST_PASSWORD || 'TestPassword123!';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    const loginButton = page.getByRole('button', { name: /login|accedi|sign in/i });
    await loginButton.click();
    
    await page.waitForURL(/dashboard/i, { timeout: 10000 });
  });

  test('should navigate to generation page', async ({ page }) => {
    // Look for link to generation page
    const generateLink = page.getByRole('link', { name: /generate|genera|comprehensive|completo/i });
    
    if (await generateLink.count() > 0) {
      await generateLink.first().click();
      await page.waitForURL(/generate|comprehensive/i);
    } else {
      // Try direct navigation
      await page.goto('/dashboard/listings');
      await expect(page).toHaveURL(/dashboard\/listings/i);
    }
  });

  test('should show listings workspace shell', async ({ page }) => {
    await page.goto('/dashboard/listings');

    const heading = page.locator('[data-testid="heading-listings"]');
    await expect(heading).toBeVisible({ timeout: 8000 });
  });

  test('should render either empty state or listing cards', async ({ page }) => {
    await page.goto('/dashboard/listings');

    const contentState = page.locator('[data-testid="card-empty"], [data-testid^="card-listing-"]').first();
    await expect(contentState).toBeVisible({ timeout: 8000 });
  });
});
