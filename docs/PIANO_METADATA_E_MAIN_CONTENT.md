# Piano: metadata per locale (OG/alternate) e main-content su marketing/auth

Prossimi miglioramenti dopo il piano globale: metadata dinamici per lingua e landmark main su tutte le pagine.

---

## 1. Metadata per locale (OpenGraph e alternate)

### Obiettivo
- **openGraph.locale** e **twitter** coerenti con la lingua scelta dall’utente (quando il server la conosce).
- **alternates.languages** (hreflang) per segnalare le lingue supportate (stesso URL, contenuto che cambia lato client).

### Approccio
- Il locale è scelto lato client (localStorage); il server non ha accesso a localStorage.
- **Cookie di sync:** quando l’utente cambia lingua in `locale-context`, impostare un cookie (es. `propertypilot_locale`) leggibile dal server.
- **generateMetadata** (root layout o dove serve): leggere `cookies().get('propertypilot_locale')` e:
  - mappare a formato OpenGraph (it → it_IT, en → en_US, ecc.);
  - impostare `openGraph.locale` e, se utile, `openGraph.alternateLocale` o lista;
  - impostare `alternates.languages` con lo stesso URL per ogni locale supportato (single-URL i18n).

### File toccati
| File | Intervento |
|------|------------|
| `lib/i18n/locale-context.tsx` | Alla chiamata di `setLocale` e al primo mount (da localStorage), impostare cookie `propertypilot_locale` (path=/, max-age 1 anno). |
| `app/layout.tsx` | Sostituire `metadata` statico con `generateMetadata` che legge il cookie e restituisce `openGraph.locale` e `alternates.languages`. |

### Implementato
- Cookie `propertypilot_locale` impostato in locale-context (setLocale + sync da localStorage al mount).
- `generateMetadata()` in layout: legge cookie, mappa a OG locale (it_IT, en_US, …), imposta `openGraph.locale` e `alternates.languages` (stesso URL per ogni lingua).

### Limitazioni
- Prima visita o senza cookie: metadata di default (es. en_US).
- SSR e crawler vedranno il locale solo se il cookie è già stato impostato (es. da una visita precedente).

---

## 2. main-content su marketing e auth

### Obiettivo
- Lo skip link “Skip to main content” deve puntare a un elemento con `id="main-content"` su tutte le route.
- Dashboard: già coperto dal layout (`<main id="main-content">`).
- Altre pagine: aggiungere `id="main-content"` al contenitore principale (solitamente `<main>`).

### Stato
- **Dashboard:** layout fornisce `<main id="main-content">`; le pagine figlie non devono avere un secondo `<main>` (HTML invalido: main non annidabile).
- **Pagine con proprio `<main>`:** contatti, blog post.

### Interventi (fatto)
| Pagina / area | Intervento |
|---------------|------------|
| `app/contatti/page.tsx` | Aggiunto `id="main-content"` al `<main>`. |
| `app/blog/[slug]/page.tsx` | Aggiunto `id="main-content"` al `<main>`. |
| `app/dashboard/*` (social-posts, translate, titles, analyze, agency-assistant, leads, pdf, automations) | Sostituito il `<main>` interno con `<div>` (stesse classi) per un solo `<main>` (quello del layout). |
| `app/auth/login/page.tsx` | Wrapper esterno reso `<main id="main-content">`. |
| `app/auth/signup/page.tsx` | Wrapper esterno reso `<main id="main-content">`. |
| `app/auth/forgot-password/page.tsx` | Wrapper esterno reso `<main id="main-content">`. |
| `app/auth/reset-password/page.tsx` | Wrapper esterno reso `<main id="main-content">`. |

---

## 3. Riepilogo implementazione

1. **Cookie locale:** in `locale-context`, in `setLocale` e nel primo mount (se c’è valore in localStorage), impostare cookie `propertypilot_locale`.
2. **generateMetadata:** in `app/layout.tsx`, `generateMetadata` async che legge il cookie, mappa locale → OG locale, restituisce `openGraph.locale` e `alternates.languages`.
3. **main-content:** contatti e blog: aggiungere `id="main-content"` al main esistente; dashboard: sostituire `<main>` interno con `<div>` nelle pagine elencate.
4. (Opzionale) Auth: aggiungere `<main id="main-content">` attorno al form/card dove ha senso.

---

*Ultimo aggiornamento: piano creato e implementazioni applicate.*
