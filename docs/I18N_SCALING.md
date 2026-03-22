# Internazionalizzazione e scalabilità (PropertyPilot AI)

Obiettivo: prodotto **globale** (USA, EU, Middle East, LATAM) con copy e numeri coerenti per mercato, senza duplicare logica in ogni componente.

## Principi

1. **Single source of truth per le stringhe UI**  
   - Preferire `getTranslation(locale)` da `lib/i18n/dictionary.ts`.  
   - Griglia “tutti gli strumenti” (`DashboardPlanFeatures`): copy in `lib/i18n/plan-features-ui.ts`, esposta come `dashboard.planFeatures` (chrome + `items` per `id` feature).  
   - Lead Manager (`/dashboard/leads`): `lib/i18n/leads-page-ui.ts` → `dashboard.leadsPage` (placeholder `{name}` dove serve).  
   - Dettaglio lead (`/dashboard/leads/[id]`): `lib/i18n/lead-detail-page-ui.ts` → `dashboard.leadDetailPage`; hub messaggi: `lib/i18n/communications-hub-ui.ts` → `dashboard.communicationsHub`.  
   - Pipeline Kanban (`/dashboard/leads/pipeline`): `lib/i18n/lead-pipeline-page-ui.ts` → `dashboard.leadPipelinePage`.  
   - CRM API keys (`/dashboard/crm/settings`): `lib/i18n/crm-api-keys-page-ui.ts` → `dashboard.crmApiKeysPage` (include stringhe embed generate).  
   - Regole automazione CRM (`/dashboard/crm/automations`): `lib/i18n/crm-automation-rules-page-ui.ts` → `dashboard.crmAutomationRulesPage`.  
   - Evitare oggetti `it: { … } / en: { … }` inline nei componenti: non scalano a ES/FR/DE/PT/AR e rompono il merge profondo.

2. **Lingue supportate**  
   - `SupportedLocale`: `it`, `en`, `es`, `fr`, `de`, `pt`, `ar`.  
   - Oggi molte chiavi hanno **IT + EN** completi; le altre lingue ereditano dall’inglese via `deepMerge` in `getTranslation`.  
   - Per andare live in un nuovo mercato: aggiungere le chiavi mancanti sotto `translations.xx` (non serve toccare i componenti).

3. **Valute e importi**  
   - Importi da **Stripe / config** (`STRIPE_PLANS`, `STRIPE_ONE_TIME_PACKAGES`) come numeri; in UI usare sempre `formatCurrencyForLocale(amount, locale, currency)` con `currency` da `LocaleProvider`.  
   - Non hardcodare simboli `€`/`$` accanto a prezzi dinamici: l’utente può aver scelto GBP/USD/EUR.

4. **Date e fusi**  
   - `formatDateForLocale` / `formatDateTimeForLocale` con terzo argomento `timezone` quando serve coerenza dashboard.  
   - Fuso utente: `propertypilot_timezone` + select in workspace settings.

5. **Placeholder e plurali**  
   - Per frasi con variabili usare template con segnaposto espliciti (`{opened}`, `{sent}`) e una piccola funzione di replace nel componente, oppure in futuro ICU / `next-intl`.

6. **Naming delle chiavi**  
   - Raggruppare per area: `dashboard.liveFeed`, `dashboard.planCards`, `dashboard.planFeatures`, `dashboard.mapPage`, `dashboard.opportunitiesPage`, `dashboard.autopilotPage`, `dashboard.workspacePage`, `dashboard.morningBriefing`, ecc.  
   - Messaggi billing condivisi: `billing.subscriptionFetchErrorBody`, `billing.retry`.  
   - Evitare chiavi troppo generiche (`title1`) senza contesto.

## Checklist per nuove feature

- [ ] Nessuna stringa utente visibile hardcoded in IT solo.  
- [ ] Stringhe in `dictionary.ts` (almeno EN; IT se il team traduce prima in italiano).  
- [ ] Importi da config + `formatCurrencyForLocale` se si mostrano soldi.  
- [ ] Se la feature è solo per alcuni mercati, documentarlo nel dizionario o in copy (non nascondere vincoli legali).

## Riferimenti

- `lib/i18n/dictionary.ts` — dizionario e `getTranslation`  
- `lib/i18n/plan-features-ui.ts` — copy griglia piani/feature (IT/EN)  
- `lib/i18n/leads-page-ui.ts` — copy Lead Manager (IT/EN)  
- `lib/i18n/lead-detail-page-ui.ts` — dettaglio lead (IT/EN)  
- `lib/i18n/communications-hub-ui.ts` — Communication Hub nel dettaglio (IT/EN)  
- `lib/i18n/lead-pipeline-page-ui.ts` — pipeline Kanban lead (IT/EN)  
- `lib/i18n/crm-api-keys-page-ui.ts` — CRM settings / API key + embed (IT/EN)  
- `lib/i18n/crm-automation-rules-page-ui.ts` — regole if/then CRM (IT/EN)  
- `lib/i18n/locale-context.tsx` — `locale`, `currency`, `timezone`  
- `lib/i18n/intl.ts` — formattazione numeri/date  
- [DESIGN_UX_LOCALE.md](../DESIGN_UX_LOCALE.md) — principi UX locale
