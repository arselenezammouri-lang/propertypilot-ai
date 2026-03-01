# FOUNDER OPERATIONAL MANUAL

Manuale operativo per configurare e far funzionare PropertyPilot AI. Segui ogni sezione nell'ordine.

---

## 1. SUPABASE

### 1.1 URL e Redirect

**Supabase Dashboard → Authentication → URL Configuration**

- **Site URL:** `https://propertypilot-ai.vercel.app`
- **Redirect URLs** (aggiungi tutte):
  - `https://propertypilot-ai.vercel.app/**`
  - `https://propertypilot-ai.vercel.app/auth/callback`
  - `http://localhost:3000/**` (se fai test locali)

### 1.2 Tabelle necessarie

Le tabelle principali usate dal SaaS:

| Tabella | Scopo |
|---------|-------|
| `profiles` | Profili utente (full_name, subscription_plan, location, city, country) |
| `subscriptions` | Abbonamenti Stripe (stripe_subscription_id, price_id, status, current_period_start/end) |
| `external_listings` | Listing da scraper/prospecting (titolo, prezzo, owner_name, phone_number, status) |
| `leads` | Lead CRM (name, email, phone, status, score) |
| `purchases` | Acquisti one-shot (package boost, ecc.) |
| `prospecting_filters` | Filtri di ricerca per automazione |

### 1.3 Variabili Vercel

| Variabile | Dove prenderla |
|-----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (service_role, mai esporre al client) |

### 1.4 Trigger Auth

Dopo signup, Supabase crea l'utente in `auth.users`. Il codice usa `auth.setup-user` e trigger per creare/aggiornare `profiles` e `subscriptions` (record iniziale free). Se manca il trigger, verifica che esista un handler in `app/api/auth/setup-user/route.ts` chiamato da `auth/callback`.

---

## 2. STRIPE

### 2.1 Prodotti e Price ID

**Stripe Dashboard → Products**

Crea questi prodotti con prezzi ricorrenti mensili:

| Piano | Prezzo | Variabile Vercel |
|-------|--------|------------------|
| Starter | €197/mese | `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` |
| Pro | €497/mese | `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` |
| Agency | €897/mese | `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID` |
| Agency Boost (one-time) | da configurare | `NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID` |

Ogni prodotto deve avere un **Price** con `recurring: monthly`. Copia il `price_xxxxx` e impostalo su Vercel.

### 2.2 Webhook

**Stripe Dashboard → Developers → Webhooks → Add endpoint**

- **Endpoint URL:** `https://propertypilot-ai.vercel.app/api/stripe/webhook`
- **Eventi da ascoltare:**
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

- **Signing secret:** Copia il valore `whsec_...` e impostalo come `STRIPE_WEBHOOK_SECRET` su Vercel.

### 2.3 Variabili Vercel

| Variabile | Dove prenderla |
|-----------|----------------|
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (o `sk_test_` per test) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → API keys (pk_test_ o pk_live_) |
| `STRIPE_WEBHOOK_SECRET` | Dalla creazione del webhook (whsec_...) |

### 2.4 Flusso pagamento

1. L'utente clicca "Scegli Piano" → `/api/stripe/checkout` crea una Checkout Session.
2. Stripe reindirizza alla checkout.
3. Al completamento, Stripe invia `checkout.session.completed` al webhook.
4. Il webhook aggiorna `subscriptions` e `profiles.subscription_plan` in Supabase.

Se un pagamento non si riflette nel piano, controlla i log di Stripe (Developers → Webhooks → log eventi) e verifica che il webhook risponda 200.

---

## 3. BLAND AI (Voice Agent)

### 3.1 API Key

**Bland AI Dashboard** → API Keys

- Copia l'API key e impostala come `BLAND_AI_API_KEY` su Vercel.

### 3.2 Webhook callback

Le chiamate Voice AI usano un webhook URL costruito dinamicamente:

```
https://propertypilot-ai.vercel.app/api/prospecting/call/webhook?listing_id={listing_id}
```

Il `listing_id` viene passato nella query string quando si avvia la chiamata da `/api/prospecting/call`. Non serve configurare un webhook globale su Bland AI: l'URL viene incluso in ogni richiesta di chiamata.

### 3.3 Parametri di chiamata

Il codice usa:
- `model: 'enhanced'`
- `voicemail_detection: true`
- `temperature: 0.7`
- `interruption_threshold: 500` (ms)

Se le chiamate non partono, verifica `BLAND_AI_API_KEY` e che il listing abbia `phone_number` valorizzato.

---

## 4. RESEND (Email)

### 4.1 Account e Dominio

1. Crea account su [resend.com](https://resend.com).
2. **Domini** → Aggiungi dominio (es. `propertypilot.ai`).
3. Aggiungi i record DNS richiesti (MX, TXT, ecc.) per verificare il dominio.

### 4.2 API Key

**Resend Dashboard → API Keys** → Create API Key

- Imposta su Vercel: `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`: es. `noreply@propertypilot.ai` (deve essere su dominio verificato)

### 4.3 Template usati

Il codice usa template inline in `lib/email-templates.ts` e `lib/utils/email.ts`:
- Welcome email (signup)
- Password reset
- Upgrade nudge
- Notifiche appuntamento (post-chiamata Voice AI)

Non servono template pre-configurati su Resend: tutto è inline nel codice.

---

## 5. OPENAI

**Variabile:** `OPENAI_API_KEY`

- Dashboard OpenAI → API Keys → Create new secret key.
- Imposta su Vercel.

Usata per: Aria Coach, generazione listing, follow-up AI, Voice script, ecc.

---

## 6. MONITORAGGIO E TROUBLESHOOTING

### 6.1 Come capire se un cliente ha problemi

1. **Vercel Logs:** Dashboard → Logs → cerca errori 500 o eccezioni.
2. **Supabase Logs:** Dashboard → Logs → query lente o errori RLS.
3. **Stripe:** Dashboard → Customers (cerca per email) → Payments, Subscriptions.
4. **Email non arrivano:** Verifica Resend Dashboard → Emails (status: delivered/failed).

### 6.2 Checklist rapida

| Problema | Controlla |
|---------|-----------|
| Pagamento non aggiorna piano | Stripe Webhooks → ultimo evento → response 200? |
| Aria non risponde | `OPENAI_API_KEY` + Supabase `profiles` per user |
| Voice call non parte | `BLAND_AI_API_KEY` + listing con `phone_number` |
| Email non partono | `RESEND_API_KEY` + `RESEND_FROM_EMAIL` su dominio verificato |
| Login redirect sbagliato | Supabase Auth → Redirect URLs |

### 6.3 Variabili obbligatorie minime

Per un funzionamento base:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Price IDs (Starter, Pro, Agency)

Opzionali ma consigliati:
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (welcome email, password reset)
- `BLAND_AI_API_KEY` (Voice AI Prospecting)

---

## 7. CONTATTI E REFERENZE

- **Codice principale:** `app/api/` per le route API.
- **Stripe webhook logic:** `app/api/stripe/webhook/route.ts`
- **Bland AI call:** `app/api/prospecting/call/route.ts` + `lib/ai/voice-agent.ts`
- **Email:** `lib/resend-client.ts`, `lib/email-templates.ts`, `lib/utils/email.ts`
- **Aria:** `app/api/aria/chat/route.ts`, `lib/ai/aria-brain.ts`

---

*Ultimo aggiornamento: Diamond Refactoring 2.0*
