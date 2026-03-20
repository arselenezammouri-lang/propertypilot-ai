import { test, expect } from '@playwright/test';

/**
 * Test singolo: dopo login founder su localhost, la card "piano attuale" deve mostrare agency
 * (override Host localhost + email founder in lib/utils/effective-plan.ts).
 *
 * Aggiungi SOLO in .env.local (mai in git):
 *   E2E_FOUNDER_EMAIL=...
 *   E2E_FOUNDER_PASSWORD=...
 *
 * Esecuzione: DOTENV_CONFIG_PATH=.env.local node -r dotenv/config npx playwright test e2e/dashboard-founder-agency.spec.ts
 */
test.describe('Dashboard — founder agency (localhost)', () => {
  test('current plan card shows Agency after login', async ({ page }) => {
    const email = process.env.E2E_FOUNDER_EMAIL?.trim();
    const password = process.env.E2E_FOUNDER_PASSWORD?.trim();
    test.skip(
      !email || !password,
      'Set E2E_FOUNDER_EMAIL and E2E_FOUNDER_PASSWORD in .env.local for this test'
    );

    await page.goto('/auth/login');
    await page.fill('input[type="email"]', email!);
    await page.fill('input[type="password"]', password!);
    await page.getByRole('button', { name: /accedi|sign in|log in|login/i }).click();
    await page.waitForURL(/\/dashboard/i, { timeout: 25000 });

    const planCard = page.getByTestId('card-current-plan');
    await expect(planCard).toBeVisible({ timeout: 15000 });
    await expect(planCard).toContainText(/agency/i);
  });
});
