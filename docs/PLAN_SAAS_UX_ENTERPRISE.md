# Piano completo — struttura, design moderno, funzionalità “enterprise”

Documento **maestro** per portare PropertyPilot AI al livello di **chiarezza, utilità e percezione qualità** dei migliori SaaS B2B globali (CRM, portali immobiliari, tool verticali). Si integra con [DESIGN_UX_LOCALE.md](../DESIGN_UX_LOCALE.md) (principi e checklist per feature) e con [OPERATIONS_SECURITY.md](./OPERATIONS_SECURITY.md).

---

## Obiettivo

Un prodotto che sia:

1. **Più bello** — coerenza visiva, gerarchia chiara, motion leggero, dark/light solidi.
2. **Più strutturato** — stessa “ossatura” in ogni area (contesto → azione → contenuto → stati).
3. **Più utile** — ogni schermata risponde a “cosa faccio qui in 30 secondi?” con shortcut, suggerimenti e empty state azionabili.
4. **Allineato alle norme dei grandi player** — fiducia, trasparenza, mobile-first, accessibilità, i18n (non copiare brand altrui: copiare **disciplina**).

---

## Fase 0 — Allineamento (1 sprint concettuale)

| Attività | Output |
|----------|--------|
| Inventario route dashboard | Tabella: URL, owner funzionale, piano minimo, stato UX (OK / medio / debole) |
| Audit componenti condivisi | Elenco: `Card`, `Button`, header, sidebar, modali — dove divergono dal design system |
| Decisione “density” | **Comfort** (più aria, tipografia grande) vs **power user** (più dati visibili) — consiglio: default comfort + toggle compatto opzionale in seconda iterazione |

**Definition of done:** documento inventario in `/docs` o issue tracker; priorità numerate per Fase B.

**Stato:** inventario route in [DASHBOARD_ROUTE_INVENTORY.md](./DASHBOARD_ROUTE_INVENTORY.md) (35 route, JTBD, piano da `DashboardPlanFeatures`, gate UI, stato UX, priorità B1–B6). **Density:** default **comfort** (già implicito in Fase A). **Audit componenti condivisi:** completato in [SHARED_COMPONENTS_AUDIT.md](./SHARED_COMPONENTS_AUDIT.md) (Card, Button, Dialog/AlertDialog, header, sidebar, `futuristic-card` / `neon-button`, priorità P1–P4).

---

## Fase A — Fondamenta UI / shell (impatto alto su tutto il SaaS)

| # | Lavoro | Perché |
|---|--------|--------|
| A1 | **Page header unificato** — componente `DashboardPageHeader` (titolo, sottotitolo valore, badge piano, slot azioni) | Stessa “testata” ovunque = percezione prodotto unico |
| A2 | **Spaziatura e tipografia** — mappa `space-*`, `text-*` per titolo H1/H2/body/caption su dashboard | Riduce pagine “diverse” tra loro |
| A3 | **Stati globali** — skeleton riusabili, empty state con illustrazione leggera + CTA + link help | Allineamento a pattern Zillow-class (chiarezza stati) |
| A4 | **Feedback** — toasts coerenti (successo / errore / limite piano) con messaggi legati alla **feature** | Norme enterprise: niente jargon verso l’utente |
| A5 | **Navigazione** — raggruppare voci sidebar per **job-to-be-done** (es. “Contenuti”, “Lead & CRM”, “Prospecting”, “Impostazioni”) | Struttura simile a Salesforce / HubSpot (non uguale, ma stessa logica) |
| A6 | **Mobile** — verifica drawer nav, touch target ≥ 44px su CTA primarie | Standard Apple / Material |

**Definition of done:** dashboard home + 2 pagine pilota migrano al nuovo header e stati; zero regressioni i18n su stringhe toccate.

**Stato implementazione:**

