# Piano: landing main-content, file critici e ritocchi

Estensione di main-content a tutte le pagine pubbliche e controlli su file critici.

---

## 1. main-content sulle landing e pagine pubbliche

### Obiettivo
Lo skip link "Skip to main content" deve avere un target (`id="main-content"`) su ogni route. Dashboard e auth già coperti; restano landing, pricing, blog, docs, demo, compliance, about, terms, privacy, refund, features.

### Interventi (fatto)
| Pagina | Intervento |
|--------|------------|
| `app/(marketing)/page.tsx` | Outer wrapper: `<div>` → `<main id="main-content">` e chiusura `</main>`. |
| `app/platform/page.tsx` | Idem. |
| `app/pricing/page.tsx` | Idem. |
| `app/blog/page.tsx` | Idem. |
| `app/docs/page.tsx` | Idem. |
| `app/docs/[slug]/page.tsx` | Idem. |
| `app/demo/page.tsx` | Idem. |
| `app/compliance/page.tsx` | Idem. |
| `app/about/page.tsx` | Idem. |
| `app/terms/page.tsx` | Idem. |
| `app/privacy/page.tsx` | Idem. |
| `app/refund/page.tsx` | Idem. |
| `app/features/page.tsx` | Idem. |

---

## 2. File critici e ritocchi

### Dashboard: inner main già sistemati
- Le pagine dashboard che avevano un `<main>` interno sono state già convertite in `<div>` (social-posts, translate, titles, analyze, agency-assistant, leads, pdf, automations). Altre pagine (listings, autopilot, refine-listing, ecc.) non avevano un secondo main; il layout fornisce l’unico `<main id="main-content">`.

### Verifiche rapide
- **Link e accessibilità:** i link principali hanno testo o `aria-label`; i pulsanti CTA sono coerenti (già fatto in precedenza con focus-visible).
- **Nessun doppio main:** una sola regione `<main>` per route (landing con un solo wrapper main; dashboard con main nel layout).

---

## 3. Riepilogo file toccati

- **Landing/marketing:** `(marketing)/page.tsx`, `platform/page.tsx`.
- **Pagine pubbliche:** `pricing/page.tsx`, `blog/page.tsx`, `docs/page.tsx`, `docs/[slug]/page.tsx`, `demo/page.tsx`, `compliance/page.tsx`, `about/page.tsx`, `terms/page.tsx`, `privacy/page.tsx`, `refund/page.tsx`, `features/page.tsx`.

---

*Ultimo aggiornamento: piano creato e implementazioni applicate.*
