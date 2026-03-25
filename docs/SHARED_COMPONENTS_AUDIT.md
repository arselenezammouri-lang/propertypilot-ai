# Audit componenti condivisi (Fase 0)

**Data:** 2026-03-21 · **Scope:** `Card`, `Button`, modali (Dialog / AlertDialog), header dashboard, sidebar, pattern CSS custom vs shadcn.

**Obiettivo:** documentare la **fonte di verità** del design system, dove il codice **diverge** (e perché), e una **priorità** per convergenza futura senza bloccare il rilascio.

**Density (decisione prodotto):** default **comfort** — più aria, tipografia leggibile, touch target ≥ 44px sulle CTA principali (cfr. Fase A6). Un eventuale toggle “vista compatta” resta backlog (Fase C / seconda iterazione).

---

## 1. Card (`components/ui/card.tsx`)

| Aspetto | Comportamento base (shadcn) | Uso nel progetto |
|--------|-----------------------------|----------------|
| Container | `rounded-lg border bg-card text-card-foreground shadow-sm` | Molte pagine **dashboard** sovrascrivono con `border-white/10`, `bg-white/[0.03]`, gradienti, o usano **`futuristic-card`** da `globals.css` invece del componente `Card`. |
| Titolo | `CardTitle` → `h3`, `text-2xl font-semibold` | Spesso sovrascritto con `text-white`, `text-lg`, o titoli fuori da `CardTitle`. |
| Coerenza | Alta nel **token** shadcn | **Media-bassa** tra route: stessa funzione “contenitore” con 2–3 famiglie visive (shadcn neutro, dark shell, futuristic). |

**Divergenze principali**

- **`futuristic-card`** (`app/globals.css`): glass, bordi colorati, animazioni (`hover-lift`). Usato intensamente in **billing**, **analyze**, **automations**, parti di **agency-assistant**.
- **Card shadcn “pura”** con classi manuali: branding, notifications, molte pagine post-migrazione B6.

**Rischio:** manutenzione duplicata (stesso concetto “card” con classi diverse).

**Raccomandazione (priorità P2)**

- Introdurre **varianti** opzionali su `Card` (es. `variant="shell" | "glass" | "default"`) che mappano a classi condivise, oppure un wrapper `DashboardSurface` che incapsula `border-white/10 bg-white/[0.03]`.
- Migrare gradualmente le pagine da `futuristic-card` dove non serve l’effetto “marketing”.

---

## 2. Button (`components/ui/button.tsx`)

| Aspetto | Base (CVA) | Uso nel progetto |
|--------|------------|------------------|
| Altezza | `default` h-10, `sm` h-9, `lg` h-11 | Dashboard globale: spesso **`min-h-11`** + `touch-manipulation` aggiunti in header/sidebar/header pagina (Fase A6). |
| Varianti | default / destructive / outline / secondary / ghost / link | **`neon-button`** in `globals.css` per CTA premium (billing, alcune hero). |
| `asChild` | Radix Slot | Usato dove serve (pattern shadcn). |

**Divergenze principali**

- Pulsanti **gradient** one-off (`bg-gradient-to-r from-…`) su packages, notifications, branding, mappe legacy.
- **`neon-button`** non passa dal CVA → non eredita automaticamente focus ring coerente se le classi lo sovrascrivono.

**Raccomandazione (priorità P3)**

- Aggiungere varianti CVA `gradientPrimary` / `gradientGold` **solo se** si stabilisce palette unica; altrimenti documentare che `neon-button` è **solo** per marketing/billing.
- Estendere `size` con `touch` (`min-h-11 px-4`) per evitare ripetizione di classi su ogni pagina.

---

## 3. Modali

### 3.1 Dialog (`components/ui/dialog.tsx`)

- **Stack:** Radix Dialog, overlay `bg-black/80`, content centrato `max-w-lg`, close in alto a destra (testo `sr-only` “Close” — **solo EN** nel componente base).
- **Uso:** `DemoModal`, prospecting, agency assistant, CRM settings (embed), ecc.

**Gap**

- **i18n close:** la stringa nel componente è fissa; le pagine che necessitano IT dovrebbero passare `aria-label` sul close o estendere il componente.

**Raccomandazione (priorità P3):** accettare `closeLabel?: string` o usare dizionario nel wrapper app.

### 3.2 AlertDialog (`components/ui/alert-dialog.tsx`)

- Uso più raro (es. conferme eliminazione in **CRM settings**).
- Stesso tema `bg-background`: su shell scura spesso serve `className` override sul content (già fatto in alcune pagine).

**Raccomandazione (priorità P4):** variant `variant="darkShell"` per allineare a `#050505` senza duplicare classi.

### 3.3 Sheet / Drawer

- **Dashboard mobile nav** usa il pattern **Dialog** (Radix) a pieno schermo; nel repo **non** è presente `components/ui/sheet.tsx` — niente secondo primitive “Sheet” shadcn al momento.

---

## 4. Header dashboard (`components/dashboard-header.tsx`)

| Aspetto | Stato |
|--------|--------|
| Posizione | `fixed`, `z-50`, blur, bordo `border-white/10` |
| Touch | Link logo, command palette, lingua, tema, esci: **`min-h-11`** + focus ring verso `royal-purple` |
| Coerenza | **Alta** con shell `#050505` |

**Nota:** non usa `DashboardPageHeader` (corretto: ruoli diversi — chrome globale vs titolo pagina).

---

## 5. Sidebar (`components/dashboard-sidebar.tsx`)

| Aspetto | Stato |
|--------|--------|
| Larghezza | `lg:w-[260px]`, sticky `top-24` |
| Stile | `border-white/10`, `bg-black/40`, gruppi JTBD da `nav-config` |
| Touch | Link `min-h-11`, `touch-manipulation` |

**Coerenza:** **alta** con layout `app/dashboard/layout.tsx`.

---

## 6. Riepilogo priorità (backlog UX/tecnico)

| Priorità | Voce | Effort | Impatto |
|----------|------|--------|---------|
| **P1** | Completare migrazione pagine ancora “Medio/Debole” in `DASHBOARD_ROUTE_INVENTORY` (es. `test-error`, eventuali landing interne) | Variabile | Coerenza percepita |
| **P2** | Unificare **superfici** (Card / futuristic-card) con 1–2 varianti nominate | Medio | Meno drift CSS |
| **P3** | Button: varianti gradient o documentare `neon-button` + size `touch` | Basso–medio | Meno duplicazione |
| **P3** | Dialog: close label i18n | Basso | Accessibilità + IT |
| **P4** | AlertDialog dark variant | Basso | CRM / conferme su shell scura |

---

## 7. Riferimenti file

| Componente | Path |
|------------|------|
| Card | `components/ui/card.tsx` |
| Button | `components/ui/button.tsx` |
| Dialog | `components/ui/dialog.tsx` |
| AlertDialog | `components/ui/alert-dialog.tsx` |
| Header | `components/dashboard-header.tsx` |
| Sidebar | `components/dashboard-sidebar.tsx` |
| Page header | `components/dashboard-page-header.tsx` |
| Page shell | `components/dashboard-page-shell.tsx` |
| CSS custom | `app/globals.css` (`.futuristic-card`, `.neon-button`, `.glass`) |
| Paywall / modali prodotto | `components/demo-modal.tsx` (`ProFeaturePaywall`) |

---

*Documento Fase 0 — da aggiornare quando si introducono nuove varianti o si completa una onda di convergenza.*
