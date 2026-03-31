# Piano multinazionale e convenzioni i18n

Convenzioni per lingua, valuta e testi user-facing in PropertyPilot (siti mondiali, supporto IT, EN, ES, FR, DE, PT, AR).

---

## 1. Locale: un solo punto di import

### Regola
- **Import unico:** usare sempre `useLocale` da `@/lib/i18n/locale-context`.
- **Non usare** `useLocaleContext` da `@/components/providers/locale-provider` nei nuovi file; il provider re-esporta solo per compatibilità.

### Uso
```ts
import { useLocale } from "@/lib/i18n/locale-context";

const { locale, currency, setLocale, setCurrency } = useLocale();
```

### Implementato
- Tutti i file che usavano `@/components/providers/locale-provider` sono stati migrati a `@/lib/i18n/locale-context` con `useLocale()`.

---

## 2. Testi user-facing: dictionary e getTranslation

### Regola
- **Niente hardcoding** di stringhe per lingua (es. `isItalian ? '...' : '...'`) per testi visibili all’utente.
- Usare **`getTranslation(locale)`** da `@/lib/i18n/dictionary` e le chiavi dell’oggetto `TranslationDictionary`.

### Uso
```ts
import { getTranslation, SupportedLocale } from "@/lib/i18n/dictionary";

const t = getTranslation(locale as SupportedLocale);
// sezione specifica, es. dashboard
const d = getTranslation(locale as SupportedLocale).dashboard;
// toasts dashboard
const toasts = getTranslation(locale as SupportedLocale).dashboardToasts;
```

### Placeholder (es. limiti)
- Nel dictionary usare placeholder `{used}` e `{lim}` (o altri) nella stringa.
- In componente: `template.replace(/\{used\}/g, String(used)).replace(/\{lim\}/g, String(lim))`.

### Implementato
- **dashboardToasts:** sezione in `lib/i18n/dictionary.ts` (interface + it, en, es, fr, de, pt, ar).
- **DashboardClientWrapper:** toast (boost, payment, checkout canceled, limit near) letti da `getTranslation(locale).dashboardToasts`; `limitNearDesc` con `{used}`/`{lim}` e helper `formatLimitNearDesc`.

---

## 3. Valuta e formattazione

### Regola
- Valuta e numeri: usare **`formatCurrencyForLocale`** (e helper in `lib/i18n/intl.ts`) passando sempre **`currency`** dal context (non hardcodare EUR).
- Le pagine che mostrano prezzi o importi ricevono `currency` da `useLocale()` e lo passano alle funzioni di formattazione.

### File tipici
- profit-dashboard, billing, referral, opportunities, competitor-radar, morning-briefing-box, pricing, map, ecc.

---

## 4. Cookie e metadata (locale)

- **Cookie:** in `locale-context`, alla modifica del locale (e al sync da localStorage) si imposta il cookie `propertypilot_locale` per il server.
- **Metadata:** in `app/layout.tsx`, `generateMetadata` legge il cookie e imposta `openGraph.locale` e `alternates.languages` (vedi `docs/PIANO_METADATA_E_MAIN_CONTENT.md`).

---

## 5. RTL e altre lingue

- **RTL:** per `ar` (e eventuali altre) il layout usa già `dir` e `lang` dal root layout (`HtmlLangDir`).
- **Nuove lingue:** aggiungere il locale a `SupportedLocale`, alle chiavi in `translations` in `dictionary.ts` (almeno merge su `en` per le chiavi mancanti) e aggiornare `lib/i18n/config.ts` se necessario.

---

## 6. Riepilogo checklist per nuovi componenti

1. Import locale: `useLocale` da `@/lib/i18n/locale-context`.
2. Testi: `getTranslation(locale as SupportedLocale)` e chiavi del dictionary; aggiungere nuove chiavi in `dictionary.ts` (interface + tutti i locale dove serve).
3. Valuta/numero: usare `currency` dal context e `formatCurrencyForLocale` (o helper intl).
4. Evitare `isItalian ? ... : ...` per stringhe user-facing; preferire sempre il dictionary.

---

*Ultimo aggiornamento: convenzioni applicate; dictionary dashboardToasts; migrazione import locale; doc creato.*
