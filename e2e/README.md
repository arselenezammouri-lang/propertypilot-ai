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

`npm run smoke:public` — home (HTTP GET), auth (`/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/auth/reset-password`), marketing (`/platform`, `/features`, `/about`, `/demo`, `/pricing`, `/contatti`, `/compliance`), **`/blog`**, sample post **`/blog/come-scrivere-annunci-che-convertono`**, docs hub + sample article, legal **`/privacy`**, **`/terms`**, **`/refund`** — tutte con `#main-content` visibile dove applicabile.

## Note

- I test richiedono che il server di sviluppo sia in esecuzione
- Alcuni test richiedono un utente test configurato
- I test di checkout richiedono Stripe test mode
