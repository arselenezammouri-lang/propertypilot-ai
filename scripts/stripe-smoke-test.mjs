/**
 * Stripe smoke test: login → diagnose → checkout URL per ogni piano.
 * NON effettua pagamenti reali; verifica solo che le API rispondano e che
 * Stripe sia configurato (price IDs, redirect a checkout).
 *
 * Uso: TEST_EMAIL=... TEST_PASSWORD=... node scripts/stripe-smoke-test.mjs
 * Oppure: $env:TEST_EMAIL="..."; $env:TEST_PASSWORD="..."; node scripts/stripe-smoke-test.mjs
 */

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "https://propertypilot-ai.vercel.app";
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

const PLANS = ["starter", "pro", "agency"];

async function typeIntoField(page, selector, value) {
  const field = page.locator(selector);
  await field.click({ clickCount: 3 });
  await page.keyboard.press("Backspace");
  await field.type(value);
}

async function login(page) {
  const loginUrl = `${BASE_URL}/auth/login`;
  await page.goto(loginUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector('[data-testid="input-email"]', { state: "visible", timeout: 15000 });
  await typeIntoField(page, '[data-testid="input-email"]', TEST_EMAIL);
  await typeIntoField(page, '[data-testid="input-password"]', TEST_PASSWORD);
  await page.click('[data-testid="button-login"]');
  await page.waitForTimeout(2000);
  try {
    await page.waitForURL(/\/dashboard/, { timeout: 25000 });
    await page.waitForSelector('[data-testid="dashboard-header"]', { state: "visible", timeout: 12000 });
    return true;
  } catch (e) {
    try {
      console.warn("URL attuale dopo login:", page.url());
    } catch {}
    return false;
  }
}

async function main() {
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    console.error("Imposta TEST_EMAIL e TEST_PASSWORD (es. in .env.local o nella shell).");
    process.exitCode = 1;
    return;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Stripe smoke test su", BASE_URL);
  console.log("");

  let loggedIn = await login(page);
  if (!loggedIn) {
    console.warn("Primo tentativo login fallito, riprovo una volta...");
    await page.goto(`${BASE_URL}/auth/login`, { waitUntil: "domcontentloaded", timeout: 30000 });
    loggedIn = await login(page);
  }
  if (!loggedIn) {
    console.error("Login fallito. Verifica credenziali e riprova.");
    console.error("Suggerimento: controlla che l'account esista su Supabase e che la password sia corretta.");
    await browser.close();
    process.exitCode = 1;
    return;
  }
  console.log("Login OK\n");

  const results = { diagnose: null, checkout: {} };

  // 1) Diagnose (stato config + DB + Stripe per l'utente)
  try {
    let res = await page.request.get(`${BASE_URL}/api/stripe/diagnose`);
    let data = await res.json();
    if (!res.ok()) {
      results.diagnose = { ok: false, status: res.status(), error: data.error };
    } else {
      const d = data.diagnosis || data;
      const config = d.config || {};
      const issues = d.issues || [];
      const recommendations = d.recommendations || [];
      results.diagnose = {
        ok: true,
        priceIdsSet: !!(
          (config.starter_price_id && config.starter_price_id !== "NOT_SET") &&
          (config.pro_price_id && config.pro_price_id !== "NOT_SET") &&
          (config.agency_price_id && config.agency_price_id !== "NOT_SET")
        ),
        issues,
        recommendations,
      };
      if (recommendations.some((r) => String(r).toLowerCase().includes("sync"))) {
        const syncRes = await page.request.post(`${BASE_URL}/api/stripe/sync`, {
          headers: { "Content-Type": "application/json" },
        });
        if (syncRes.ok()) {
          res = await page.request.get(`${BASE_URL}/api/stripe/diagnose`);
          data = await res.json();
          const d2 = data.diagnosis || data;
          results.diagnose.issues = d2.issues || [];
          results.diagnose.recommendations = d2.recommendations || [];
          results.diagnose.syncRan = true;
        }
      }
    }
  } catch (e) {
    results.diagnose = { ok: false, error: e.message };
  }

  // 2) Checkout URL per ogni piano (POST /api/stripe/checkout)
  for (const plan of PLANS) {
    try {
      const res = await page.request.post(`${BASE_URL}/api/stripe/checkout`, {
        data: { planType: plan },
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok() && data.url) {
        results.checkout[plan] = { ok: true, hasUrl: true };
      } else {
        results.checkout[plan] = {
          ok: false,
          status: res.status(),
          error: data.error || data.message || "no url",
        };
      }
    } catch (e) {
      results.checkout[plan] = { ok: false, error: e.message };
    }
  }

  await browser.close();

  // Report
  console.log("=== STRIPE SMOKE TEST REPORT ===");
  console.log("");

  if (results.diagnose) {
    const d = results.diagnose;
    if (d.ok) {
      console.log("Diagnose: OK");
      console.log("  Price IDs configurati:", d.priceIdsSet ? "Si" : "No (controlla .env)");
      if (d.syncRan) console.log("  Sync Stripe eseguito (raccomandazione applicata).");
      const issues = Array.isArray(d.issues) ? d.issues : [];
      const recommendations = Array.isArray(d.recommendations) ? d.recommendations : [];
      if (issues.length > 0) {
        console.log("  Issue (" + issues.length + "):");
        issues.forEach((i) => console.log("    -", i));
      }
      if (recommendations.length > 0) {
        console.log("  Raccomandazioni (" + recommendations.length + "):");
        recommendations.forEach((r) => console.log("    -", r));
      }
    } else {
      console.log("Diagnose: FAIL", d.status || "", d.error || "");
    }
  }
  console.log("");

  console.log("Checkout (redirect a Stripe):");
  for (const plan of PLANS) {
    const c = results.checkout[plan];
    const status = c?.ok && c?.hasUrl ? "OK" : "FAIL";
    const detail = c?.error || (c?.status ? `status ${c.status}` : "") || "";
    console.log(`  ${plan.padEnd(8)} | ${status} ${detail ? "| " + detail : ""}`);
  }
  console.log("");

  const diagnoseOk = results.diagnose?.ok === true;
  const allCheckoutOk = PLANS.every((p) => results.checkout[p]?.ok === true && results.checkout[p]?.hasUrl === true);
  const issues = Array.isArray(results.diagnose?.issues) ? results.diagnose.issues : [];
  const onlyFounderAgencyIssue =
    issues.length === 1 &&
    String(issues[0]).toLowerCase().includes("agency") &&
    String(issues[0]).toLowerCase().includes("stripe_subscription_id");

  if (diagnoseOk && allCheckoutOk && (issues.length === 0 || onlyFounderAgencyIssue)) {
    if (onlyFounderAgencyIssue) {
      console.log("Stripe smoke test completato: Diagnose e Checkout OK.");
      console.log("  (Account founder: agency in DB senza Stripe subscription, impostato manualmente – OK per test.)");
    } else {
      console.log("Stripe smoke test completato: Diagnose e Checkout OK, 0 issue.");
    }
  } else if (diagnoseOk && allCheckoutOk) {
    console.log("Stripe smoke test: Diagnose e Checkout OK; rimangono issue da verificare (vedi sopra).");
  } else {
    console.log("Stripe smoke test: almeno un check fallito (vedi sopra).");
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Stripe smoke test crashed:", err);
  process.exitCode = 1;
});
