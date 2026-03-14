# Piano completo Network & SaaS – PropertyPilot AI

Documento di riferimento per allineamento della layer di rete, API, variabili d’ambiente e avanzamento del SaaS. Obiettivo: **20/20** su coerenza, manutenibilità e readiness per produzione.

---

## 1. Executive summary

- **Network**: unificare URL base (APP_URL), client HTTP (fetch vs axios), forma delle risposte API e gestione errori lato client/server.
- **Auth API**: standardizzare l’accesso all’utente autenticato nelle route (helper centrale o `apiWrapper`).
- **Env**: un solo set di variabili documentate, `.env.example` e `.env.local.example` allineati (Stripe: STARTER/PRO/AGENCY/AGENCY_BOOST), script di validazione aggiornato.
- **SaaS**: chiarire automazioni vs regole CRM, usage/limits coerenti, roadmap multi-tenant/team.

---

## 2. Inventario layer di rete (stato attuale)

### 2.1 Client HTTP

| Dove | Cosa | Note |
|------|------|------|
| Frontend (pagine/componenti) | `fetch('/api/...')` su URL relativi; `lib/queryClient.ts` default queryFn | **Implementato**: `lib/api/client.ts` – `fetchApi<T>()` e tipo `ApiResponse<T>` per chiamate esplicite; `queryClient` e `apiRequest` resi sicuri su risposta non-JSON |
| Scraper | `axios` in `lib/scrapers/base-scraper.ts` | Timeout, retry, header custom – unico uso di axios |

**Stato**: helper frontend `fetchApi()` disponibile in `@/lib/api/client`; per mutation o fetch espliciti usare `fetchApi<T>(url, init)` per risposta tipata e gestione errori uniforme. Le query TanStack usano il default queryFn (ora robusto al non-JSON).

### 2.2 API routes (backend)

- **Auth**: ogni route usa `createClient()` da `@/lib/supabase/server` e `supabase.auth.getUser()`. Nessun middleware condiviso; pattern ripetuto in decine di file.
- **Wrapper esistente**: `lib/utils/api-wrapper.ts` – `apiWrapper(handler, { requireAuth, requireSubscription, requireProSubscription, validateBody, method })`. Usato in pochi endpoint; la maggior parte delle route non lo usa.
- **Errori**: `lib/errors/api-errors.ts` – `APIError`, `formatErrorResponse`, `toAPIError`. Non tutte le route restituiscono la stessa forma (alcune solo `error`, altre `error` + `message` con dettagli solo in dev).

**Raccomandazione**:
- Per le **nuove** route: usare sempre `apiWrapper` (o un helper centrale tipo `getAuthenticatedUser()` + stessa forma di risposta).
- Per le **esistenti**: migrazione graduale; intanto introdurre `getAuthenticatedUser()` in `lib/api/auth-helper.ts` e usarlo dove si refactora, così auth e 401 sono uniformi.

### 2.3 Servizi esterni (server-side)

