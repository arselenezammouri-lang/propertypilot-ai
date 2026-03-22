# Internazionalizzazione e scalabilità (PropertyPilot AI)

Obiettivo: prodotto **globale** (USA, EU, Middle East, LATAM) con copy e numeri coerenti per mercato, senza duplicare logica in ogni componente.

## Principi

1. **Single source of truth per le stringhe UI**  
   - Preferire `getTranslation(locale)` da `lib/i18n/dictionary.ts`.  
   - Header dashboard (`components/dashboard-header.tsx`): `dashboard.navAriaLabel`, `dashboard.commandPaletteOpenAria`, `dashboard.commandPalettePlaceholder`, oltre a `generate` / `signOut`.  
   - Nav condivisa (sidebar, drawer mobile, command palette): `dashboardNav` + `commandPaletteExtras` in `dictionary.ts` — copy in `lib/i18n/dashboard-nav-ui.ts`; struttura route in `lib/dashboard/nav-config.tsx`.  
   - Error boundary / `useAPIErrorHandler`: `errorBoundaryModule` — `lib/i18n/error-boundary-ui.ts`.  
   - Welcome tour (primo accesso dashboard): `welcomeTour` — `lib/i18n/welcome-tour-ui.ts`.  
   - Onboarding wizard (flag env): `onboardingWizard` — `lib/i18n/onboarding-wizard-ui.ts`.  
   - Marketing pubblico: `marketingAbout`, `marketingBlog`, `marketingFeatures` — `lib/i18n/marketing-pages-ui.ts`.  
   - Legal: `privacyPolicyPage` — `lib/i18n/privacy-policy-page-ui.ts`; `termsPolicyPage` — `lib/i18n/terms-policy-page-ui.ts`; `refundPolicyPage` — `lib/i18n/refund-policy-page-ui.ts`.  
   - Blog articolo: `blogPostPage` — `lib/i18n/blog-post-page-ui.ts` (`/blog/[slug]`).  
   - Pricing: oltre a `landing.pricingPage`, card piani + footer link — `pricingPagePlans` in `lib/i18n/pricing-page-plans-ui.ts`.  
   - Contatti: chiavi extra in `contact` (`headerTagline`, `demoMailSubject`, `minCharsCounter`, `submitting`).  
   - Demo (`/demo`): `demo` include `testimonialsList`, `trustStats`, `finalCta`, `whatsappPrefill`, `calendlyIframeTitle`, `footerCopyrightLine`.  
   - Header blog/diamond: `DiamondPageHeader` usa `landing.nav.tagline` e `errors.backToHome`; `MarketingNavHeader` tagline sotto logo da `landing.nav.tagline`.  
   - Home marketing (`app/(marketing)/page.tsx`): intestazioni colonne tabella da `landing.pricing.plans` (`free`, `starter`, `pro`, `agency`); celle in `landing.pricing.tableCells`; blocco **Agency Boost** in `landing.pricing.agencyBoost` (include `productName`, badge, tier, bullet, CTA, pagamento una tantum); hero `signupAriaLabel` / `demoDashboardAriaLabel`, riga loghi `hero.trustedPortalLogos`, cifre stats `hero.statsValues`; card feature `landing.features.*.cta`; motore di ricerca `landing.searchEngine.stepLabel` (`{n}`), `prospectingCycleCta`, demo score `searchEngine.step2.demoScoreLabel` (`{score}`, `{max}`). Evitare emoji nel copy UI: per le card “benefit” usare icona Lucide `Lightbulb` (`aria-hidden`) + solo testo da dizionario. Stesso pattern su `app/platform/page.tsx` se duplicato. **Aria Coach**: prefisso upgrade `ariaTranslations[locale].upgradeTipPrefix` (`lib/i18n/config.ts`). **Docs hub** (`app/docs/page.tsx`): titoli quick link senza emoji + icone `Rocket` / `Lightbulb` / `Target`. **Perfect Copy** empty state: badge varianti con icone Lucide. **Translate** cultural notes: bullet testuale come le altre liste, no emoji.  
   - Griglia “tutti gli strumenti” (`DashboardPlanFeatures`): copy in `lib/i18n/plan-features-ui.ts`, esposta come `dashboard.planFeatures` (chrome + `items` per `id` feature).  
   - Lead Manager (`/dashboard/leads`): `lib/i18n/leads-page-ui.ts` → `dashboard.leadsPage` (IT/EN); **ES/FR/DE/PT/AR** in `lib/i18n/leads-pipeline-locales.ts` (spread nel partial `dashboard` come prospecting).  
   - Dettaglio lead (`/dashboard/leads/[id]`): `lib/i18n/lead-detail-page-ui.ts` → `dashboard.leadDetailPage` (IT/EN); hub messaggi: `lib/i18n/communications-hub-ui.ts` → `dashboard.communicationsHub` (IT/EN); **ES/FR/DE/PT/AR** in `lib/i18n/lead-detail-communications-locales.ts` (spread nel partial `dashboard` come leads/pipeline).  
   - Pipeline Kanban (`/dashboard/leads/pipeline`): `lib/i18n/lead-pipeline-page-ui.ts` → `dashboard.leadPipelinePage` (IT/EN; badge pipeline senza emoji); **ES–AR** nello stesso file `leads-pipeline-locales.ts`.  
   - CRM API keys (`/dashboard/crm/settings`): `lib/i18n/crm-api-keys-page-ui.ts` → `dashboard.crmApiKeysPage` (IT/EN; badge header con icona `Key` nel componente, testo `pageBadge` senza emoji); **ES–AR** in `lib/i18n/crm-settings-automation-locales.ts`.  
   - Regole automazione CRM (`/dashboard/crm/automations`): `lib/i18n/crm-automation-rules-page-ui.ts` → `dashboard.crmAutomationRulesPage` (trigger con `iconKey` Lucide, no emoji); **ES–AR** nello stesso `crm-settings-automation-locales.ts`.  
   - Workflow automazioni (`/dashboard/automations`): `lib/i18n/workflow-automations-page-ui.ts` → `dashboard.workflowAutomationsPage` (IT/EN); **ES–AR** in `lib/i18n/workflow-automations-locales.ts` (spread nel partial `dashboard`).  
   - Branding agenzia / PDF white label (`/dashboard/agency-branding`): `lib/i18n/agency-branding-page-ui.ts` → `dashboard.agencyBrandingPage` (IT/EN; badge testo + icona `Building2` in pagina); **ES–AR** in `lib/i18n/branding-notifications-packages-locales.ts`.  
   - Notifiche Morning Intel (`/dashboard/settings/notifications`): `lib/i18n/notifications-settings-page-ui.ts` → `dashboard.notificationsSettingsPage` (IT/EN; anteprima header testo + icona `Flame`); **ES–AR** nello stesso `branding-notifications-packages-locales.ts`.  
   - Agency Assistant (`/dashboard/agency-assistant`): `lib/i18n/agency-assistant-page-ui.ts` → `dashboard.agencyAssistantPage` (IT/EN); **ES–AR** in `lib/i18n/assistant-referral-perfect-copy-locales.ts`.  
   - Perfect Copy (`/dashboard/perfect-copy`): `lib/i18n/perfect-copy-page-ui.ts` → `dashboard.perfectCopyPage` (IT/EN; tipo transazione / target cliente con `iconKey` + Lucide in pagina, badge hero `Rocket` + testo); **ES–AR** in `assistant-referral-perfect-copy-locales.ts`.  
   - **Tipi transazione** (vendita / affitto / breve): `lib/i18n/transaction-type-ui.ts` → `dashboard.transactionTypes` — condiviso da **Hashtag**, **Titoli A/B**, **Post social**; IT/EN nel modulo, **ES/FR/DE/PT/AR** negli stessi file + `dictionary` (merge).  
   - **Mappa Predator + Opportunity Radar + Autopilot**: `lib/i18n/dashboard-map-opportunity-autopilot-locales.ts` — `mapTitle`…`mapLanciaChiamata`, `mapPage`, `opportunitiesPage`, `autopilotPage`, `transactionTypes` per ES/FR/DE/PT/AR applicati con spread nel partial `translations.*.dashboard`.  
   - Lead scoring (`/dashboard/lead-score`): `lib/i18n/lead-score-page-ui.ts` → `dashboard.leadScorePage` (IT/EN: testo completo pagina, tipi immobile, tempistiche, etichette fattori API italiane → UI locale); **ES/FR/DE/PT/AR** in `lib/i18n/lead-score-page-locales-*.ts` (override nel `dashboard` per locale).  
   - Scheda PDF (`/dashboard/pdf`): `lib/i18n/pdf-sheet-page-ui.ts` → `dashboard.pdfSheetPage` (IT/EN; messaggi Zod da schema locale; branding `{name}`; placeholder campi); **ES–AR** in `lib/i18n/pdf-agent-bio-locales-*.ts`.  
   - Agent BIO (`/dashboard/agent-bio`): `lib/i18n/agent-bio-page-ui.ts` → `dashboard.agentBioPage` (IT/EN; toni con valori API `professionale` / `amichevole` / `luxury`; mercati senza emoji bandiera; tab e `variantDisplayName`); **ES–AR** negli stessi `pdf-agent-bio-locales-*.ts`.  
   - Video Script AI (`/dashboard/video-scripts`): `lib/i18n/video-scripts-page-ui.ts` → `dashboard.videoScriptsPage` (IT/EN; tab `scriptTabs` + icone Lucide in pagina; export clipboard senza emoji); **ES–AR** in `lib/i18n/video-followup-locales-*.ts`.  
   - Follow-up Email (`/dashboard/followup-emails`): `lib/i18n/followup-emails-page-ui.ts` → `dashboard.followupEmailsPage` (IT/EN; `emailTypes` con id API; toni allineati all’endpoint); **ES–AR** negli stessi `video-followup-locales-*.ts`.  
   - Emotional Listing (`/dashboard/emotional-listing`): `lib/i18n/emotional-listing-page-ui.ts` → `dashboard.emotionalListingPage` (IT/EN; transazione/target/tono con `iconKey` + Lucide; export clipboard senza emoji); **ES–AR** in `lib/i18n/emotional-listing-locales-*.ts`.  
   - **Aura VR** (`components/aura-vr-generator.tsx`): chiavi aggiuntive in `translations.*.auraVR` — `toast`, `tripleView`, `views`, `preview`, `listingFallback`, `whatsappVrBody` (`{link}`); blocco `aria` con `visitsSentence` (`{pct}`), `followUp`, `tripleNote` (niente più stringhe IT hardcoded nel componente).  
   - **Virtual Staging** (`components/ai-virtual-staging.tsx`): `translations.*.virtualStaging` (IT/EN nativi + ES/FR/DE/PT/AR nel dizionario); copy e toast da `useLocale` + `getTranslation`.  
   - **Prospecting modals + X-Ray + Territory Commander**: `translations.*.prospectingModals` — bundle `lib/i18n/prospecting-modals-ui.ts` (IT/EN) + `lib/i18n/prospecting-modals-locales.ts` (ES–AR); componenti `price-drop-sniper-modal`, `investment-analysis-modal`, `whatsapp-sender-modal`, `ai-xray-vision`, `territory-commander`; testi generati da `lib/ai/territory-analysis.ts` alimentati da `lib/i18n/territory-analysis-strings.ts` (tutte le lingue).  
   - Referral (`/dashboard/referral`): `lib/i18n/referral-page-ui.ts` → `dashboard.referralPage` (IT/EN); **ES–AR** in `assistant-referral-perfect-copy-locales.ts`.  
   - Pacchetti premium (`/dashboard/packages`): `lib/i18n/packages-page-ui.ts` → `dashboard.packagesPage` (IT/EN); **ES–AR** in `branding-notifications-packages-locales.ts`.  
   - Prospecting / Arbitrage Command Center (`/dashboard/prospecting`): `dashboard.prospectingPage` — **IT/EN** in `lib/i18n/prospecting-page-ui.ts`; **ES/FR/DE/PT/AR** intere in `lib/i18n/prospecting-page-ui-locales.ts` (collegate in `dictionary.ts` sotto `translations.*.dashboard.prospectingPage`, merge profondo col resto EN); `nextAction` incluso in ogni bundle; logica `lib/ai/next-action-suggestion.ts`; tipi `lib/ai/next-action-types.ts`; portali `lib/i18n/prospecting-platforms.ts`; WhatsApp proprietario `lib/i18n/prospecting-whatsapp-outreach.ts`.  
   - Analisi da link (`/dashboard/analyze`): `lib/i18n/analyze-link-page-ui.ts` → `dashboard.analyzeLinkPage` (IT/EN); **ES–AR** in `lib/i18n/listing-tools-locales-*.ts` (spread nel `dashboard` per locale).  
   - Scraper annunci (`/dashboard/scraper`): `lib/i18n/listing-scraper-page-ui.ts` → `dashboard.listingScraperPage` (IT/EN; `suggestionHint` testuale, no emoji); **ES–AR** negli stessi file `listing-tools-locales-*.ts`.  
   - Audit annuncio (`/dashboard/auditor`): `lib/i18n/listing-auditor-page-ui.ts` → `dashboard.listingAuditorPage` (IT/EN; tipo transazione `iconKey` + Lucide in pagina; sezioni strutturali senza emoji nei testi); **ES–AR** in `listing-tools-locales-*.ts`.  
   - Perfect Again / refine (`/dashboard/refine-listing`): `lib/i18n/refine-listing-page-ui.ts` → `dashboard.refineListingPage` (IT/EN; transazioni `iconKey`, toni select con Lucide, badge hero senza emoji); **ES–AR** in `lib/i18n/listing-content-tools-locales-*.ts`.  
   - Traduttore annunci (`/dashboard/translate`): `lib/i18n/translate-listing-page-ui.ts` → `dashboard.translateListingPage` (IT/EN; lingue target con etichette paese testuali, no bandiere emoji; `successDescFresh` con `{lang}`); **ES–AR** negli stessi `listing-content-tools-locales-*.ts`.  
   - Libreria annunci (`/dashboard/listings`): `lib/i18n/listings-library-page-ui.ts` → `dashboard.listingsLibraryPage` (IT/EN; date `formatDateForLocale`); **ES–AR** in `listing-content-tools-locales-*.ts`.  
   - Titoli A/B (`/dashboard/titles`): `lib/i18n/titles-ab-page-ui.ts` → `dashboard.titlesAbPage` (IT/EN; categorie con icone da `getTitlesAbCategoryVisuals`); **ES–AR** in `listing-content-tools-locales-*.ts`.  
   - Hashtag (`/dashboard/hashtags`): `lib/i18n/hashtags-page-ui.ts` → `dashboard.hashtagsPage` (IT/EN; titoli card `{count}`, mix `{label}`, mercato IT/US senza emoji); **ES–AR** in `listing-content-tools-locales-*.ts`.  
   - Post social (`/dashboard/social-posts`): `lib/i18n/social-posts-page-ui.ts` → `dashboard.socialPostsPage` (IT/EN; toni/lunghezze con mappe Lucide); **ES–AR** in `listing-content-tools-locales-*.ts`.  
   - Banner checkout in sospeso (`PendingCheckoutBanner`): `lib/i18n/pending-checkout-ui.ts` → `pendingCheckoutBanner` (prezzi da `STRIPE_*` + `formatCurrencyForLocale` + `billing.perMonth`).  
   - Modal limite utilizzo (`AriaLimitModal`): `lib/i18n/aria-limit-modal-ui.ts` → `ariaLimitModal` (prezzo upgrade da `STRIPE_PLANS[next].price`).  
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
- `lib/i18n/workflow-automations-page-ui.ts` — workflow follow-up / reminder / contenuti (IT/EN)  
- `lib/i18n/agency-branding-page-ui.ts` — branding PDF white label (IT/EN)  
- `lib/i18n/notifications-settings-page-ui.ts` — AI Morning Intel / impostazioni notifiche (IT/EN)  
- `lib/i18n/agency-assistant-page-ui.ts` — chat assistente agenzia (IT/EN)  
- `lib/i18n/perfect-copy-page-ui.ts` — Perfect Copy form + risultati (IT/EN)  
- `lib/i18n/referral-page-ui.ts` — programma referral (IT/EN)  
- `lib/i18n/packages-page-ui.ts` — pacchetti one-time + acquisti (IT/EN)  
- `lib/i18n/locale-context.tsx` — `locale`, `currency`, `timezone`  
- `lib/i18n/intl.ts` — formattazione numeri/date  
- [DESIGN_UX_LOCALE.md](../DESIGN_UX_LOCALE.md) — principi UX locale
