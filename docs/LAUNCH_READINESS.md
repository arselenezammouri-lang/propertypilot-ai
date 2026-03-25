# Launch readiness (misurabile)

Obiettivo: sapere **cosa è verificato automaticamente** e **cosa resta manuale** prima del test locale “da founder” e del primo go-to-market internazionale.

## Definizione di “100%”

- **100% nel codice** non esiste: billing, legale, supporto e adozione mercato sono **fuori repository**.
- **100% readiness prodotto** = tutti i gate **automatici** verdi + gate **manuali** segnati completati con evidenza (screenshot, log, checklist firmata).

## Gate automatici (CI / Jest)

| Gate | Dove | Cosa verifica |
|------|------|----------------|
| Dashboard contextual help | `__tests__/launch/dashboard-readiness.test.ts` | Ogni `app/dashboard/**/page.tsx` contiene `ContextualHelpTrigger` o `contextualHelp`, tranne le route in `DASHBOARD_ROUTES_WITHOUT_CONTEXTUAL_HELP` (`lib/launch/discover-dashboard-routes.ts`). |
| Sitemap pubblico | `__tests__/lib/seo/build-public-sitemap.test.ts` | URL attesi, niente `/dashboard` in sitemap, un URL per blog post e doc. |
| Robots | `__tests__/app/robots.test.ts` | Regole produzione vs preview / `NEXT_PUBLIC_BLOCK_SEARCH_INDEXING`. |
| i18n / metadata | suite `__tests__/lib/i18n/*` | Coerenza dizionari, metadata builder, errori auth, ecc. |

Eseguire: `npm run qa:launch` (stessa suite) oppure, prima del merge locale, **`npm run qa:premerge`** (Jest launch + **`npm run smoke:public`**, come in CI). Su **macchina founder** con `.env.local`: **`npm run qa:premerge:local`** — carica `.env` / `.env.local`, stesso flusso + **`npm run test:e2e:billing`** se sono impostate `E2E_FOUNDER_*` o `E2E_TEST_*` (altrimenti il billing viene saltato senza errore). Con **`npm run dev` avviato** in un altro terminale: **`npm run check:connectivity`** (GET `/api/health` + probe Supabase). Ogni **`npm run dev`** esegue prima **`validate:env:soft`** (solo avvisi, non blocca se `.env.local` è incompleto). In alternativa: `npx jest __tests__/launch ...` e `npm test` per tutto.

### Checklist “localhost solido” (prima di sentirti sereno al marketing)

1. **`npm ci`** (dipendenze identiche alla CI).
2. **`npm run qa:local-solid`** — `validate:env:soft` + `tsc --noEmit` + **tutta** la suite Jest (333+ test). Su Windows, lo script usa già **8 GB heap** per `tsc` e Jest (come `npm run build`); se servisse di più: `set NODE_OPTIONS=--max-old-space-size=12288` prima del comando.
3. **`npm run build`** — stesso comando della CI; risolve errori TypeScript/build prima del deploy.
4. **`npm run dev`** → in altro terminale **`npm run check:connectivity`**.
5. **`npm run qa:premerge:local`** — smoke Playwright + (opzionale) billing E2E con credenziali.
6. **Manuale**: tabella in **`DASHBOARD_FEATURE_QA_CHECKLIST.md`** — nessun test automatico sostituisce il click su ogni feature con il tuo account Agency/Pro.

**Cosa non può essere “perfetto” solo dal codice:** chiamate a OpenAI, Stripe checkout reale, Bland, mappe, email — servono chiavi valide e rete; senza di esse alcune pagine rispondono con errore controllato, non con “tutto verde” inventato.

### Windows: una sola cartella del progetto (evita 35+ errori TypeScript)