| Servizio | Configurazione | File principali |
|----------|----------------|-----------------|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/server.ts`, `client.ts`, `middleware.ts`, `service.ts` |
| Stripe | `STRIPE_SECRET_KEY`, `TESTING_STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_*` | `lib/stripe/config.ts`, `lib/stripe.ts`, route sotto `app/api/stripe/` |
| OpenAI | `OPENAI_API_KEY` | Route generate*, translate, lead-score, agency-chatbot, aria, communications, automations, followup |
| Bland AI | `BLAND_AI_API_KEY` | `lib/ai/voice-agent.ts` |
| Resend | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | `lib/resend-client.ts`, contact, email-templates |
| Neon/Postgres | `DATABASE_URL` | `app/api/agency-branding/route.ts`, `app/api/generate-pdf/route.ts` |

Tutti questi devono essere documentati in `.env.example` / `.env.local.example` e, dove sensato, controllati da `scripts/validate-env.js`.

### 2.4 URL base dell’app (APP_URL)

- **Variabile**: `NEXT_PUBLIC_APP_URL`.
- **Fallback** ripetuto in molti file: `process.env.NEXT_PUBLIC_APP_URL || 'https://propertypilot-ai.vercel.app'` (o `request.nextUrl.origin` in alcune API).
- **File coinvolti**: `app/layout.tsx`, `app/auth/forgot-password/page.tsx`, `app/dashboard/crm/settings/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/api/admin/force-login/route.ts`, `app/api/referral/route.ts`, `app/api/prospecting/call/route.ts`, `app/api/prospecting/call/webhook/route.ts`, `app/api/public/lead-capture/route.ts`, `lib/email-templates.ts`, script in `scripts/performance/`, `playwright.config.ts`.

**Raccomandazione**: introdurre `lib/env.ts` con `getAppUrl(request?: NextRequest)` (e opzionalmente `getBaseUrl()` per sitemap/robots) e sostituire tutti i fallback con questa funzione, così staging e produzione usano un solo punto di configurazione.

---

## 3. Allineamento e problemi di coerenza

### 3.1 Naming e duplicazione

| Problema | Dettaglio | Azione |
|----------|-----------|--------|
| Automations vs Rules | Due concetti: (1) Automazioni dashboard (`/api/automations`, `/api/automations/execute`), (2) Regole CRM (`/api/automations/rules`, `/api/automations/execute-rule`). Naming confondibile | Documentare in README/docs; opzionale: in futuro spostare regole sotto `/api/crm/automation-rules` |
| Auth: `authError` vs `userError` | Stesso pattern `getUser()` ma nome variabile diverso tra route | Standardizzare su `userError` o usare `getAuthenticatedUser()` che nasconde il dettaglio |
| Stripe price IDs | `.env.example` usa STARTER/PRO/AGENCY/AGENCY_BOOST; `.env.local.example` aveva PRO/BUSINESS (BUSINESS non usato nel codice) | Allineare `.env.local.example` a STARTER, PRO, AGENCY, AGENCY_BOOST come nel codice e in `.env.example` |

### 3.2 Variabili d’ambiente

| Problema | Azione |
|----------|--------|
| APP_URL ripetuto ovunque | `lib/env.ts` + `getAppUrl()` e sostituzione nei file elencati sopra |
| Supabase: alcuni punti accettano anche `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Decidere: o rimuovere i fallback e usare solo `NEXT_PUBLIC_*`, o documentarli in SETUP.md e in validate-env |
| Stripe price IDs non in validate-env | Aggiungere in validate-env un blocco “optional but recommended” per i 4 price ID (STARTER, PRO, AGENCY, AGENCY_BOOST) così il deploy non dimentica |

### 3.3 Forma delle risposte API

- **Backend**: definire forma standard: `{ success: boolean, data?: T, error?: string, message?: string }`. In dev si può aggiungere `details`.
- **Frontend**: un helper che fa `fetch`, controlla `response.ok`, parsa JSON, e in caso di errore legge `error`/`message` e gestisce 403 (es. “richiede abbonamento”) in modo uniforme. Evitare di assumere sempre JSON (es. 500 con HTML) per non avere parse error.

### 3.4 Subscription e usage

- **Subscription**: `lib/utils/subscription-check.ts` – `requireActiveSubscription` e `requireProOrAgencySubscription` già usati in alcune route premium (prospecting/call, lead-score). Verificare che **tutte** le funzionalità a pagamento (voice, virtual staging, lead score, ecc.) passino da uno di questi due o da `apiWrapper` con `requireSubscription`/`requireProSubscription`.
- **Usage**: `lib/utils/plan-features.ts` e `/api/user/usage` esistono; non c’è un unico “usage service” usato da ogni feature. Piano: audit delle feature premium e allineamento a un unico punto di verifica limiti (piano + usage).

---

## 4. Checklist funzionalità SaaS

