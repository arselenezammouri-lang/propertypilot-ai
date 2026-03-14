# Piano globale: logica siti mondiali, struttura, CSS e HTML

Piano di miglioramento per PropertyPilot AI (siti multilingua/multiregione, struttura app, design system e semantica).

---

## 1. Logica siti mondiali (i18n, regioni, valuta)

### Stato attuale
- **Locale:** `lib/i18n/config.ts` (it, en, es, fr, de, pt, ar), `locale-context` con `locale` + `currency` (EUR/USD/GBP).
- **Regione:** `lib/geo/geo-detection.ts` (usa, europe, middleeast, global), `GeoConfig` con USD/EUR/GBP/AED.
- **Formattazione:** `lib/i18n/intl.ts` (`formatCurrencyForLocale`, `formatDateForLocale`), `lib/geo/geo-detection.ts` (`formatPrice(amount, config)`).

### Interventi
| Priorità | Intervento | Stato |
|----------|------------|--------|
| Alta | Usare **currency dal context** in tutte le chiamate a `formatCurrencyForLocale` (billing, profit-dashboard, referral, opportunities, competitor-radar, morning-briefing-box, pricing). | ✅ Fatto |
| Alta | **Map page:** sostituire `Intl.NumberFormat('it-IT', 'EUR')` con `formatCurrencyForLocale(price, locale, currency)` da context. | ✅ Fatto |
| Media | **html lang/dir:** componente client che imposta `document.documentElement.lang` e `dir` (RTL per ar) al mount (SSR resta `en` senza middleware). | ✅ Fatto (HtmlLangDir) |
| Media | **Metadata:** in futuro valutare `generateMetadata` con locale da cookie/header per OG e alternate. | Documentato |
| Bassa | Unificare import locale: preferire `@/lib/i18n/locale-context` (o un solo re-export da `@/components/providers/locale-provider`). | Opzionale |
| Bassa | AED (Middle East) nel selettore valuta se si espande il supporto. | Futuro |

---

## 2. Struttura generale (layout, provider, dashboard)

### Stato attuale
- Un solo root layout; nessun `app/dashboard/layout.tsx`.
- `DashboardClientWrapper` (banner checkout, onboarding, limit modal, tier preview) usato solo in `app/dashboard/page.tsx`.
- Pagine dashboard con header/layout non uniformi.

### Interventi
| Priorità | Intervento | Stato |
|----------|------------|--------|
| Alta | **Dashboard layout unico:** `app/dashboard/layout.tsx` con Header, sfondo, `DashboardClientWrapper` e `<main id="main-content">` che wrappa `children`. Tutte le route sotto `/dashboard` ereditano lo stesso shell. | ✅ Fatto |
| Alta | **Dashboard home:** rimuovere header/wrapper/main duplicati e lasciare solo il contenuto (sezioni); lo shell viene dal layout. | ✅ Fatto |
| Media | Documentare ordine provider: `Providers` (QueryClient + Geo) → Locale → Theme. | Documentato |

---

## 3. CSS e design system

### Stato attuale
- **globals.css:** variabili `:root` / `.dark` (--royal-purple, --electric-blue, ecc.) e semantic tokens (--background, --foreground, --primary…).
- **tailwind.config.ts:** theme che usa quelle variabili (royal-purple, electric-blue, background, foreground, ecc.).
- **design-system.css:** palette “diamond” (--diamond-black, --diamond-purple, …), classi utility (diamond-card, diamond-button-primary), override su `html`/`body` con `!important`.

### Convenzioni (dopo interventi)
| Uso | Dove |
|-----|------|
| **Componenti e layout** | Preferire **Tailwind + variabili globals** (es. `bg-background`, `text-foreground`, `border-royal-purple`, `bg-card`). |
| **Card/CTA “premium”** | Usare classi **diamond-*** da `design-system.css` dove serve uno stile distintivo (es. diamond-card, diamond-badge-gold). |
| **Breakpoint** | Tailwind (`sm`, `md`, `lg`); in design-system solo media query specifiche se necessarie. |

### Interventi
| Priorità | Intervento | Stato |
|----------|------------|--------|
| Media | Commenti in **design-system.css** e **globals.css** che spiegano la doppia fonte (Tailwind theme vs diamond) e quando usare cosa. | ✅ Fatto |
| Bassa | Evitare nuovi override `!important` su body; preferire classi applicate ai layout. | Linea guida |

---

## 4. HTML e semantica

### Stato attuale
- Root layout senza `<header>`/`<main>`/`<footer>` (solo provider e `children`).
- Dashboard home con `<main>` e `<section aria-label="...">`; altre pagine dashboard non sempre coerenti.
- Nessuno skip link.

### Interventi
| Priorità | Intervento | Stato |
|----------|------------|--------|
| Alta | **Skip link:** componente “Skip to content” che punta a `#main-content`, inserito come primo elemento focusabile nel body; `<main id="main-content">` nel dashboard layout. | ✅ Fatto (SkipToContent + layout) |
| Media | **Dashboard layout:** contenuto dashboard dentro `<main id="main-content">` con `role="main"` e classe per spacing (pt-24 pb-16). | ✅ Fatto |
| Bassa | Pagine marketing/auth: assicurare `<main id="main-content">` dove esiste un main. | Da verificare a mano |

---

## 5. Riepilogo file toccati

- **Logica globale:** `lib/i18n/intl.ts`, `lib/i18n/locale-context.tsx`, `app/dashboard/map/page.tsx`, `components/profit-dashboard.tsx`, `app/dashboard/billing/page.tsx`, `app/dashboard/referral/page.tsx`, `app/dashboard/opportunities/page.tsx`, `components/competitor-radar.tsx`, `components/morning-briefing-box.tsx`, `app/pricing/page.tsx`.
- **Struttura:** `app/dashboard/layout.tsx` (nuovo), `app/dashboard/page.tsx`.
- **HTML/CSS:** `app/layout.tsx`, `components/skip-to-content.tsx` (nuovo), `components/html-lang-dir.tsx` (nuovo), `styles/design-system.css`, `app/globals.css`.

---

*Ultimo aggiornamento: piano creato e prime implementazioni applicate.*
