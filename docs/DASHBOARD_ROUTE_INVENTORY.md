# Inventario route dashboard (Fase 0)

Tabella di allineamento per UX e go-to-market: **URL**, area funzionale (JTBD allineato a `lib/dashboard/nav-config.tsx`), **piano minimo** desiderato secondo `components/dashboard-plan-features.tsx` (`availableIn`), **gate UI** se la pagina monta `ProFeaturePaywall` o logica equivalente, **stato UX** rispetto alla shell A1–A6 (header unificato, shell padding, toast A4, nav JTBD).

**Legenda stato UX**

| Stato | Significato |
|-------|-------------|
| **OK** | `DashboardPageHeader` + `DashboardPageShell` + feedback A4 dove applicabile |
| **Shell** | Beneficia di layout/sidebar/header globale; hero locale ancora custom |
| **Medio** | Pattern coerente parziale (card, form); da portare a header/shell/toast |
| **Debole** | Molte pagine legacy o dev-only |
| **N/A** | Pagina tecnica / non prodotto |

**Legenda piano minimo**

Valore da `DashboardPlanFeatures` salvo dove la **UI** applica un paywall diverso (nota in colonna Note).

---

| # | Path | Area JTBD | Piano minimo (target) | Gate UI in pagina | Stato UX | Note |
|---|------|-----------|------------------------|-------------------|----------|------|
| 1 | `/dashboard` | Account / home | Free | No | Shell | Command Center; **C1** checklist; **C5:** sezioni sotto piega in `DeferredMount` + Aria in `DeferIdleMount`; moduli PRO/AGENCY nascosti lato server |
| 2 | `/dashboard/listings` | Contenuti | Free | No | OK | `DashboardPageHeader` + shell + `listingsLibrary` toast; CTA “Crea annuncio” in header |
| 3 | `/dashboard/perfect-copy` | Contenuti | Starter | Usage / API | OK | A1–A4 + **C2:** header `?` → `/docs/getting-started/perfect-copy`; tooltip su caratteristiche e target |
| 4 | `/dashboard/refine-listing` | Contenuti | Starter | No | OK | Shell + `refineListing` toast + `fetchApi` |
| 5 | `/dashboard/translate` | Contenuti | Starter | No | OK | Shell dashboard + `translateListing` toast + `fetchApi` |
| 6 | `/dashboard/titles` | Contenuti | Starter | No | OK | Shell + `titleGenerator` + `fetchApi` |
| 7 | `/dashboard/emotional-listing` | Contenuti | Starter | No | OK | Shell + `emotionalListing` |
| 8 | `/dashboard/social-posts` | Contenuti | Starter | No | OK | Shell + `socialPosts` |
| 9 | `/dashboard/hashtags` | Contenuti | Starter | No | OK | Shell + `hashtagGenerator` |
| 10 | `/dashboard/followup-emails` | Contenuti | Pro | No | OK | Shell + toast Fase B1 |
| 11 | `/dashboard/video-scripts` | Contenuti | Pro | No | OK | Shell + toast Fase B1 |
| 12 | `/dashboard/agent-bio` | Contenuti | Pro | No | OK | Shell + toast Fase B1 |
| 13 | `/dashboard/pdf` | Contenuti | Starter+ | No | OK | Allineato a `DashboardPlanFeatures` + nav STARTER+; shell + toast |
| 14 | `/dashboard/analyze` | Intelligence | Free | No | OK | B3: shell + `linkAnalysis` toast |
| 15 | `/dashboard/scraper` | Intelligence | Free | No | OK | B3: shell + `listingScraper` toast |
| 16 | `/dashboard/auditor` | Intelligence | Pro | **Sì** (`ProFeaturePaywall`) | OK | B3: shell + `useUsageLimits` + `listingAuditor` toast |
| 17 | `/dashboard/autopilot` | Intelligence | Agency | No | OK | Shell + header + badge piano + toast feature-scoped (`mandateAutopilot`) |
| 18 | `/dashboard/opportunities` | Lead / CRM | Pro ‡ | No | OK | Shell + header + `fetchApi` + toast (`opportunityRadar`) |
| 19 | `/dashboard/prospecting` | Lead / CRM | Pro | **Sì** | OK | Shell + header + `useUsageLimits` + toast (`prospectingCommand`) |
| 20 | `/dashboard/leads` | Lead / CRM | Pro | **Sì** | OK | Pilota A1–A4 |
| 21 | `/dashboard/leads/pipeline` | Lead / CRM | Pro | No | OK | B2 + **C2:** header `?` → `/docs/crm/pipeline` |
| 22 | `/dashboard/leads/[id]` | Lead / CRM | Pro | No | OK | Shell + header + `leadDetail` toast (B2) |
| 23 | `/dashboard/crm/automations` | Lead / CRM | Pro | No | OK | Regole if/then CRM; shell + toast `crmAutomationRules`; accoppiata a `/dashboard/automations` |
| 24 | `/dashboard/crm/settings` | Lead / CRM | Pro ‡ | No | OK | B5: shell + header + `crmLeadCapture` (API keys, embed, auto follow-up) |
| 25 | `/dashboard/map` | Lead / CRM | Agency | Blocco contenuto se non Agency | OK | Shell + header + `useUsageLimits` + toast (`predatorMap`); mappa in card full-bleed |
| 26 | `/dashboard/lead-score` | Lead / CRM | Starter | No | OK | Shell + header + `leadScoring` toast (B2) |
| 27 | `/dashboard/automations` | Lead / CRM | Pro | **Sì** | OK | Workflow follow-up/reminder/contenuti; distinto dalle regole CRM; shell + `workflowAutomations` |
| 28 | `/dashboard/agency-branding` | Brand | Pro | No | OK | B6: shell + `agencyBrandingWhiteLabel`; `fetchApi` GET/POST |
| 29 | `/dashboard/agency-assistant` | Brand | Pro | **Sì** (blocca Free+Starter) | OK | B5: shell + header + `agencyAssistantChat`; piano da `useUsageLimits`; paywall dopo load |
| 30 | `/dashboard/packages` | Brand / commercio | Free | No | OK | B4: shell, header, Stripe trust, toast `premiumPackages` |
| 31 | `/dashboard/referral` | Brand | Free | No | OK | B4: shell, header, `GET /api/referral`, toast `referralProgram` |
| 32 | `/dashboard/billing` | Account | Free | No | OK | B4 + **C2:** header `?` → `/docs/account/billing-guide` |
| 33 | `/dashboard/settings/workspace` | Account | Free (moduli per piano) | No | OK | B6 + **C4:** card lingua/valuta (`LocaleCurrencySelector`) + fuso orario IANA; date dashboard usano `timezone` |
| 34 | `/dashboard/settings/notifications` | Account | Free | No | OK | B6: shell + `morningIntelNotifications`; `fetchApi` |
| 35 | `/dashboard/test-error` | — | — | N/A | Debole | Solo dev / test Error Boundary |

