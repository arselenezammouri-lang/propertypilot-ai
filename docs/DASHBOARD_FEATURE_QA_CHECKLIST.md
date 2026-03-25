# Checklist QA — funzionalità dashboard (tracciamento)

**Scopo:** percentuale misurabile e storico “ultimo test” per il test locale founder (free + agency) e per il go-live.

**Legenda autenticazione:** tutte le route sotto `/dashboard/*` richiedono **sessione Supabase** (altrimenti redirect a `/auth/login`).

**Legenda piano (indicativa — confermare sul paywall reale in UI/API):**

| Valore | Significato |
|--------|-------------|
| `tutti` | Utente loggato; limiti possono dipendere dal piano (usage). |
| `pro+` | Funzioni principali richiedono Pro o Agency (verificare messaggio upgrade). |
| `agency` | Funzioni core riservate ad Agency (es. mappa Predator). |
| `dev` | Solo sviluppo / test boundary. |

Aggiornare **`Ultimo test`** con data `YYYY-MM-DD` e iniziali tester. **`Esito`:** `ok` | `ko` | `na` (non applicabile).

---

## Riepilogo rapido (copia per Slack)

Conta righe con `Esito` = `ok` ÷ (righe totali − `dev` − `na` se escludi).

---

| Route | Auth | Piano (indicativo) | Ultimo test | Esito | Note |
|-------|------|-------------------|-------------|-------|------|
| `/dashboard` | sessione | tutti | | | Home command center |
| `/dashboard/perfect-copy` | sessione | tutti | | | |
| `/dashboard/listings` | sessione | tutti | | | Libreria annunci |
| `/dashboard/titles` | sessione | tutti | | | |
| `/dashboard/translate` | sessione | tutti | | | |
| `/dashboard/refine-listing` | sessione | tutti | | | |
| `/dashboard/emotional-listing` | sessione | tutti | | | |
| `/dashboard/auditor` | sessione | tutti | | | |
| `/dashboard/hashtags` | sessione | tutti | | | |
| `/dashboard/social-posts` | sessione | tutti | | | |
| `/dashboard/video-scripts` | sessione | pro+ | | | Voce / script |
| `/dashboard/followup-emails` | sessione | pro+ | | | |
| `/dashboard/agent-bio` | sessione | tutti | | | |
| `/dashboard/pdf` | sessione | tutti | | | White-label / branding |
| `/dashboard/prospecting` | sessione | pro+ | | | Parti Gold / automazioni Pro–Agency |
| `/dashboard/scraper` | sessione | pro+ | | | |
| `/dashboard/analyze` | sessione | pro+ | | | |
| `/dashboard/autopilot` | sessione | pro+ | | | |
| `/dashboard/map` | sessione | agency | | | Predator map — paywall Agency |
| `/dashboard/opportunities` | sessione | pro+ | | | |
| `/dashboard/leads` | sessione | tutti | | | |
| `/dashboard/leads/pipeline` | sessione | tutti | | | |
| `/dashboard/leads/[id]` | sessione | tutti | | | Dettaglio lead |
| `/dashboard/lead-score` | sessione | tutti | | | |
| `/dashboard/crm/settings` | sessione | tutti | | | |
| `/dashboard/crm/automations` | sessione | tutti | | | |
| `/dashboard/automations` | sessione | tutti | | | Workflow |
| `/dashboard/billing` | sessione | tutti | | | Stripe / piano — **critico pre-lancio** |
| `/dashboard/packages` | sessione | tutti | | | |
| `/dashboard/referral` | sessione | tutti | | | |
| `/dashboard/agency-branding` | sessione | agency | | | White-label |
| `/dashboard/agency-assistant` | sessione | agency | | | |
| `/dashboard/settings/workspace` | sessione | tutti | | | |
| `/dashboard/settings/notifications` | sessione | tutti | | | |
| `/dashboard/test-error` | sessione | dev | | | Solo test error boundary |

---

## Stripe / piano nel DB (blocco comune a più route)

| Verifica | Ultimo test | Esito | Note |
|----------|-------------|-------|------|
| Free: nessun accesso “PRO” senza pagamento confermato | | | Regola prodotto |
| Checkout test → webhook → `profiles` / subscription coerenti | | | Usare Stripe test mode |
| Upgrade / downgrade riflesso in UI dashboard | | | |
| Agency Boost (se attivo) | | | |

---

## Come usare questo file

1. Prima sessione test: impostare **`Ultimo test`** e **`Esito`** riga per riga.
2. In caso di `ko`: descrivere in **`Note`** (errore API, 403, paywall errato).
3. Prima del marketing: obiettivo **100% `ok`** sulle righe non-`dev` rilevanti per il lancio.

Vedi anche [`LAUNCH_READINESS.md`](./LAUNCH_READINESS.md) per gate automatici Jest e definizione di “100%”.  
Per **GTM, legale, supporto** (checklist aziendale manuale): [`COMPANY_GO_LIVE_OPERATIONS.md`](./COMPANY_GO_LIVE_OPERATIONS.md).

**CI:** Jest verifica che questa tabella contenga **tutte** le route in `app/dashboard/**/page.tsx` — vedi `__tests__/launch/dashboard-qa-checklist-parity.test.ts`.
