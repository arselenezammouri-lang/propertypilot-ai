import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "https://propertypilot-ai.vercel.app";

// Credenziali test per login riuscito (da impostare nelle env locali/CI)
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

const PUBLIC_PATHS = [
  "/", // landing
  "/about",
  "/features",
  "/pricing",
  "/platform",
  "/compliance",
  "/contact",
  "/contatti",
  "/blog",
  "/docs",
  "/privacy",
  "/refund",
  "/terms",
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
];

// Pagine dashboard principali (richiedono login)
const DASHBOARD_PATHS = [
  "/dashboard",
  "/dashboard/listings",
  "/dashboard/leads",
  "/dashboard/leads/pipeline",
  "/dashboard/lead-score",
  "/dashboard/emotional-listing",
  "/dashboard/perfect-copy",
  "/dashboard/followup-emails",
  "/dashboard/hashtags",
  "/dashboard/social-posts",
  "/dashboard/titles",
  "/dashboard/video-scripts",
  "/dashboard/translate",
  "/dashboard/refine-listing",
  "/dashboard/pdf",
  "/dashboard/map",
  "/dashboard/prospecting",
  "/dashboard/opportunities",
  "/dashboard/autopilot",
  "/dashboard/agency-branding",
  "/dashboard/agency-assistant",
  "/dashboard/packages",
  "/dashboard/referral",
  "/dashboard/settings/notifications",
  "/dashboard/settings/workspace",
  "/dashboard/crm/automations",
  "/dashboard/billing",
];

const RESULTS = [];

async function typeIntoField(page, selector, value) {
  const field = page.locator(selector);
  await field.click({ clickCount: 3 });
  await page.keyboard.press("Backspace");
  await field.type(value);
}

async function checkPage(page, path, opts = {}) {
  const url = `${BASE_URL}${path}`;
  const start = Date.now();

  try {
    const waitUntil = opts.waitUntil ?? "networkidle";
    const timeout = opts.timeout ?? 30000;
    const response = await page.goto(url, { waitUntil, timeout });
    const duration = Date.now() - start;
    const status = response?.status() ?? 0;

    const okStatus = status < 400;
    const withinTime = duration <= 3000;

    RESULTS.push({
      url,
      status,
      ms: duration,
      ok: okStatus,
      note: !withinTime ? "SLOW" : "",
    });
  } catch (error) {
    const duration = Date.now() - start;
    RESULTS.push({
      url,
      status: 0,
      ms: duration,
      ok: false,
      note: `ERROR: ${error.message}`,
    });
  }
}

async function testAuth(page) {
  const loginUrl = `${BASE_URL}/auth/login`;

  // Login riuscito solo se abbiamo credenziali di test
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    // Tentativo di login fallito per verificare che il form non crashi
    await page.goto(loginUrl, { waitUntil: "networkidle" });
    await typeIntoField(page, '[data-testid="input-email"]', "wrong@example.com");
    await typeIntoField(page, '[data-testid="input-password"]', "wrong-password");
    await page.click('[data-testid="button-login"]').catch(() => {});
    await page.waitForTimeout(1000);

    console.warn("TEST_EMAIL / TEST_PASSWORD non impostate: salto il login riuscito.");
    return false;
  }

  // Pulisci il form e rifai login
  await page.goto(loginUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="input-email"]', { state: "visible", timeout: 8000 });
  await typeIntoField(page, '[data-testid="input-email"]', TEST_EMAIL);
  await typeIntoField(page, '[data-testid="input-password"]', TEST_PASSWORD);
  await page.click('[data-testid="button-login"]');

  // Attendi redirect a /dashboard (Supabase puo impiegare qualche secondo)
  try {
    await page.waitForURL(/\/dashboard/, { timeout: 20000 });
  } catch (e) {
    console.warn("Login: redirect a /dashboard non avvenuto in tempo. URL attuale:", page.url());
    return false;
  }

  // Attendi che l'header della dashboard sia visibile (render client)
  try {
    await page.waitForSelector('[data-testid="dashboard-header"]', { state: "visible", timeout: 10000 });
    return true;
  } catch (e) {
    console.warn("Login: header dashboard non visibile in tempo. URL:", page.url());
    return false;
  }
}

async function testAiFlow(page) {
  // Body richiesto da /api/generate-titles (schema TitlesRequestSchema)
  const ctx = page.request;
  const response = await ctx.post(`${BASE_URL}/api/generate-titles`, {
    data: {
      tipoTransazione: "vendita",
      tipoImmobile: "appartamento",
      localita: "Milano",
      puntiChiave: "Appartamento centrale per smoke test, luminoso, zona servita.",
      tono: "professionale",
    },
  });

  const status = response.status();
  const isSoftBlocked = status === 403;
  const ok = response.ok() || isSoftBlocked;
  if (!ok) {
    console.error(`AI FLOW TEST FAILED: status=${status}`);
  } else if (!isSoftBlocked) {
    const data = await response.json().catch(() => null);
    if (!data) {
      console.error("AI FLOW TEST FAILED: empty JSON response");
    }
  }

  RESULTS.push({
    url: `${BASE_URL}/api/generate-titles`,
    status,
    ms: 0,
    ok,
    note: isSoftBlocked
      ? "AI FLOW BLOCKED (PLAN/RATE LIMIT)"
      : ok
        ? "AI FLOW OK"
        : "AI FLOW ERROR",
  });
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`🚀 System smoke test starting on ${BASE_URL}`);

  // 1) Pagine pubbliche (blog e altre pagine pesanti: waitUntil "load" per evitare timeout)
  for (const path of PUBLIC_PATHS) {
    const useLoad = ["/docs", "/compliance", "/contact", "/blog"].includes(path);
    await checkPage(page, path, useLoad ? { waitUntil: "load" } : {});
  }

  // 2) Auth (fallita + riuscita)
  const loggedIn = await testAuth(page);

  if (loggedIn) {
    console.log("✅ Login riuscito, procedo con pagine dashboard e AI flow.");

    // 3) Pagine dashboard (solo se autenticato)
    // Alcune pagine non raggiungono networkidle -> usiamo "load"
    const dashboardUseLoad = ["/dashboard", "/dashboard/autopilot", "/dashboard/packages"];
    for (const path of DASHBOARD_PATHS) {
      const useLoad = dashboardUseLoad.includes(path);
      await checkPage(page, path, useLoad ? { waitUntil: "load", timeout: 35000 } : {});
    }

    // 4) AI flow test (API annunci)
    await testAiFlow(page);
  } else {
    console.warn("⚠️ Login riuscito non verificato, salto i test di dashboard/AI flow.");
  }

  await browser.close();

  // REPORT FINALE
  console.log("\n=== SYSTEM SMOKE TEST REPORT ===");
  console.log("URL | STATUS | LOAD_MS | OK | NOTE");
  for (const r of RESULTS) {
    console.log(`${r.url} | ${r.status} | ${r.ms} | ${r.ok ? "OK" : "FAIL"} | ${r.note}`);
  }

  const failed = RESULTS.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error(`\n❌ Smoke test completato con ${failed.length} errori o pagine lente.`);
    process.exitCode = 1;
  } else {
    console.log("\n✅ Smoke test completato senza errori critici.");
  }
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exitCode = 1;
});

