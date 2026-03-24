import { test, expect } from '@playwright/test';

/**
 * Smoke: dopo login, la pagina Fatturazione si carica e mostra la card piano.
 *
 * Credenziali (solo `.env.local`, mai in git):
 * - Preferenza: `E2E_FOUNDER_EMAIL` + `E2E_FOUNDER_PASSWORD` (stesso founder test agency)
 * - Alternativa: `E2E_TEST_EMAIL` + `E2E_TEST_PASSWORD`
 *
 * Esecuzione (con env caricato):
 *   DOTENV_CONFIG_PATH=.env.local node -r dotenv/config npx playwright test e2e/dashboard-billing.spec.ts
 * oppure:
 *   npm run test:e2e:billing
 */
function getCredentials(): { email: string; password: string } | null {
  const fe = process.env.E2E_FOUNDER_EMAIL?.trim();
  const fp = process.env.E2E_FOUNDER_PASSWORD?.trim();
  if (fe && fp) return { email: fe, password: fp };
  const te = process.env.E2E_TEST_EMAIL?.trim();
  const tp = process.env.E2E_TEST_PASSWORD?.trim();
  if (te && tp) return { email: te, password: tp };
  return null;
}

test.describe('Dashboard — billing page', () => {
  test('login then billing shows plan card', async ({ page }) => {
    const creds = getCredentials();
    test.skip(
      !creds,
      'Set E2E_FOUNDER_EMAIL+E2E_FOUNDER_PASSWORD or E2E_TEST_EMAIL+E2E_TEST_PASSWORD in .env.local'
    );

    test.setTimeout(90_000);

    await page.goto('/auth/login');
    await page.fill('input[type="email"]', creds!.email);
    await page.fill('input[type="password"]', creds!.password);
    await page.getByRole('button', { name: /accedi|sign in|log in|login/i }).click();
    await page.waitForURL(/\/dashboard/i, { timeout: 30_000 });

    await page.goto('/dashboard/billing');
    await expect(page).toHaveURL(/\/dashboard\/billing/);

    const planCard = page.getByTestId('card-current-plan');
    await expect(planCard).toBeVisible({ timeout: 25_000 });
    await expect(planCard.getByTestId('text-plan-name')).toBeVisible();
  });
});
