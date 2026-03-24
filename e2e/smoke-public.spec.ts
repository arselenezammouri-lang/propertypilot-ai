import { test, expect } from "@playwright/test";

/**
 * Smoke leggero per staging/local (Fase D2).
 * Non richiede login. Usa `baseURL` da playwright.config (locale o PLAYWRIGHT_BASE_URL).
 * Esegui: npm run smoke:public | npm run qa:premerge
 */

test.describe("@smoke public", () => {
  test("home responds", async ({ request }) => {
    const res = await request.get("/");
    expect(res.ok()).toBeTruthy();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/auth/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("signup page loads", async ({ page }) => {
    await page.goto("/auth/signup", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("forgot-password page loads", async ({ page }) => {
    await page.goto("/auth/forgot-password", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("reset-password page loads", async ({ page }) => {
    await page.goto("/auth/reset-password", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("docs hub loads", async ({ page }) => {
    await page.goto("/docs", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("sample docs article loads", async ({ page }) => {
    await page.goto("/docs/getting-started/welcome", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("pricing page loads", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("contatti page loads", async ({ page }) => {
    await page.goto("/contatti", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("compliance page loads", async ({ page }) => {
    await page.goto("/compliance", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("platform page loads", async ({ page }) => {
    await page.goto("/platform", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("features page loads", async ({ page }) => {
    await page.goto("/features", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("demo page loads", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("blog index loads", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("sample blog post loads", async ({ page }) => {
    await page.goto("/blog/come-scrivere-annunci-che-convertono", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });

  test("refund page loads", async ({ page }) => {
    await page.goto("/refund", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 15_000 });
  });
});
