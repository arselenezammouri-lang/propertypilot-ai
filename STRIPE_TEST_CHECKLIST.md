# Checklist test Stripe – PropertyPilot AI

Usa questa lista per testare tutto il flusso pagamenti **senza rischi** (ambiente Stripe in modalità test o con carte di test).

---

## 1. Script automatico (nessun pagamento)

Esegui lo Stripe smoke test (login + diagnose + generazione URL checkout):

```powershell
$env:TEST_EMAIL="tua-email@example.com"; $env:TEST_PASSWORD="tua-password"; node scripts/stripe-smoke-test.mjs
```

- [ ] **Diagnose OK** – Price IDs configurati (Starter, Pro, Agency)
- [ ] **Checkout Starter** – Risposta con `url` (redirect a Stripe)
- [ ] **Checkout Pro** – Risposta con `url`
- [ ] **Checkout Agency** – Risposta con `url`

Se qualcosa fallisce: controlla `.env.local` (o variabili su Vercel) per  
`NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`, `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`, `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID` e che l’utente sia loggato correttamente.

---

## 2. Webhook Stripe (obbligatorio per sbloccare i piani dopo il pagamento)

Senza webhook, dopo il pagamento il DB non viene aggiornato e l’utente resta “Free”.

- [ ] **Stripe Dashboard** → Developers → Webhooks → Endpoint:  
  `https://propertypilot-ai.vercel.app/api/stripe/webhook`
- [ ] **Eventi** almeno:  
  `checkout.session.completed`,  
  `customer.subscription.created`,  
  `customer.subscription.updated`,  
  `customer.subscription.deleted`
- [ ] **Secret** copiato in Vercel (e in `.env.local` per test locali) come `STRIPE_WEBHOOK_SECRET`
- [ ] **Test** da Dashboard: “Send test webhook” → es. `checkout.session.completed` → risposta 200 (e nessun errore in Vercel logs)

---

## 3. Flusso completo con carta di test (Stripe test mode)

Solo se usi **chiavi Stripe in modalità test** (es. `pk_test_...` / `sk_test_...`).

- [ ] **Login** su https://propertypilot-ai.vercel.app
- [ ] **Billing** (`/dashboard/billing`) → clic “Upgrade” su uno dei piani (es. Starter)
- [ ] **Redirect** a Stripe Checkout
- [ ] **Pagamento** con carta di test:  
  `4242 4242 4242 4242`  
  Scadenza qualsiasi futura, CVC qualsiasi (es. 123), CAP qualsiasi
- [ ] **Redirect** a `/dashboard?success=true`
- [ ] **Verifica** in dashboard/billing: piano aggiornato (es. “Starter” invece di “Free”)
- [ ] **Diagnose** (opzionale): apri in una tab  
  `https://propertypilot-ai.vercel.app/api/stripe/diagnose`  
  (devi essere loggato): controlla che non ci siano issue e che `stripe_subscription_id` e `price_id` siano valorizzati

---

## 4. Altri flussi da testare (cosa “manca” spesso)

- [ ] **Stripe Customer Portal** – Billing → “Gestisci abbonamento” (o simile): si apre il portale Stripe (gestione carta, fatture, cancellazione).
- [ ] **Upgrade piano** – Da Starter a Pro (o Pro → Agency): bottone upgrade, redirect/aggiornamento e differenza addebitata correttamente.
- [ ] **Cancellazione** – Da Billing: “Cancella abbonamento”; alla scadenza il piano torna Free (o stato “cancelled”) e le feature bloccate.
- [ ] **Agency Boost (one-shot)** – Se usi il pacchetto “Agency Boost” / Titanium: link o bottone che porta a `/api/stripe/checkout-oneshot?package=boost` (o POST a `checkout-oneshot` con `packageId: 'boost'`): checkout one-time, non subscription.

---

## 5. Variabili d’ambiente minime

| Variabile | Uso |
|-----------|-----|
| `STRIPE_SECRET_KEY` | API Stripe (checkout, customer, webhook verify) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Frontend (Stripe.js se usato) |
| `STRIPE_WEBHOOK_SECRET` | Verifica firma webhook (whsec_...) |
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | Price ID piano Starter (price_...) |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Price ID piano Pro |
| `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID` | Price ID piano Agency |

In produzione usa le chiavi **live** e un webhook **live**; per i test usa chiavi e webhook **test**.

---

Quando tutti i punti sopra sono OK, Stripe può essere considerato testato e pronto per il lancio (con monitoraggio dei webhook e dei log dopo i primi pagamenti reali).
