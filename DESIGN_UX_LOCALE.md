# Design, UX e norme — lavoro su **localhost** (PropertyPilot AI)

Questo documento è il **riferimento operativo** per elevare struttura, comfort cliente e percezione “enterprise” **prima** del deploy su Vercel. Si appoggia al design system già in repo (`app/globals.css`, `tailwind.config.ts`, `styles/design-system.css`).

---

## 1. Cosa significa “livello multinazionale” nel settore immobiliare online

I portali e i SaaS B2B che servono milioni di utenti condividono **pattern ripetibili**, non “effetti speciali”. PropertyPilot deve allinearsi a questi principi (ispirazione da player come **Zillow**, **Realtor.com**, **Redfin** negli USA; **Rightmove**, **Zoopla** nel Regno Unito; **Idealista**, **Immobiliare.it**, **ImmoScout24** in Europa; **REA / realestate.com.au** in Australia; modelli marketplace **Bayut / Property Finder** nel Middle East).

| Area | Cosa fanno i leader | Implicazione per PropertyPilot |
|------|---------------------|--------------------------------|
| **Ricerca e listing** | Filtri chiari, card leggibili, foto prominenti, prezzo e località sempre visibili | Ogni schermata “immobile” ha gerarchia fissa: titolo → prezzo → zona → CTA |
| **Fiducia** | Badge verificati, fonti dati, policy privacy, stati chiari (es. “stima”, non “valore certo”) | Copy onesto; stati di caricamento/errore espliciti; niente promesse fuorvianti |
| **Velocità percepita** | Skeleton, progressive disclosure, azioni rapide | Loading coerenti (`Skeleton`), evitare pagine “vuote” senza contesto |
| **Mobile-first** | Thumb zone, CTA grandi, form corti | Breakpoint e touch target ≥ 44px dove serve input primario |
| **Internazionalizzazione** | Formati data/numero/currency per mercato (USA vs EU) | Usare locale utente + `Intl` dove appropriato; copy in `messages/` |
| **Accessibilità** | Contrasto, focus visibile, etichette | shadcn/Radix come base; non rimuovere `aria-*` né focus ring senza sostituto |

Non serve copiare il brand altrui: serve **la stessa disciplina** (chiarezza, fiducia, velocità, coerenza).

---

## 2. Stack visivo interno (single source of truth)

- **Token semantici (light/dark):** `app/globals.css` — `bg-background`, `text-foreground`, `primary`, `muted`, `border`, `card`.
- **Palette premium e gradienti Tailwind:** `royal-purple`, `electric-blue`, `neon-aqua`, `sunset-gold`, classi `shadow-glow-*`, `bg-gradient-*`.
- **Layer “Diamond” (card, bordi 1px, accenti):** `styles/design-system.css` — classi `diamond-card`, `diamond-border`, `diamond-button-*` dove serve enfasi premium.

**Regola:** nuove pagine usano prima **token semantici**; `diamond-*` solo per hero, CTA principali o sezioni “premium”, per non frammentare l’interfaccia.

---

## 3. Pattern di layout (shell enterprise)

Ogni area funzionale dovrebbe seguire la stessa ossatura:

1. **Intestazione di contesto** — titolo, una riga di valore (“cosa ottieni in 10 secondi”), eventuale badge piano.
2. **Azione primaria** — un solo CTA principale per schermata quando possibile.
3. **Contenuto** — card o tab coerenti con il resto del dashboard.
4. **Stato vuoto / errore / successo** — sempre con messaggio + azione successiva (riprova, upgrade, contatta supporto).

Questo è allineato alla struttura dei dashboard professionali (CRM + portali): l’utente non “esplora”, **completa un compito**.

---

## 4. Copy e “norme generali”

- **Tono:** professionale, diretto, multilingua; evitare gergo interno (“API”, “endpoint”) verso l’utente finale.
- **Errori:** messaggio breve + causa utile in dev (già in parte su API critiche); in produzione: messaggio sicuro + `support@` o link help se esiste.
- **Upgrade / paywall:** sempre collegare alla **feature** (“Sblocca Voice AI con Pro”), non al nome tecnico del piano.
- **Dati sensibili:** mai loggare o mostrare chiavi; rispettare `.env.local` e variabili Vercel solo a fine ciclo locale.

---

## 5. Checklist per **ogni funzionalità** (locale)

Usare questa lista su ogni route o modulo prima di considerarlo “chiuso” per il deploy.

| Voce | Domanda |
|------|---------|
| Obiettivo | L’utente sa cosa fare nei primi 5 secondi? |
| Gerarchia | Titolo, sottotitolo, azione primaria sono evidenti? |
| Stati | Loading, empty, error, success sono coperti? |
| Coerenza | Stessi spacing, card, bottoni del resto del SaaS? |
| i18n | Stringhe passano da `next-intl` / dizionari dove serve? |
| Piano | Free vs Pro vs Agency è chiaro e rispetta `subscription-check`? |
| Performance | Niente loop di fetch (dipendenze `useEffect` stabili)? |
| Accessibilità | Focus, contrasto, label su form? |

**Definition of done (locale):** navigazione senza errori rossi in console critici, flusso principale completabile, aspetto coerente con token di §2.

---

## 6. Fasi operative

| Fase | Focus |
|------|--------|
| **A — Fondamenta** | Allineare header, dashboard shell, toast/error pattern, empty states ricorrenti. |
| **B — Per verticale** | Listing / AI copy → CRM / lead → Prospecting → Billing / Stripe → Voice / automazioni. |
| **C — Chiusura** | Variabili ambiente su Vercel, smoke test produzione, regressioni i18n. |

Tutto il lavoro pesante di UX/UI resta su **localhost** finché la checklist §5 non è soddisfatta per le aree prioritarie.

---

## 7. Collegamenti

- **Piano completo UX / struttura enterprise:** [docs/PLAN_SAAS_UX_ENTERPRISE.md](./docs/PLAN_SAAS_UX_ENTERPRISE.md)
- Troubleshooting dev e PWA: [AVVIO_LOCAL_WINDOWS.md](./AVVIO_LOCAL_WINDOWS.md)
- Setup generale: [docs/SETUP.md](./docs/SETUP.md)

---

*Documento vivo: aggiornarlo quando una sezione del prodotto adotta un nuovo pattern condiviso (es. nuova famiglia di card o wizard).*
