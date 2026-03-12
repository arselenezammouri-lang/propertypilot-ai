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

async function checkPage(page, path, opts = {}) {
  const url = `${BASE_URL}${path}`;
  const start = Date.now();

  try {
    const response = await page.goto(url, { waitUntil: "networkidle" });
    const duration = Date.now() - start;
    const status = response?.status() ?? 0;

    const okStatus = status < 400;
    const withinTime = duration <= 3000;

    RESULTS.push({
      url,
      status,
      ms: duration,
      ok: okStatus && withinTime,
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
  // Tentativo di login fallito
  const loginUrl = `${BASE_URL}/auth/login`;
  await page.goto(loginUrl, { waitUntil: "networkidle" });

  // I selettori sono generici per non dipendere troppo dal layout
  await page.fill('input[type="email"]', "wrong@example.com");
  await page.fill('input[type="password"]', "wrong-password");
  await page.click('button:has-text("Login"), button:has-text("Accedi")').catch(() => {});

  // Attendi eventuale messaggio di errore (non è obbligatorio trovarlo, basta che non crashi)
  await page.waitForTimeout(1000);

  // Login riuscito solo se abbiamo credenziali di test
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    console.warn("TEST_EMAIL / TEST_PASSWORD non impostate: salto il login riuscito.");
    return false;
  }

  // Pulisci il form
  await page.goto(loginUrl, { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', TEST_EMAIL);
  await page.fill('input[type="password"]', TEST_PASSWORD);
  await page.click('button:has-text("Login"), button:has-text("Accedi")');

  // Consideriamo login riuscito se arriviamo in dashboard senza errori 4xx/5xx
  await page.waitForLoadState("networkidle");
  const current = page.url();
  return current.includes("/dashboard");
}

async function testAiFlow(page) {
  // Usa API interno titles per non consumare troppi crediti
  const ctx = page.request;
  const response = await ctx.post(`${BASE_URL}/api/generate-titles`, {
    data: {
      locale: "en",
      listingTitle: "Test Listing for Smoke Test",
      propertyType: "apartment",
      portal: "generic",
    },
  });

  const ok = response.ok();
  const status = response.status();
  if (!ok) {
    console.error(`AI FLOW TEST FAILED: status=${status}`);
  } else {
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
    note: ok ? "AI FLOW OK" : "AI FLOW ERROR",
  });
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`🚀 System smoke test starting on ${BASE_URL}`);

  // 1) Pagine pubbliche
  for (const path of PUBLIC_PATHS) {
    await checkPage(page, path);
  }

  // 2) Auth (fallita + riuscita)
  const loggedIn = await testAuth(page);

  if (loggedIn) {
    console.log("✅ Login riuscito, procedo con pagine dashboard e AI flow.");

    // 3) Pagine dashboard (solo se autenticato)
    for (const path of DASHBOARD_PATHS) {
      await checkPage(page, path);
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