| Area | Stato | Note |
|------|--------|------|
| Auth | ✅ | Supabase Auth; login, signup, forgot/reset, signout; middleware per `/dashboard`; API con getUser() per route |
| Billing | ✅ | Stripe: checkout, portal, cancel, reactivate, upgrade, one-shot, webhook; piani Free, Starter, Pro, Agency + Agency Boost |
| Usage / limiti | Parziale | Plan-features e subscription-check; limiti voice/listings; nessun usage service unificato per tutte le feature |
| Multi-tenant / workspace | Parziale | Dati per `user_id`; `user_workspace_settings`, “Workspace” in impostazioni; nessun org/team né team billing |
| API keys (CRM) | ✅ | `/api/crm/api-keys`, dashboard CRM |
| Form pubblici | ✅ | Contact, lead capture; rate limit su contact |
| Email | ✅ | Resend; RESEND_API_KEY, RESEND_FROM_EMAIL |
| Webhook in ingresso | ✅ | Stripe webhook; Bland AI call webhook |
| Admin / support | Parziale | `admin/force-login` con secret; nessun pannello admin né impersonation |
| Referral | ✅ | `/api/referral` + UI |
| i18n | ✅ | Locale provider, multi-lingua |

**Lacune prioritarie**

1. **Tenancy**: un utente = un account; per “Team fino a 10 agenti” (Agency) non c’è ancora modello team né ruoli. Roadmap: entità Organization/Team, ruoli, billing per team.
2. **Auth API centralizzata**: adozione estesa di `apiWrapper` o `getAuthenticatedUser()` per evitare duplicazione e garantire 401/403 uniformi.
3. **Risposta API e client frontend**: forma JSON standard + helper `fetchApi` per ridurre duplicazione e errori di parsing.
4. **Env e docs**: allineare `.env.example` e `.env.local.example`; tenere validate-env in sync; documentare eventuali variabili alternative (es. SUPABASE_URL).

---

## 5. Piano di implementazione (azioni concrete)

### Fase 1 – Env e URL (immediato)

1. **Creare `lib/env.ts`**
   - `getAppUrl(request?: NextRequest): string` – usa `NEXT_PUBLIC_APP_URL` o, se passato `request`, `request.nextUrl.origin`, altrimenti fallback `https://propertypilot-ai.vercel.app`.
   - Esportare costanti derivate se servono (es. per sitemap solo base URL).

2. **Sostituire** in tutti i file che usano `NEXT_PUBLIC_APP_URL || '...'` la lettura con `getAppUrl(request)` dove disponibile, altrimenti `getAppUrl()`.

3. **Allineare `.env.local.example`**
   - Stripe: `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`, `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`, `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID`, `NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID` (rimuovere BUSINESS).
   - Allineare commenti e sezioni a `.env.example` (Supabase, Stripe, OpenAI, App URL, optional).

4. **Aggiornare `scripts/validate-env.js`**
   - Aggiungere blocco “Stripe Price IDs (optional)” che avvisa se mancano i 4 price ID (per evitare checkout rotto in produzione).

### Fase 2 – Auth API (breve termine)

5. **Creare `lib/api/auth-helper.ts`**
   - `getAuthenticatedUser()`: crea client Supabase, fa `getUser()`, restituisce `{ user, supabase }` oppure `{ error: NextResponse }` (401). Così le route possono fare:
     - `const auth = await getAuthenticatedUser(); if (auth.error) return auth.error; const { user, supabase } = auth;`

6. **Documentare** in README o in questo piano: per le nuove API usare preferibilmente `apiWrapper`; per refactor graduali usare `getAuthenticatedUser()` e stessa forma di risposta (`success`, `data`, `error`).

7. **Migrare 2–3 route** ad alto traffico (es. leads, user/subscription) a `getAuthenticatedUser()` o `apiWrapper` come pilota; verificare che 401 e logging siano coerenti.

### Fase 3 – Forma risposta e client frontend (medio termine)

