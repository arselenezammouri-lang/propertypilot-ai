# Checklist deploy Vercel — PropertyPilot AI

Usa questo elenco quando porti il SaaS da **locale** a **produzione** (e per ogni nuovo ambiente: staging, preview).

## 1. Variabili obbligatorie (core)

Copia da `.env.example` e verifica su **Vercel → Project → Settings → Environment Variables** (Production / Preview se servono valori diversi):

| Variabile | Note |
|-----------|------|
| `NEXT_PUBLIC_APP_URL` | URL pubblico finale, es. `https://tuodominio.com` |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo server; mai nel client |
| Stripe (`STRIPE_*`, `NEXT_PUBLIC_STRIPE_*`, price IDs) | Live in produzione; test su preview se serve |
| `OPENAI_API_KEY` | Produzione |
| `RESEND_*`, `CONTACT_EMAIL` | Email transazionali |
| `BLAND_AI_*` | Se usi Voice AI |

## 2. Sicurezza API & browser (da impostare in produzione)

| Variabile | Quando |
|-----------|--------|
| `API_STRICT_BROWSER_ORIGIN` | `true` in **Production** — blocca POST/PUT/PATCH da browser con `Origin` non attendibile (vedi sotto). |
| `API_ALLOWED_ORIGINS` | Origini extra consentite (comma-separated): **preview Vercel**, **staging**, domini alias. Esempio: `https://propertypilot-xxx.vercel.app,https://staging.tuodominio.com` |
| `API_EMBED_ALLOWED_ORIGINS` | Solo se usi **form embed** sul sito del cliente: `https://www.agenzia-cliente.com`. Se vuoto, `/api/public/lead-capture` non applica il vincolo embed. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Entrambe in produzione per captcha login/signup |
| `EDGE_API_RATE_LIMIT_*` | Opzionale: tuning rate limit edge |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | **Opzionale ma consigliato** su Vercel multi-replica: limite globale per IP (`pp:mw:api`) + secondo bucket **più stretto** per route AI costose (`pp:mw:ai`, vedi `EDGE_AI_RATE_LIMIT_*`). Se assenti, restano i limiti in-memory per istanza. |
| `EDGE_AI_RATE_LIMIT_MAX` / `EDGE_AI_RATE_LIMIT_WINDOW_MS` | Default **30 richieste / minuto / IP** su path AI costosi (lista in `lib/security/ai-costly-api-path.ts`). |
| `EDGE_AI_USER_RATE_LIMIT_*` | Default **20 / minuto / utente loggato** (stessi path, solo POST con cookie sessione). Prefisso Redis `pp:mw:aiu`. Disattiva con `EDGE_AI_USER_RATE_LIMIT_ENABLED=false`. |
| `SECURITY_AUDIT_IP_SALT` | Stringa lunga casuale: abilita `ip_hash` negli audit JSON (stesso utente = stesso hash finché non ruoti il salt) |
| `SECURITY_AUDIT_LOG` | `true` (default in prod) / `false` per disattivare le righe `type":"security_audit"` |

## 3. Content-Security-Policy (Report-Only)

- In produzione è attiva di default (`next.config.mjs`).
- Opzionale: `CSP_REPORT_URI` verso un endpoint che riceve i report.
- Dopo il deploy: controlla la console browser per violazioni CSP e aggiorna `lib/security/content-security-policy.cjs` se aggiungi script terzi.

## 4. Verifiche post-deploy

- [ ] Login / signup con Turnstile (se chiavi impostate)
- [ ] Checkout Stripe (test o live secondo ambiente)
- [ ] Webhook Stripe raggiungibile (`/api/stripe/webhook`)
- [ ] Form contatti `/api/contact` da **solo** il tuo dominio (con `API_STRICT_BROWSER_ORIGIN=true`)
- [ ] Lead capture embed: test da dominio in `API_EMBED_ALLOWED_ORIGINS`
- [ ] Log Vercel: cerca righe `"type":"security_audit"` per eventi edge (bot, rate limit) e origine rifiutata

## 5. Documentazione correlata

- [SECURITY_HARDENING.md](./SECURITY_HARDENING.md)
- [OPERATIONS_SECURITY.md](./OPERATIONS_SECURITY.md) — WAF, log drain, Dependabot, audit npm
- [SETUP.md](./SETUP.md)