---

## Priorità suggerite (Fase B)

1. **B1 — Listing & AI copy**  
   Completata fino a `pdf`.

2. **B2 — CRM (avviata)**  
   **Fatto:** `lead-score`, `leads/pipeline`, `leads/[id]`; chiarite **workflow automazioni** vs **regole CRM** (nav, `DashboardPlanFeatures`, pagine, doc `AUTOMATIONS_VS_CRM_RULES.md`).

3. **B3 — Prospecting & map**  
   **Fatto:** `analyze`, `scraper`, `auditor`, `prospecting`, `map`, `opportunities`, `autopilot`.

4. **B4 — Billing & growth**  
   **Fatto:** `billing`, `packages`, `referral`.

5. **B5 — Comunicazioni & capture**  
   **Fatto:** `agency-assistant`, `crm/settings`.

6. **B6 — Settings**  
   **Fatto:** `settings/workspace`, `settings/notifications`, `agency-branding`. **Prossimo:** audit Fase 0 o Fase C.

---

## Prossimi passi “sempre qualcosa da fare” (autonomo)

- **Fase D:** estendere copy dizionario ad altre pagine ancora hardcoded IT; eseguire smoke reale su staging ([SMOKE_STAGING](./SMOKE_STAGING.md)).  
- **C5 (fatto):** home dashboard — `DeferredMount` / `DeferIdleMount` (`components/deferred-mount.tsx`, `defer-idle-mount.tsx`).  
- **C4 (fatto):** workspace settings — lingua/valuta (`LocaleCurrencySelector`) + fuso orario; date dashboard usano `timezone` dal contesto.  
- **C3 (fatto):** command palette con **Collegamenti veloci** + **Guide** (`lib/dashboard/command-palette-extras.tsx`).  
- **C2 (fatto):** `ContextualHelpTrigger` + `FieldHelpLabel`; docs in `lib/docs/doc-content.ts`; help `?` anche su Prospecting, Scraper, Analyze link, Map, Opportunities, Autopilot, Workspace, Follow-up, Video scripts (slug in `CONTEXTUAL_HELP_DOC_SLUGS`).  
- Seguire priorità **P1–P4** in [SHARED_COMPONENTS_AUDIT.md](./SHARED_COMPONENTS_AUDIT.md) (convergenza Card/Button/modali).  
- Estendere **`api-feature-feedback`** (`ApiFeatureId`) dove manca ancora.  
- Ridurre **duplicazioni** (due pagine automations, badge PDF vs piano free in features).  
- Aggiornare questa tabella quando una pagina passa a **OK** o quando Stripe/DB cambiano i gate.

*Generato come parte della Fase 0 — `PLAN_SAAS_UX_ENTERPRISE.md`.*
