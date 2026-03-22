# Smoke test — staging / preview (Fase D2)

Esegui **dopo ogni deploy** su Vercel (Preview o Production) prima di annunciare la release. Non sostituisce i test automatici in CI: serve a catturare regressioni di ambiente (env, dominio, cookie, Turnstile).

## Prerequisiti

- URL base del deploy (es. `https://xxx.vercel.app` o dominio custom).
- Browser pulito o finestra anonima per il primo giro (cookie/sessione).

## Checklist rapida (~10 min)

1. **Home marketing** — `GET /` carica senza errori console critici.
2. **Auth** — `/auth/login` e `/auth/signup` si aprono; con Turnstile attivo, verifica che il widget compaia e che login/signup funzionino (o che il messaggio di misconfigurazione sia chiaro in dev).
3. **Dashboard** — dopo login, `/dashboard` mostra header **Command Center** (o equivalente lingua) e nessun errore rosso in console.
4. **API sensibili** — da browser loggato, apri uno strumento leggero (es. `/dashboard/listings` o Perfect Copy) e verifica che le chiamate `GET /api/user/usage` o simili rispondano **200** (non 403 per `Origin` se `API_STRICT_BROWSER_ORIGIN=true` — in tal caso l’origine del deploy deve essere in `API_ALLOWED_ORIGINS`).
5. **Stripe** — su ambiente test: checkout da `/dashboard/billing` fino al redirect; webhook raggiungibile (vedi [VERCEL_DEPLOY_CHECKLIST.md](./VERCEL_DEPLOY_CHECKLIST.md)).
6. **Sicurezza** — in log (Vercel / drain), assenza di spike anomali; eventuali righe `"type":"security_audit"` coerenti con traffico reale.

## Automazione locale (opzionale)

Con server in esecuzione e credenziali in `.env.local`:

```bash
npm run test:e2e -- e2e/smoke-public.spec.ts
```

I test marcati `@smoke` che richiedono login restano **skipped** senza variabili E2E (vedi file spec).

## Riferimenti

- [VERCEL_DEPLOY_CHECKLIST.md](./VERCEL_DEPLOY_CHECKLIST.md)
- [OPERATIONS_SECURITY.md](./OPERATIONS_SECURITY.md)
