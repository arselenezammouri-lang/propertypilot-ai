# REPORT DI STABILITÀ — FASE 1: KILLER FIXES

**Data:** 8 marzo 2026  
**Standard:** Diamond  
**Moduli in scope:** Billing, Contact Engine, Legal, Build Lock, Admin Security  

---

## 1. BILLING REPAIR — ✅ VERIFICATO

**Obiettivo:** Nessun conflitto Zod tra `{ planType }` e `{ plan }` nell’API checkout; pagamento fluido.

**File:** `app/api/stripe/checkout/route.ts`

- **Schema Zod:** `checkoutSchema` accetta entrambi i campi come opzionali:
  - `plan: z.enum(['STARTER','PRO','AGENCY']).optional()`
  - `planType: z.enum(['starter','pro','agency']).optional()`
  - `.refine(d => d.plan || d.planType, { message: 'plan or planType required' })` garantisce almeno uno presente.
- **POST:** `const planRaw = parsed.plan || (parsed.planType && parsed.planType.toUpperCase())` — unificazione coerente; poi validazione con `VALID_PLANS`.
- **GET:** query `?plan=...` normalizzata con `.toUpperCase()` e validata.

**Esito:** Conflitto risolto; API pronta per client che inviano `plan` o `planType`. Billing repair OK.

---

## 2. CONTACT ENGINE — ✅ VERIFICATO

**Obiettivo:** Integrazione Resend nel form contatti; richieste clienti in casella mail.

**File:** `app/api/contact/route.ts`, `lib/resend-client.ts`

- **Resend:** `getResendClient()` da `lib/resend-client.ts` (credenziali da `RESEND_API_KEY` / `RESEND_FROM_EMAIL` o Replit Connectors).
- **Invio:** `client.emails.send({ from, to, replyTo, subject, html })` — destinatario da `CONTACT_EMAIL` o `RESEND_FROM_EMAIL` o fallback `support@propertypilot.ai`.
- **Error handling:** catch su invio email → 503 e messaggio locale (it/en); rate limit e validazione Zod già presenti.

**Esito:** Contact engine integrato con Resend. Configurare `RESEND_API_KEY` e `RESEND_FROM_EMAIL` (e opzionale `CONTACT_EMAIL`) in produzione.

---

## 3. LEGAL INTEGRITY — ✅ VERIFICATO

**Obiettivo:** Link `/terms` e `/privacy` nella signup funzionanti e corretti.

**File:** `app/auth/signup/page.tsx`, `app/terms/page.tsx`, `app/privacy/page.tsx`

- **Signup:** Testo “accetto i termini” con:
  - `<Link href="/terms">` (Terms of Service)
  - `<Link href="/privacy">` (Privacy Policy)
- **Route:** Esistono `app/terms/page.tsx` e `app/privacy/page.tsx` — link risolvono correttamente.

**Esito:** Legal integrity rispettata; nessuna modifica necessaria.

---

## 4. BUILD LOCK — ✅ APPLICATO (verifica build in corso)

**Obiettivo:** Disattivare `ignoreBuildErrors` e `ignoreDuringBuilds`; build deve segnalare ogni errore TS/ESLint reale fino a “Pure Green”.

**File:** `next.config.mjs`

- **Modifiche applicate:**
  - `typescript.ignoreBuildErrors: false`
  - `eslint.ignoreDuringBuilds: false`
- **Nota:** Con type-check e lint attivi il build può richiedere più tempo e memoria. Su ambiente locale il build è stato avviato; la conferma “Pure Green” va ottenuta lasciando completare `npm run build` in locale o verificando il build su Vercel. Eventuali errori emersi vanno corretti fino a build verde.

**Esito:** Configurazione BUILD LOCK applicata. Eseguire `npm run build` fino a completamento e risolvere eventuali errori TypeScript/ESLint segnalati.

---

## 5. ADMIN SECURITY — ✅ VERIFICATO

**Obiettivo:** Nessun secret hardcoded in `/api/admin/force-login`; uso di variabile d’ambiente (es. `SESSION_SECRET`).

**File:** `app/api/admin/force-login/route.ts`

- **Secrets:** `validSecrets = [process.env.SESSION_SECRET, process.env.ADMIN_FORCE_LOGIN_SECRET].filter(Boolean)` — nessun valore hardcoded.
- **Controllo:** `secret` in query confrontato con `validSecrets`; in assenza o non match → 401.

**Esito:** Admin security OK. In produzione impostare `SESSION_SECRET` e/o `ADMIN_FORCE_LOGIN_SECRET`.

---

## RIEPILOGO

| # | Modulo           | Stato      | Azione effettuata                          |
|---|------------------|------------|--------------------------------------------|
| 1 | Billing Repair   | ✅ OK      | Verificato schema e POST/GET checkout      |
| 2 | Contact Engine   | ✅ OK      | Verificata integrazione Resend             |
| 3 | Legal Integrity  | ✅ OK      | Verificati link /terms e /privacy in signup|
| 4 | Build Lock       | ✅ Applicato| ignoreBuildErrors/ignoreDuringBuilds = false; build da portare a Pure Green |
| 5 | Admin Security   | ✅ OK      | Verificato uso sole env per secrets        |

---

## RACCOMANDAZIONI POST-FASE 1

1. **Build:** Completare `npm run build` in locale o su Vercel e correggere eventuali errori TypeScript/ESLint fino a “Pure Green”.
2. **Env (Vercel / .env.local):** Verificare presenza di: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL` (opzionale), `SESSION_SECRET` e/o `ADMIN_FORCE_LOGIN_SECRET`, Stripe e Supabase già configurati.
3. **Test manuali:** Checkout (plan + planType), form contatti (invio email), signup (click su Terms/Privacy), force-login con secret da env.

**Firma:** Fase 1 Killer Fixes verificata e BUILD LOCK applicato. Procedere al marketing solo dopo conferma build “Pure Green” e test sopra indicati.
