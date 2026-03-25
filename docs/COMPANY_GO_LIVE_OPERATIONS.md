# Go-live aziendale (manuale) — GTM, legale, supporto

Questo file **non** è codice: è la checklist operativa per il **100% aziendale** dopo che il prodotto e i test tecnici sono a posto. Procedere **in ordine** e segnare data + responsabile.

---

## 1. Go-to-market (GTM)

| # | Attività | Fatto (data) | Note |
|---|----------|--------------|------|
| 1 | **Posizionamento**: messaggio unico (chi siamo, per chi, perché ora) | | |
| 2 | **Mercati prioritari**: ordine paese/lingua per prime campagne | | Allineato alle 7 lingue prodotto |
| 3 | **Canali**: quali usare per primo (LinkedIn, Meta, Google, partner) | | |
| 4 | **Tracking**: GA4 / Pixel / conversioni — senza PII in URL | | |
| 5 | **Landing e UTM**: pagine pronte + convenzione UTM | | |
| 6 | **Budget e KPI**: CAC target, trial/demo, metriche settimanali | | |
| 7 | **Materiale vendita**: one-pager, deck, demo script | | |

---

## 2. Legale operativo (non solo pagine sul sito)

| # | Attività | Fatto (data) | Note |
|---|----------|--------------|------|
| 1 | **Revisione legale** di Privacy, Termini, Refund per **mercati target** | | Avvocato con competenza SaaS + dati |
| 2 | **DPA** (Data Processing Agreement) per clienti business se richiesto | | |
| 3 | **Cookie / CMP** se usate analytics/marketing EU/UK | | |
| 4 | **Contratto commerciale** (ordine / condizioni B2B) se vendite dirette | | |
| 5 | **Registro trattamenti** / DPIA se applicabile | | Dipende da sede e volumi |

Le pagine `/privacy`, `/terms`, `/refund`, `/compliance` sul sito sono **base comunicativa**; non sostituiscono consulenza legale.

---

## 3. Supporto clienti

| # | Attività | Fatto (data) | Note |
|---|----------|--------------|------|
| 1 | **Canale primario**: email (es. da `CONTACT_EMAIL` / Resend) + eventuale helpdesk | | |
| 2 | **SLA atteso**: es. “risposta entro 24h lavorative” (anche solo interno) | | |
| 3 | **Macro-FAQ** collegate a `/docs` e alle funzioni principali | | |
| 4 | **Processo bug**: come il cliente segnala, come prioritizzate, come comunicate fix | | |
| 5 | **Onboarding**: email post-signup + 3–5 passi “primo valore” | | |

---

## 4. Allineamento con il repository

- **Test tecnici e checklist dashboard**: [`DASHBOARD_FEATURE_QA_CHECKLIST.md`](./DASHBOARD_FEATURE_QA_CHECKLIST.md) + [`LAUNCH_READINESS.md`](./LAUNCH_READINESS.md).
- **Produzione Vercel**: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_BLOCK_SEARCH_INDEXING=false` (o vuoto), Stripe live vs test, Supabase produzione.
- **Preview**: non indicizzate (`VERCEL_ENV=preview` + robots/header già in codice).

---

## Definizione pratica di “100% aziendale”

- GTM: canali e tracking **definiti** e **prima campagna** pronta (anche budget minimo).
- Legale: **parere professionale** su documenti e mercati scelti; nessun lancio “a sensazione”.
- Supporto: **qualcuno risponde** entro SLA dichiarato e **FAQ minime** pubblicate o in docs.

Quando queste tre aree hanno date nella colonna “Fatto”, potete dichiarare il **go-live commerciale** oltre al **go-live tecnico**.
