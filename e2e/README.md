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
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

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
- **checkout-flow.spec.ts**: Test del flusso di checkout
- **webhook-verification.spec.ts**: Verifica endpoint webhook
- **ai-generation-flow.spec.ts**: Test generazione contenuto AI

## Note

- I test richiedono che il server di sviluppo sia in esecuzione
- Alcuni test richiedono un utente test configurato
- I test di checkout richiedono Stripe test mode