Se vedi errori del tipo **`NextRequest` is not assignable** con percorsi che mescolano  
`...\propilot-ai\node_modules\next\` e `...\propilot-ai\propertypilot-ai\node_modules\next\`,  
hai **due installazioni di Next.js**: `git pull` / `npm ci` nella cartella **sbagliata** (genitore) mentre l’app vera è in **`propertypilot-ai\propertypilot-ai`**.

**Cosa fare:** lavora **solo** nella cartella che contiene **`package.json`** del SaaS (quella con `app/`, `middleware.ts`). **Non** eseguire `npm ci` / `git pull` in una cartella **padre** che contiene anche una sottocartella `propertypilot-ai/` con un’altra copia del repo: crea doppio `node_modules` e `tsc` può ancora leggere file vecchi lì dentro. Elimina `node_modules` (e, se serve, la sottocartella duplicata) dal genitore. Il `tsconfig.json` esclude la cartella `propertypilot-ai/` annidata per ridurre i danni, ma la regola d’oro resta: **un solo clone, un solo `npm ci`**.

Poi da **quella** cartella: `npm ci` e `npm run qa:local-solid`.

**Se la cartella annidata `propertypilot-ai/` dentro il genitore non ti serve:** puoi **eliminarla** (o rinominarla in backup e poi cancellarla) dopo aver verificato che non contenga file unici non committati. Jest e `tsc` sono configurati per **ignorare** quella sottocartella se resta per errore, ma tenerla crea confusione e doppi `npm ci`.

**Se rinomini la copia in `_BACKUP_propertypilot-ai` (o `**/_BACKUP_*`):** `tsconfig` e Jest **escludono** quelle cartelle così `npm run qa:local-solid` non compila né testa il backup. Il backup serve solo come recupero manuale, non come secondo progetto attivo.

### PowerShell: `cd` al progetto

Non usare letteralmente `cd <UNA-SOLA-CARTELLA>` (PowerShell interpreta `<` come operatore). Esempio:

`cd C:\Users\utente\propilot-ai`

(se quella è l’unica root con `package.json` e cartelle `app/`, `middleware.ts`).

### `npm audit fix --force` — evitalo in sviluppo quotidiano

- **`npm audit fix --force`** può aggiornare **Next**, **Vite**, **ESLint** a major incompatibili con il progetto (Next 14 → 16, ecc.) e **rompere build e CI**.
- L’errore **`git@github.com: Permission denied`** durante l’audit indica che qualche dipendenza tenta di risolversi via **git+ssh** senza chiave SSH configurata: non è un problema del tuo codice SaaS.
- **Cosa usare invece:** `npm audit` solo per **informazione**; in CI il repo usa già `npm audit --audit-level=critical` (blocco solo su critici). Per tornare allo stato del lockfile ufficiale dopo un `--force` andato male: `git checkout -- package.json package-lock.json` poi `npm ci`.

## Checklist funzionale dashboard (tracciamento manuale)

- File: **[`DASHBOARD_FEATURE_QA_CHECKLIST.md`](./DASHBOARD_FEATURE_QA_CHECKLIST.md)** — colonne **route, auth, piano (indicativo), ultimo test, esito, note** + blocco Stripe.
- Aggiornare dopo ogni sessione di test locale per avere una **percentuale misurabile** (`ok` / righe totali esclusi `dev`).
- **Parità automatica:** `__tests__/launch/dashboard-qa-checklist-parity.test.ts` — la checklist deve elencare ogni route reale sotto `app/dashboard`.

## 100% aziendale (GTM, legale, supporto)

- Guida operativa: **[`COMPANY_GO_LIVE_OPERATIONS.md`](./COMPANY_GO_LIVE_OPERATIONS.md)** (tabelle da compilare a mano, fuori dal codice).

## Gate manuali (obbligatori per “go” mercato)

| Area | Criterio “fatto” |
|------|-------------------|
| **Stripe** | Checkout test → webhook → piano e stato nel DB allineati; nessun accesso PRO senza pagamento confermato. Smoke Playwright: `npm run test:e2e:billing` (richiede `E2E_FOUNDER_*` o `E2E_TEST_*` in `.env.local`; vedi `e2e/README.md`). |
| **Auth** | Login, signup, forgot/reset, sessione, redirect dashboard; eventuale OAuth se attivo. |
| **Dashboard** | Ogni feature critica: happy path + paywall (free vs agency) dove previsto. |
| **Env produzione** | `NEXT_PUBLIC_APP_URL`, Supabase, Stripe live/test, chiavi AI, `API_STRICT_BROWSER_ORIGIN` / origini consentite. |
| **Preview** | `VERCEL_ENV=preview` → robots `Disallow: /` + header `X-Robots-Tag` (middleware). Anche con `NEXT_PUBLIC_BLOCK_SEARCH_INDEXING=false` la preview resta bloccata. |
| **Production indexing** | Su Vercel Production impostare **`NEXT_PUBLIC_BLOCK_SEARCH_INDEXING=false`** (o lasciare vuoto) così un env copiato per errore da staging non lascia il sito in `noindex`. Valori `true`/`1`/`yes` forzano il blocco. |
| **Legale / GTM** | Privacy/terms per mercati target, supporto, playbook lancio. |

## Tabella percentuale orientativa (aggiornare a mano dopo ogni sprint)

| Pilastro | % (stima) | Automatico | Manuale |
|----------|-----------|------------|---------|
| i18n + SEO pubblico | 85–95 | Metadata, sitemap, robots, canonical | Search Console, contenuti lunghi |
| Dashboard UX enterprise (help, copy) | 90–100 | Test contextual help | QA funzionale per route |
| Sicurezza edge | 70–85 | Middleware, rate limit | Pen-test leggero, config Vercel |
| Billing | ? | Test unit/integration se presenti | **E2E Stripe obbligatorio** |
| GTM / ops | 0–50 | — | Processi, ads, partner |

**Formula suggerita:**  
`readiness = media pesata` con peso alto su **Billing + QA dashboard** (es. 40% billing/E2E, 40% QA feature, 20% resto).

## Nuove route dashboard senza help

1. Aggiungere `ContextualHelpTrigger` nel `DashboardPageHeader`.
2. Se la route è eccezione (solo dev): aggiungere il path a `DASHBOARD_ROUTES_WITHOUT_CONTEXTUAL_HELP` in `lib/launch/discover-dashboard-routes.ts` **con commento motivazione**.