- `DashboardPageHeader` (`components/dashboard-page-header.tsx`) — varianti `dark` / `light` per shell dashboard vs pagine con sfondo chiaro.
- `DashboardPageShell` (`components/dashboard-page-shell.tsx`) — larghezza e padding verticali coerenti per le pagine tool.
- **A2 (parziale):** utility `.dashboard-page-prose` in `app/globals.css` per body copy leggibile.
- **A3 (parziale):** `ToolPageTwoColumnSkeleton` in `components/ui/skeleton-loaders.tsx` (layout form + area risultati).
- **Pagine pilota:** `/dashboard/perfect-copy` e `/dashboard/leads` allineate a header + shell + badge piano (da `useUsageLimits`).
- **A4 (pilota):** `lib/i18n/api-feature-feedback.ts` — titoli toast per feature (`Perfect Copy`, `CRM Lead` / `Lead CRM`) + prossimo passo per 401 / 429 / 5xx / rete / validazione / paywall; integrato nelle stesse due pagine pilota. Test: `__tests__/lib/i18n/api-feature-feedback.test.ts`.

**A5 (implementato):** navigazione per job-to-be-done con **unica sorgente** `lib/dashboard/nav-config.tsx` → sidebar desktop (`DashboardSidebar`), drawer mobile (`DashboardMobileNav` in header), Command Palette (`command-palette.tsx`). Layout dashboard: colonna sinistra + contenuto (`app/dashboard/layout.tsx`). `DashboardPageShell` ora solo padding verticale (niente doppio padding orizzontale).

**A6 (implementato):** target touch **≥44px** su header dashboard (logo, Cerca, Genera, Esci), selettori lingua/regione/tema, voci menu dropdown; pulsante **Menu** e link drawer; chiusura esplicita drawer (X); link sidebar `min-h-11`; slot azioni `DashboardPageHeader` con `[&_button]:min-h-11` + `touch-manipulation` dove utile.

**Fase B1 (listing & AI copy):** completata la linea **listings → refine → translate → titles → emotional → social → hashtags → followup-emails → video-scripts → agent-bio → pdf** (shell, header, toast per feature; PDF allineato a Starter+ in `DashboardPlanFeatures` e nav).

**Fase B2 (avviata):** `lead-score`, `leads/pipeline`, `leads/[id]` — `DashboardPageShell` / `DashboardPageHeader`, badge piano, toast `leadScoring` / `leadPipeline` / `leadDetail`.

**Debito automations (chiuso in UX):** due prodotti distinti — `/dashboard/automations` (workflow) vs `/dashboard/crm/automations` (regole if/then); nav a due voci, link incrociati, matrice piani con feature `crm-automation-rules`, doc aggiornata.

**Fase B3 (completata):** `analyze`, `scraper`, `auditor`, `prospecting`, `map`, `opportunities`, `autopilot` — shell + header + badge piano dove applicabile; ApiFeatureId: `linkAnalysis`, `listingScraper`, `listingAuditor`, `prospectingCommand`, `predatorMap`, `opportunityRadar`, `mandateAutopilot`; auditor: paywall solo sul form.

**Fase B4 (completata):** `billing`, `packages`, `referral` — shell + header + badge piano; banner trust Stripe (`billing.stripeTrust`); toast con `billingSubscription` / `premiumPackages` / `referralProgram`; referral carica codice/link da `GET /api/referral`.

**Fase B5 (completata — canali & integrazioni):** `agency-assistant` (chat assistente: shell, header, `useUsageLimits`, `fetchApi` + toast `agencyAssistantChat`; fix paywall: piano da usage, loading gate); `crm/settings` (API lead capture + auto follow-up: shell, header, toast `crmLeadCapture` / validazione / clipboard).

**Fase B6 (completata):** `settings/workspace` (moduli dashboard), `settings/notifications` (AI Morning Intel), `agency-branding` (white-label PDF) — shell + header + badge piano; toast `workspaceModules`, `morningIntelNotifications`, `agencyBrandingWhiteLabel`; workspace: fix trial `enabled` con `inTrial` locale; notifications: `fetchApi` + validazione canali prima del test.

**Fase 0 — audit componenti:** [SHARED_COMPONENTS_AUDIT.md](./SHARED_COMPONENTS_AUDIT.md) (Card/Button/modali/header/sidebar, priorità P1–P4).

**Prossimo:** Fase C (onboarding, help contestuale, command palette, preferenze, performance percepita) partendo da C1.

---

## Fase B — Verticale per area (ordine consigliato)

Per **ogni** area applicare la checklist in [DESIGN_UX_LOCALE.md §5](../DESIGN_UX_LOCALE.md).

