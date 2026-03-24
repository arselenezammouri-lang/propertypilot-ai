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
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("signup page loads", async ({ page }) => {
    await page.goto(`${base}/auth/signup`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("forgot-password page loads", async ({ page }) => {
    await page.goto(`${base}/auth/forgot-password`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("reset-password page loads", async ({ page }) => {
    await page.goto(`${base}/auth/reset-password`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("docs hub loads", async ({ page }) => {
    await page.goto(`${base}/docs`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("sample docs article loads", async ({ page }) => {
    await page.goto(`${base}/docs/getting-started/welcome`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("pricing page loads", async ({ page }) => {
    await page.goto(`${base}/pricing`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("contatti page loads", async ({ page }) => {
    await page.goto(`${base}/contatti`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("compliance page loads", async ({ page }) => {
    await page.goto(`${base}/compliance`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("platform page loads", async ({ page }) => {
    await page.goto(`${base}/platform`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("features page loads", async ({ page }) => {
    await page.goto(`${base}/features`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("about page loads", async ({ page }) => {
    await page.goto(`${base}/about`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("demo page loads", async ({ page }) => {
    await page.goto(`${base}/demo`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("blog index loads", async ({ page }) => {
    await page.goto(`${base}/blog`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("sample blog post loads", async ({ page }) => {
    await page.goto(`${base}/blog/come-scrivere-annunci-che-convertono`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto(`${base}/privacy`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("terms page loads", async ({ page }) => {
    await page.goto(`${base}/terms`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("refund page loads", async ({ page }) => {
    await page.goto(`${base}/refund`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });
});
