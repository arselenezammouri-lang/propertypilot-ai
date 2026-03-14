# PropertyPilot AI – Report test (TestSprite / smoke)

**Base URL:** https://propertypilot-ai.vercel.app  
**Data report:** 14 marzo 2025  
**Esecuzione:** system-smoke-test.mjs (Playwright). TestSprite MCP non disponibile in sessione; Stripe smoke richiede TEST_EMAIL/TEST_PASSWORD.

---

## Tabella: Scenario | Risultato | Messaggio chiave

| # | Scenario (TEST_PLAN) | Risultato | Messaggio chiave |
|---|----------------------|-----------|------------------|
| **A. Auth & Profile** | | | |
| 1 | Signup Free user → /dashboard, subscription free | **SKIP** | Richiede TestSprite o test manuale (signup + GET /api/user/subscription). |
| 2 | Login / Logout → redirect /dashboard | **PASS (parziale)** | Pagine /auth/login, /auth/signup, /auth/forgot-password → 200. Login con credenziali non eseguito (no TEST_EMAIL/TEST_PASSWORD). |
| **B. Billing – Starter / Pro / Agency** | | | |
| 3 | Starter checkout → redirect Stripe, no "Profile not found" | **SKIP** | Richiede login + click in UI o POST /api/stripe/checkout con cookie. Eseguire: `$env:TEST_EMAIL="..."; $env:TEST_PASSWORD="..."; node scripts/stripe-smoke-test.mjs` |
| 4 | Pro checkout | **SKIP** | Come sopra. |
| 5 | Agency checkout | **SKIP** | Come sopra. |
| **C. Founder Account – Agency** | | | |
| 6 | Agency access gates (badge, map, leads, prospecting) | **SKIP** | Richiede login come founder (account Agency). TestSprite o manuale. |
| **D. AI Tools** | | | |
| 7 | AI Listing Generation (listings tool) | **SKIP** | Richiede login + compilazione form. Pagine dashboard non visitate (no login). |
| 8 | Perfect Copy | **SKIP** | Come sopra. |
| 9 | Follow-up Emails | **SKIP** | Come sopra. |
| **E. Voice AI** | | | |
| 10 | Voice AI limit Pro (30 chiamate, 31ª → 403) | **SKIP** | TestSprite o manuale con utente Pro. |
| 11 | Voice AI illimitata Agency | **SKIP** | TestSprite o manuale con founder Agency. |
| **F. Zero-Data State** | | | |
| 12 | Cleanup e Empty States (listings, leads, prospecting) | **SKIP** | Richiede login; script `scripts/final-db-cleanup.mjs` su DB di prova. |

---

## Risultati eseguiti (14 marzo 2025)

### System smoke test – PASS

- **Pagine pubbliche (16):** tutte **200 OK**  
  `/`, `/about`, `/features`, `/pricing`, `/platform`, `/compliance`, `/contact`, `/contatti`, `/blog`, `/docs`, `/privacy`, `/refund`, `/terms`, `/auth/login`, `/auth/signup`, `/auth/forgot-password`
- **Note:** alcune risposte >3s (marcate SLOW: `/`, `/pricing`, `/platform`, `/contatti`, `/blog`, `/auth/signup`) – nessun FAIL.
- **Login riuscito / dashboard / AI flow:** non eseguiti (TEST_EMAIL e TEST_PASSWORD non impostate).

### Stripe smoke test – NON ESEGUITO

- Richiede `TEST_EMAIL` e `TEST_PASSWORD` per login; senza credenziali lo script termina con messaggio: *"Imposta TEST_EMAIL e TEST_PASSWORD"*.

---

## Riepilogo

| Categoria | Risultato |
|-----------|-----------|
| **PASS** | 1 (system smoke: tutte le pagine pubbliche + auth pages 200) |
| **SKIP** | 11 (scenari che richiedono login, founder Agency o TestSprite) |
| **FAIL** | 0 |

**FAIL critici:** 0  
**FAIL medi/bassi:** 0

---

## Come ottenere il report completo (TestSprite)

1. Configura **TestSprite MCP** in `C:\Users\utente\.cursor\mcp.json` (vedi `.cursor/mcp-testsprite-example.json`), con `API_KEY` valida.
2. Riavvia Cursor e verifica che il server **testsprite** sia attivo (Settings → MCP).
3. In una **nuova chat Agent** scrivi:  
   *"Testa tutto il SaaS PropertyPilot AI con TestSprite. Base URL: https://propertypilot-ai.vercel.app. Segui TEST_PLAN.md (auth, billing, founder Agency, AI tools, Voice AI). Esegui i test e riportami il report pass/fail."*  
4. L’Agent con tool TestSprite potrà eseguire i test e2e e restituire PASS/FAIL, URL, screenshot e log come da sezione G di TEST_PLAN.md.

---

## Comandi per test con credenziali (senza TestSprite)

```powershell
# Suite completa (system + Stripe) – imposta email/password di test
$env:BASE_URL="https://propertypilot-ai.vercel.app"
$env:TEST_EMAIL="tua-email@esempio.com"
$env:TEST_PASSWORD="tua-password"
node scripts/run-all-smoke-tests.mjs

# Solo Stripe (diagnose + checkout URL per starter/pro/agency)
$env:TEST_EMAIL="..."; $env:TEST_PASSWORD="..."; node scripts/stripe-smoke-test.mjs
```