| Ordine | Area | Focus “utilità cliente” |
|--------|------|-------------------------|
| B1 | **Listing & AI copy** (Perfect Copy, refine, translate, titoli) | Flusso guidato: input → anteprima → copia / esporta; suggerimenti contestuali; limite piano visibile |
| B2 | **CRM & lead** (lista, scheda, pipeline, score) | Azioni rapide (email, call, stato); empty “importa primo lead”; metriche leggibili |
| B3 | **Prospecting & map** | Legenda chiara, filtri espliciti, stati “nessun dato” con hint |
| B4 | **Billing & piano** | Confronto piani, CTA upgrade, trust (Sicuro, gestito da Stripe) |
| B5 | **Comunicazioni** (email, WhatsApp, voice dove c’è) | Stato invio, template, errori umani |
| B6 | **Impostazioni** (workspace, notifiche, branding) | Form spezzati in sezioni salvabili; conferme |

**Definition of done (per area):** checklist §5 tutta sì; screenshot prima/dopo in issue o doc breve.

---

## Fase C — Profondità “enterprise” (dopo stabilità B)

| # | Lavoro |
|---|--------|
| C1 | **Onboarding** — checklist “primi 5 passi” post-signup (opzionale dismiss) |
| C2 | **Help contestuale** — link “?” a docs o tooltip su campi complessi |
| C3 | **Ricerca / command palette** — estendere comandi utili (già esiste base: arricchire) |
| C4 | **Preferenze utente** — lingua, valuta, timezone espliciti in settings |
| C5 | **Performance percepita** — lazy load sezioni pesanti, immagini ottimizzate |

**Stato C1:** implementata `DashboardOnboardingChecklist` in `components/dashboard-onboarding-checklist.tsx` (home `/dashboard` solo): 5 passi con CTA, barra progresso, checkbox + auto-completamento quando l’utente visita le route collegate, dismiss persistente in `localStorage` (`propertypilot_onboarding_checklist_dismissed_v1`). Copy in `lib/i18n/dictionary.ts` (IT/EN; altre lingue → merge su EN).

**Stato C2:** help contestuale — `ContextualHelpTrigger` (`components/contextual-help-trigger.tsx`) nel `DashboardPageHeader` (prop `contextualHelp`); `FieldHelpLabel` per tooltip su campi complessi; `TooltipProvider` in `app/layout.tsx`; articoli bilingue IT/EN in `lib/docs/doc-content.ts` + `resolveDocArticle` in `lib/docs/doc-article.ts`; hub `/docs` aggiornato (sezioni CRM, Account, guida Perfect Copy). Pilota: **Perfect Copy**, **Pipeline lead**, **Billing**.

**Stato C3:** command palette — gruppi **Collegamenti veloci** (navigazione interna) e **Guide (nuova scheda)** (`lib/dashboard/command-palette-extras.tsx`); le guide aprono `/docs/...` in `_blank`. Aggiunti articoli `getting-started/first-listing` e `getting-started/workspace-setup` in `doc-content.ts` (prima linkati dall’hub ma senza pagina).

**Stato C4:** preferenze — `timezone` + `setTimezone` in `LocaleProvider` (`propertypilot_timezone` in `localStorage`; default da browser se nella lista IANA); `formatDateForLocale` / `formatDateTimeForLocale` accettano `timeZone` opzionale; pagine dashboard che mostrano date passano `timezone`. **Workspace settings:** card “Lingua, valuta e fuso orario” con `LocaleCurrencySelector` + select timezone raggruppato (`lib/i18n/timezones.ts`).

**Stato C5:** performance percepita — `DeferredMount` (`components/deferred-mount.tsx`) con IntersectionObserver + `rootMargin` per ritardare il mount (e quindi `next/dynamic`) delle sezioni sotto la piega su `/dashboard`: ROI row, Morning briefing, portali, live feed, piani, griglia strumenti, sniper, Pro tips; 3D stats accanto alle stats cards; `DeferIdleMount` per **Aria Coach** dopo idle/timeout. Pulizia import morti in `app/dashboard/page.tsx`. **Prossimo:** Fase D (go-live / copy / checklist).

---

## Fase D — Go-live cliente

| # | Lavoro |
|---|--------|
| D1 | Allineare copy IT/EN (minimo) su pagine toccate; altre lingue via dizionario / fallback EN |
| D2 | [VERCEL_DEPLOY_CHECKLIST.md](./VERCEL_DEPLOY_CHECKLIST.md) + smoke test su staging |
| D3 | Raccolta feedback founder + 1–2 utenti beta su **compiti reali** (non “mi piace il colore”) |

