import { defineConfig, devices } from '@playwright/test';

/**
 * Base URL per i test:
 * - `PLAYWRIGHT_BASE_URL` (es. staging): nessun webServer locale; i test colpiscono quell’host.
 * - altrimenti: `http://127.0.0.1:3000` e Playwright avvia (o riusa) `npm run dev`.
 */
const localTestBase = 'http://127.0.0.1:3000';
const externalBase = process.env.PLAYWRIGHT_BASE_URL?.replace(/\/$/, '');
const resolvedBaseURL = externalBase ?? localTestBase;

/**
 * Playwright E2E Test Configuration
 * 
 * Testa i flussi critici end-to-end:
 * - Signup → Login → Checkout → Webhook
 * - Generazione contenuto AI
 * - Rate limiting
 */
export default defineConfig({
  testDir: './e2e',

  /** Max duration per test (Playwright 1.58+: top-level, not under `use`). */
  timeout: 30_000,

  /* Run tests in files in parallel */
  fullyParallel: false, // Sequential per evitare conflitti con database
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'e2e-results.json' }]
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: resolvedBaseURL,
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
    
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 10000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Uncomment per testare anche su altri browser
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Avvio locale solo se non usi uno staging via PLAYWRIGHT_BASE_URL */
  webServer: externalBase
    ? undefined
    : {
        command: 'npm run dev',
        url: localTestBase,
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
        stdout: 'ignore',
        stderr: 'pipe',
      },
});
