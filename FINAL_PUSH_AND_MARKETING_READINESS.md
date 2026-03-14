# Quando fare il push finale su Stripe e iniziare il marketing

> PropertyPilot AI – Checklist di readiness prima del lancio commerciale.

---

## 1. Cosa significa “push finale su Stripe”

- **Non** è un push di codice su Git: è il passaggio a **Stripe in modalità LIVE** (chiavi `pk_live_` / `sk_live_`) e **pagamenti reali**.
- Prima di quel passaggio conviene aver completato i test sotto e aver fatto almeno un pagamento di prova in **modalità test** (carta `4242...`).

---

## 2. Checklist prima del push Stripe LIVE e del marketing

Spunta quando è fatto. Quando tutto è OK, puoi considerarti pronto.

### Infrastruttura e configurazione

- [ ] **Stripe Dashboard**
  - Modalità **LIVE** attiva.
  - Prodotti e prezzi creati per Starter (197€), Pro (497€), Agency (897€).
  - Webhook LIVE configurato: `https://propertypilot-ai.vercel.app/api/stripe/webhook` con eventi: `checkout.session.completed`, `customer.subscription.created/updated/deleted`.
  - Variabile **STRIPE_WEBHOOK_SECRET** (LIVE) impostata su Vercel e in `.env.local` per test locali.

- [ ] **Vercel**
  - Variabili d’ambiente LIVE impostate: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_*_PRICE_ID` (Starter, Pro, Agency).
  - Deploy stabile (nessun errore in build e in runtime).

- [ ] **Supabase**
  - Auth funzionante (signup, login, logout).
  - Tabelle `profiles`, `subscriptions` e altre usate dall’app esistono e sono allineate al codice (migrazioni applicate).

### Test automatici (da terminale)

- [ ] **Suite completa** (usa `.env.test` con TEST_EMAIL e TEST_PASSWORD, poi un solo comando):
  ```powershell
  npm run test:smoke
  ```
  Oppure a mano: `$env:TEST_EMAIL="tua-email"; $env:TEST_PASSWORD="tua-password"; node scripts/run-all-smoke-tests.mjs`
  - System smoke test: **tutti OK** (nessun FAIL).
  - Stripe smoke test: **Login OK**, **Diagnose OK**, **Checkout starter/pro/agency OK** (e eventuale nota “account founder” se applicabile).

- [ ] **Stripe smoke test da solo** (opzionale): `npm run test:smoke` esegue già entrambi; per solo Stripe: imposta TEST_EMAIL/TEST_PASSWORD e `node scripts/stripe-smoke-test.mjs`.
  - Deve completare senza crash (login ora ha un retry).

### Test manuale umano

- [ ] **MANUAL_TEST_CHECKLIST.md** usato almeno una volta:
  - Auth (signup, login, forgot password).
  - Billing: pagina carica, avvio checkout senza “Profile not found”.
  - Dashboard e piani (Agency vs Starter/Pro, Map, CRM, Prospecting).
  - Tool AI (annunci, Perfect Copy, follow-up, titles).
  - Navigazione senza 404, cambio lingua/tema, pagine pubbliche (home, pricing, blog, contatti, privacy, terms).

### Test con TestSprite (se disponibile)

- [ ] In una **nuova chat Agent** con **TestSprite MCP** attivo hai lanciato:
  - *“Testa tutto il SaaS PropertyPilot AI con TestSprite. Base URL: https://propertypilot-ai.vercel.app. Segui TEST_PLAN.md (auth, billing, founder Agency, AI tools, Voice AI). Esegui i test e riportami il report pass/fail.”*
- [ ] Hai ricevuto un report e eventuali **FAIL** sono stati corretti o accettati con priorità bassa.

### Pagamento di prova (consigliato prima del LIVE)

- [ ] Con **Stripe in modalità TEST** (chiavi `pk_test_` / `sk_test_`):
  - Login → Billing → avvio checkout per un piano (es. Starter).
  - Completamento pagamento con carta di test `4242 4242 4242 4242`.
  - Redirect a `/dashboard?success=true` e piano aggiornato in Billing (es. “Starter”).
  - (Opzionale) Verifica su Stripe Dashboard che l’abbonamento e il webhook siano registrati.

---

## 3. Quando puoi fare il “push finale” su Stripe e iniziare il marketing

- **Push Stripe LIVE**: quando la checklist sopra è soddisfatta (in particolare: webhook LIVE, variabili LIVE su Vercel, test automatici verdi, test manuale senza blocchi, eventuale pagamento di prova in test).
- **Marketing**: quando, oltre a quanto sopra, ti senti sicuro su:
  - Messaggio e landing (copy, pricing, CTA).
  - Supporto (email, FAQ o pagina contatti) per le prime richieste.

Non c’è un “unico” comando: è il fatto di aver completato la checklist e aver verificato un flusso di pagamento (almeno in test) che ti autorizza a passare al LIVE e al lancio.

---

## 4. Dopo il go-live

- Controlla i **log Vercel** e **Stripe Dashboard → Webhooks** dopo i primi pagamenti reali.
- Se un cliente segnala “Profile not found” o errore al checkout, verifica:
  - Log dell’API `/api/stripe/checkout` e `/api/stripe/webhook`.
  - Che il webhook riceva gli eventi e risponda 200 (nessun errore 4xx/5xx).

---

## 5. Riferimenti rapidi

| Documento | Uso |
|-----------|-----|
| **TEST_PLAN.md** | Scenari per TestSprite / test end-to-end (auth, billing, Agency, AI, Voice, zero-data). |
| **MANUAL_TEST_CHECKLIST.md** | Test manuale umano (click, login, form, UI). |
| **STRIPE_TEST_CHECKLIST.md** | Verifica Stripe (script, webhook, carta di test, variabili). |

Quando tutti i punti rilevanti della checklist sono spuntati, puoi procedere con il **push Stripe LIVE** e l’**avvio del marketing** con buona sicurezza.