**Stato D1 (parziale):** home `/dashboard` — titolo, sottotitolo e CTA da dizionario; widget da `getTranslation`: **GlobalLiveFeed**, **DashboardProTips**, **DashboardHelpButton**, **Dashboard3DStats**, **SniperStats**, **RegionalPortals**, **ProfitDashboard**, **MorningBriefingBox**, **CompetitorRadar**, **DashboardPlanCardsSection** (`planCards` + prezzi da `STRIPE_*` + `formatCurrencyForLocale`), **DashboardPlanFeatures** (`dashboard.planFeatures` + prezzi da `STRIPE_PLANS` + `billing.perMonth`); pagine **Opportunity Radar** (`/dashboard/opportunities`) e **Autopilot** (`/dashboard/autopilot`) — `dashboard.opportunitiesPage`, `dashboard.autopilotPage`; **Workspace settings** (`/dashboard/settings/workspace`) — `dashboard.workspacePage`; **Billing** — errore fetch soft `billing.subscriptionFetchErrorBody` / `billing.retry`; **Lead Manager** (`/dashboard/leads`) — `dashboard.leadsPage` (`lib/i18n/leads-page-ui.ts`); **dettaglio lead** — `dashboard.leadDetailPage` + `dashboard.communicationsHub`; **pipeline Kanban** — `dashboard.leadPipelinePage`; **CRM API keys** (`/dashboard/crm/settings`) — `dashboard.crmApiKeysPage`; **regole automazione CRM** (`/dashboard/crm/automations`) — `dashboard.crmAutomationRulesPage` (`lib/i18n/crm-automation-rules-page-ui.ts`); **workflow automazioni** (`/dashboard/automations`) — `dashboard.workflowAutomationsPage` (`lib/i18n/workflow-automations-page-ui.ts`); **branding agenzia** (`/dashboard/agency-branding`) — `dashboard.agencyBrandingPage` (`lib/i18n/agency-branding-page-ui.ts`); badge **Predator live** — `dashboard.predatorLiveBadge`. Pagina **Predator Map** (`/dashboard/map`) — `dashboard.mapPage` (legenda KPI, paywall, sidebar dettaglio). Guida scalabilità: [I18N_SCALING.md](./I18N_SCALING.md). IT/EN in repo; altre lingue → merge su EN. Etichette `DeferredMount` dal cookie `propertypilot_locale`.

**Stato D2:** [SMOKE_STAGING.md](./SMOKE_STAGING.md) (checklist manuale post-deploy); script `npm run smoke:public` (Playwright `e2e/smoke-public.spec.ts`, `PLAYWRIGHT_BASE_URL`); voce aggiunta in [VERCEL_DEPLOY_CHECKLIST.md](./VERCEL_DEPLOY_CHECKLIST.md).

**Stato D3:** playbook sessioni beta in [D3_BETA_FEEDBACK.md](./D3_BETA_FEEDBACK.md) (da eseguire con umani; non automatizzabile in repo).

---

## Come seguiamo il piano (ritmo consigliato)

1. **Una Fase A alla volta** (A1 → A6): ogni item = PR piccolo, testabile.
2. **Poi B1** fino a “chiuso” checklist, poi B2, ecc.
3. **Non** mescolare redesign globale con 10 feature diverse nella stessa PR.

**Metriche qualitative (non vanity):**

- L’utente completa il task principale senza domandare “dove clicco?”
- Empty state porta a un’azione in 1 click.
- Messaggi errore dicono **cosa fare dopo**.

---

## Collegamenti

| Documento | Ruolo |
|-----------|--------|
| [DESIGN_UX_LOCALE.md](../DESIGN_UX_LOCALE.md) | Benchmark internazionali, token, checklist feature |
| [OPERATIONS_SECURITY.md](./OPERATIONS_SECURITY.md) | Sicurezza e ops |
| [VERCEL_DEPLOY_CHECKLIST.md](./VERCEL_DEPLOY_CHECKLIST.md) | Deploy |

---

*Ultimo aggiornamento: mantenere questo file quando una fase viene completata o riprioritizzata.*
