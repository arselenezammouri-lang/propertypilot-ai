import { test, expect } from "@playwright/test";

/**
 * Smoke leggero per staging/local (Fase D2).
 * Non richiede login. Esegui: npx playwright test e2e/smoke-public.spec.ts
 */
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";

test.describe("@smoke public", () => {
  test("home responds", async ({ request }) => {
    const res = await request.get(base);
    expect(res.ok()).toBeTruthy();
  });

  test("login page loads", async ({ page }) => {
    await page.goto(`${base}/auth/login`, { waitUntil: "domcontentloaded" });
    await expect(page.locator('main, [role="main"], body')).toBeVisible();
  });

  test("signup page loads", async ({ page }) => {
    await page.goto(`${base}/auth/signup`, { waitUntil: "domcontentloaded" });
    await expect(page.locator('main, [role="main"], body')).toBeVisible();
  });
});
