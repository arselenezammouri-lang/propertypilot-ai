# E2E Tests - PropertyPilot AI

Test end-to-end per verificare i flussi critici dell'applicazione.

## Setup

1. Installare dipendenze:
```bash
npm install
```

2. Installare browser Playwright:
```bash
npx playwright install
```

## Configurazione

Crea un file `.env.local` con:
```env
E2E_TEST_EMAIL=test@example.com
E2E_TEST_PASSWORD=TestPassword123!
# opzionale (founder / agency su localhost):
E2E_FOUNDER_EMAIL=...
E2E_FOUNDER_PASSWORD=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Per caricare `.env.local` da shell:
```bash
DOTENV_CONFIG_PATH=.env.local node -r dotenv/config npx playwright test e2e/dashboard-billing.spec.ts
```
oppure `npm run test:e2e:billing` (se le variabili sono già nell’ambiente).

## Eseguire i test

```bash
# Tutti i test
npm run test:e2e

# Con UI interattiva
npm run test:e2e:ui

# In modalità headed (vedi il browser)
npm run test:e2e:headed

# In modalità debug
npm run test:e2e:debug
```

## Test disponibili

- **auth-flow.spec.ts**: Test di autenticazione (signup, login)
- **dashboard-billing.spec.ts**: Login → `/dashboard/billing`, verifica card piano (`E2E_FOUNDER_*` o `E2E_TEST_*`)
- **dashboard-founder-agency.spec.ts**: Founder localhost → card piano Agency
- **checkout-flow.spec.ts**: Test del flusso di checkout
- **webhook-verification.spec.ts**: Verifica endpoint webhook
- **ai-generation-flow.spec.ts**: Test generazione contenuto AI

## Smoke pubblico (no login)

- **`npm run smoke:public`** — stesso elenco di route pubbliche; **`baseURL`** = `playwright.config` (`http://127.0.0.1:3000` di default). Playwright avvia **`npm run dev`** se la porta è libera (in CI sempre).
- **Staging:** `PLAYWRIGHT_BASE_URL=https://tuo-preview.vercel.app npm run smoke:public` — nessun server locale; i test colpiscono quell’host (serve app raggiungibile e env Supabase coerenti lato server).

## Pre-merge (locale o CI)

- **`npm run qa:premerge`** = `qa:launch` + `smoke:public` (come job GitHub **Pre-merge QA**).
- **`npm run qa:premerge:local`** = stesso flusso ma carica **`.env`** e **`.env.local`**, poi esegue **`test:e2e:billing`** solo se `E2E_FOUNDER_EMAIL`/`E2E_FOUNDER_PASSWORD` o `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD` sono valorizzati; altrimenti stampa un messaggio e termina con successo. Un solo comando prima del merge su laptop.
- Con **`npm run dev` acceso**: **`npm run check:connectivity`** — verifica `GET /api/health` e raggiungibilità Supabase (secondo terminale).

## Note

- **`smoke:public`** e **`qa:premerge`**: Playwright può avviare **`npm run dev`** da solo se la porta è libera (vedi `playwright.config.ts`).
- Altri test E2E possono richiedere il server già in esecuzione
- Alcuni test richiedono un utente test configurato
- I test di checkout richiedono Stripe test mode