8. **Definire** in `lib/types/api.ts` (o in `api-errors`) il tipo standard:
   - `ApiResponse<T> = { success: true, data: T } | { success: false, error: string, message?: string }`.

9. **Aggiungere** `lib/api/client.ts` (o sotto `lib/utils/`):
   - `fetchApi<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>>`: fetch relativo, parse JSON, su !response.ok costruisce `{ success: false, error, message }` da body o status; gestione 401/403 opzionale (redirect o callback). Non obbligatorio migrare tutto subito: usarlo nelle nuove feature e dove si tocca il codice.

10. **Audit** delle route che restituiscono solo `{ error }` senza `success: false`: aggiungere `success: false` dove manca per coerenza (opzionale ma consigliato).

### Fase 4 – Subscription e usage (medio termine)

11. **Audit** di tutte le route “premium” (voice, virtual staging, lead score, automations, ecc.): assicurarsi che usino `requireActiveSubscription` o `requireProOrAgencySubscription` (o `apiWrapper` con requireSubscription/requireProSubscription).

12. **Documentare** in `lib/utils/plan-features.ts` o in un doc quale feature usa quale limite (listings/mese, voice calls, ecc.) e dove viene controllato.

13. **Piano usage unificato** (backlog): un modulo “usage” che le route chiamano prima di consumare una quota (es. voice call, generazione AI), così limiti e conteggi restano in un solo posto.

### Fase 5 – Automations vs CRM rules (documentazione)

14. **Aggiungere** in README o in `docs/` una sezione “Automations vs CRM rules”:
   - Automations = flussi dashboard (trigger, azioni).
   - CRM rules = regole automatiche su lead (es. assegnazione, stati) sotto CRM.
   - URL attuali: `/api/automations` vs `/api/automations/rules` e `/api/automations/execute-rule`.

### Fase 6 – Roadmap SaaS (multi-tenant, admin)

15. **Roadmap** (da tenere in questo doc o in ROADMAP.md):
    - Team/Organization: entità, ruoli, billing per team.
    - Admin: dashboard admin, impersonation utente (con audit log).
    - Webhook outbound: notifiche verso sistemi esterni (opzionale).

---

## 6. Verifica finale “20/20”

Prima di considerare chiuso il ciclo Network + SaaS:

- [ ] `lib/env.ts` esiste e tutti i riferimenti a `NEXT_PUBLIC_APP_URL` usano `getAppUrl()` dove possibile.
- [ ] `.env.local.example` e `.env.example` sono allineati (Stripe: STARTER/PRO/AGENCY/AGENCY_BOOST); validate-env avvisa per price ID mancanti.
- [ ] `lib/api/auth-helper.ts` con `getAuthenticatedUser()` disponibile; almeno 2–3 route migrate come esempio.
- [ ] Documentazione: README o docs spiegano Automations vs CRM rules; env documentate.
- [ ] Audit subscription: tutte le feature a pagamento protette da subscription check o apiWrapper.
- [ ] (Opzionale) `fetchApi` e tipo `ApiResponse` introdotti e usati in almeno un modulo nuovo.
- [ ] Nessun uso di `NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID` nel codice (solo PRO/AGENCY/STARTER/AGENCY_BOOST).

---

## 7. Riferimenti file

- **Supabase**: `lib/supabase/server.ts`, `client.ts`, `middleware.ts`, `service.ts`
- **Stripe**: `lib/stripe/config.ts`, `lib/stripe.ts`, `app/api/stripe/*`
- **Auth/wrapper**: `lib/utils/api-wrapper.ts`, (nuovo) `lib/api/auth-helper.ts`
- **Errori**: `lib/errors/api-errors.ts`
- **Subscription**: `lib/utils/subscription-check.ts`, `lib/utils/plan-features.ts`
- **Env**: `.env.example`, `.env.local.example`, `scripts/validate-env.js`, (nuovo) `lib/env.ts`

Fine del piano. Aggiornare questo documento quando si completano fasi o si aggiungono decisioni architetturali.
