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

**Prossimo:** A4 (toast / messaggi per feature), A5 (sidebar per job-to-be-done), oppure estendere header + shell ad altre route dashboard.

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

---

## Fase D — Go-live cliente

| # | Lavoro |
|---|--------|
| D1 | Allineare copy IT/EN (minimo) su pagine toccate; altre lingue via dizionario / fallback EN |
| D2 | [VERCEL_DEPLOY_CHECKLIST.md](./VERCEL_DEPLOY_CHECKLIST.md) + smoke test su staging |
| D3 | Raccolta feedback founder + 1–2 utenti beta su **compiti reali** (non “mi piace il colore”) |

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
