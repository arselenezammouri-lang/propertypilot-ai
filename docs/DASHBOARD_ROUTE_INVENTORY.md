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
| 1 | `/dashboard` | Account / home | Free | No | Shell | Command Center; moduli PRO/AGENCY nascosti lato server per piano |
| 2 | `/dashboard/listings` | Contenuti | Free | No | OK | `DashboardPageHeader` + shell + `listingsLibrary` toast; CTA “Crea annuncio” in header |
| 3 | `/dashboard/perfect-copy` | Contenuti | Starter | Usage / API | OK | Pilota A1–A4 |
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
| 14 | `/dashboard/analyze` | Intelligence | Free | No | Medio | B3 |
| 15 | `/dashboard/scraper` | Intelligence | Free | No | Medio | B3 |
| 16 | `/dashboard/auditor` | Intelligence | Pro | **Sì** (`ProFeaturePaywall`) | Medio | B3 |
| 17 | `/dashboard/autopilot` | Intelligence | Agency | No | Medio | Verificare allineamento API/piano; badge AGENCY in nav |
| 18 | `/dashboard/opportunities` | Lead / CRM | Pro ‡ | No | Medio | ‡ Non in `ALL_FEATURES`; trattare come PRO+ finché non c’è matrice unica |
| 19 | `/dashboard/prospecting` | Lead / CRM | Pro | **Sì** | Shell | Funzioni Agency-only (es. reveal contatti) dentro pagina |
| 20 | `/dashboard/leads` | Lead / CRM | Pro | **Sì** | OK | Pilota A1–A4 |
| 21 | `/dashboard/leads/pipeline` | Lead / CRM | Pro | No | OK | Shell + header + `leadPipeline` toast (B2) |
| 22 | `/dashboard/leads/[id]` | Lead / CRM | Pro | No | OK | Shell + header + `leadDetail` toast (B2) |
| 23 | `/dashboard/crm/automations` | Lead / CRM | Pro ‡ | No | Medio | ‡ Non in `ALL_FEATURES`; probabile gate solo API — uniformare con `/automations` |
| 24 | `/dashboard/crm/settings` | Lead / CRM | Pro ‡ | No | Medio | API keys / capture — documentare piano in matrice Stripe |
| 25 | `/dashboard/map` | Lead / CRM | Agency | Blocco contenuto se non Agency | Medio | B3 |
| 26 | `/dashboard/lead-score` | Lead / CRM | Starter | No | OK | Shell + header + `leadScoring` toast (B2) |
| 27 | `/dashboard/automations` | Lead / CRM | Pro | **Sì** | Medio | Duplica concetto `/crm/automations` — roadmap: unificare o rinominare |
| 28 | `/dashboard/agency-branding` | Brand | Pro | No | Medio | B6 |
| 29 | `/dashboard/agency-assistant` | Brand | Pro | **Sì** (blocca Free+Starter) | Medio | Copy piano: “Pro+” in UI vs “Pro” in features — allineare |
| 30 | `/dashboard/packages` | Brand / commercio | Free | No | Medio | B4 |
| 31 | `/dashboard/referral` | Brand | Free | No | Medio | B4 |
| 32 | `/dashboard/billing` | Account | Free | No | Medio | B4 |
| 33 | `/dashboard/settings/workspace` | Account | Free (moduli per piano) | No | Medio | B6; `resolveUiSubscriptionPlan` per founder locale |
| 34 | `/dashboard/settings/notifications` | Account | Free | No | Medio | B6 |
| 35 | `/dashboard/test-error` | — | — | N/A | Debole | Solo dev / test Error Boundary |

---

## Priorità suggerite (Fase B)

1. **B1 — Listing & AI copy (ordine implementazione consigliato)**  
   **B1 listing/copy:** batch completato fino a `pdf`. Prossimo: B2 o altre route B1-adiacenti secondo piano.

2. **B2 — CRM (avviata)**  
   **Fatto:** `lead-score`, `leads/pipeline`, `leads/[id]` — shell + header + ApiFeatureId. **Prossimo:** coerenza paywall pipeline vs lista lead se necessario; `crm/automations` vs `automations`; altre route CRM.

3. **B3 — Prospecting & map**  
   `prospecting`, `map`, `analyze`, `scraper`, `auditor`, `opportunities`, `autopilot`.

4. **B4 — Billing & growth**  
   `billing`, `packages`, `referral`.

5. **B6 — Settings**  
   `settings/workspace`, `settings/notifications`, `agency-branding`.

---

## Prossimi passi “sempre qualcosa da fare” (autonomo)

- Estendere **`api-feature-feedback`** (`ApiFeatureId`) a ogni route B1 che usa `fetchApi` + toast.  
- Ridurre **duplicazioni** (due pagine automations, badge PDF vs piano free in features).  
- Aggiornare questa tabella quando una pagina passa a **OK** o quando Stripe/DB cambiano i gate.

*Generato come parte della Fase 0 — `PLAN_SAAS_UX_ENTERPRISE.md`.*
