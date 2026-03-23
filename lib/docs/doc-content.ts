import type { DocArticleEntry } from '@/lib/docs/doc-article';
import { docWelcomeLocales } from '@/lib/docs/doc-welcome-locales';
import { docFirstListingLocales, docWorkspaceSetupLocales } from '@/lib/docs/doc-getting-started-locales';
import { docBillingGuideLocales, docPerfectCopyLocales, docPipelineLocales } from '@/lib/docs/doc-next-guides-locales';
import {
  docArbitrageExtraLocales,
  docProspectingFiltersLocales,
  docScraperGuideLocales,
} from '@/lib/docs/doc-prospecting-locales';
import {
  docAiVoiceCallScriptsLocales,
  docAiVoiceObstacleLocales,
  docAiVoiceVoiceSetupLocales,
} from '@/lib/docs/doc-ai-voice-locales';
import { docStagingGuideLocales, docStagingWhatsappLocales } from '@/lib/docs/doc-3d-staging-locales';
import { docSniperGuideLocales, docSniperStrategyLocales } from '@/lib/docs/doc-price-sniper-locales';

/**
 * Contenuti per /docs/[slug]. IT/EN obbligatori; ES–AR opzionali per articolo (fallback EN).
 */
export const docArticles: Record<string, DocArticleEntry> = {
  'getting-started/welcome': {
    ...docWelcomeLocales,
    it: {
      title: 'Benvenuto in PropertyPilot AI',
      content: `
# Benvenuto in PropertyPilot AI

PropertyPilot AI è la piattaforma per agenti immobiliari che vogliono scalare con l'IA: annunci, lead, prospecting e automazioni in un unico posto.

## Cosa puoi fare

- **Scraper e analisi**: trova e analizza annunci sui principali portali
- **Copy e annunci**: genera varianti professionali (Perfect Copy, titoli, traduzioni)
- **CRM e pipeline**: traccia i lead da nuovo contatto a chiusura
- **Voice e territorio**: strumenti avanzati sui piani Pro/Agency

## Prossimi passi

1. Genera il primo annuncio (Perfect Copy o strumenti contenuti)
2. Salva in libreria e imposta la pipeline lead
3. Verifica piano e fatturazione dalla dashboard
    `,
    },
    en: {
      title: 'Welcome to PropertyPilot AI',
      content: `
# Welcome to PropertyPilot AI

PropertyPilot AI helps real estate agents scale with AI: listings, leads, prospecting, and automation in one workspace.

## What you can do

- **Scraping & analysis**: find and analyze listings across major portals
- **Copy & listings**: generate professional variants (Perfect Copy, headlines, translations)
- **CRM & pipeline**: track leads from first touch to closed deal
- **Voice & territory**: advanced tools on Pro/Agency plans

## Next steps

1. Generate your first listing (Perfect Copy or content tools)
2. Save to your library and set up the lead pipeline
3. Review your plan and billing from the dashboard
    `,
    },
  } satisfies DocArticleEntry,
  'getting-started/first-listing': {
    ...docFirstListingLocales,
    it: {
      title: 'Crea il tuo primo annuncio',
      content: `
# Crea il tuo primo annuncio

In pochi minuti puoi passare da **dati grezzi** a copy pronto per i portali.

## Percorso consigliato

1. **Genera Annuncio** (\`/dashboard/listings\`) — flusso guidato per creare e salvare.
2. **Perfect Copy** — se vuoi subito **5 varianti** (professionale, emotivo, breve, SEO, luxury) partendo da un form strutturato.
3. **Libreria** — salva la variante migliore e riaprila quando pubblichi su Idealista, Immobiliare, MLS, ecc.

## Suggerimento

Compila **zona**, **metratura**, **target** e **punti di forza**: l’output sarà molto più credibile e adatto al tuo mercato.
    `,
    },
    en: {
      title: 'Create your first listing',
      content: `
# Create your first listing

Move from **raw inputs** to portal-ready copy in minutes.

## Recommended path

1. **Generate Listing** (\`/dashboard/listings\`) — guided flow to create and save.
2. **Perfect Copy** — if you want **five variants** (professional, emotional, short, SEO, luxury) from a structured form.
3. **Library** — save the best variant and reopen it when you publish to Zillow, Idealista, MLS, etc.

## Tip

Fill in **area**, **size**, **target buyer**, and **strengths** for more credible, market-specific output.
    `,
    },
  } satisfies DocArticleEntry,
  'getting-started/workspace-setup': {
    ...docWorkspaceSetupLocales,
    it: {
      title: 'Configura il tuo workspace',
      content: `
# Configura il workspace

Da **Impostazioni workspace** attivi solo ciò che usi ogni giorno: meno rumore, più velocità.

## Cosa fare

1. Apri \`/dashboard/settings/workspace\`.
2. Abilita i **moduli** rilevanti (CRM, voice, mappa, automazioni…) in base al tuo piano.
3. Verifica **lingua e regione** dall’header (bandierina / selettore) per copy e formati coerenti.

## Perché conta

Un workspace ordinato riduce errori (es. tool PRO non necessari) e allinea il team sulle stesse funzioni.
    `,
    },
    en: {
      title: 'Set up your workspace',
      content: `
# Set up your workspace

In **Workspace settings**, enable only what you use daily: less noise, faster work.

## Steps

1. Open \`/dashboard/settings/workspace\`.
2. Turn on **modules** that match your plan (CRM, voice, map, automations…).
3. Check **language and region** from the header for consistent copy and formats.

## Why it matters

A tidy workspace avoids confusion (e.g. PRO tools you do not need) and keeps teams aligned on the same features.
    `,
    },
  } satisfies DocArticleEntry,
  'getting-started/perfect-copy': {
    ...docPerfectCopyLocales,
    it: {
      title: 'Perfect Copy — guida rapida',
      content: `
# Perfect Copy

Genera **cinque varianti** dello stesso annuncio (professionale, emotivo, breve, SEO, luxury) a partire dai dati dell'immobile.

## Campi importanti

- **Tipo annuncio e immobile**: definiscono lessico e tono del copy.
- **Zona / località**: serve per riferimenti di mercato e titoli mirati.
- **Caratteristiche e punti di forza**: più dettagli = copy più convincente; includi mq, piani, luce, vista, vicinanze.
- **Target cliente** (investitore, famiglia, expat…): orienta hook e CTA.
- **Tono e portale**: adatta stile e lunghezza al canale (Idealista, Zillow, sito agenzia).

## Suggerimenti

1. Compila almeno i campi obbligatori (\*) prima di generare.
2. Usa le tab per confrontare le varianti e copia quella che usi sul portale.
3. Salva il preferito dalla **libreria annunci** per riutilizzarlo.
    `,
    },
    en: {
      title: 'Perfect Copy — quick guide',
      content: `
# Perfect Copy

Create **five variants** of the same listing (professional, emotional, short, SEO, luxury) from your property inputs.

## Important fields

- **Listing and property type**: drive vocabulary and tone.
- **Area / location**: used for market cues and targeted headlines.
- **Features and strengths**: more detail = stronger copy; include sqm, floor plan, light, views, nearby amenities.
- **Target client** (investor, family, expat…): shapes hooks and CTAs.
- **Tone and portal**: adapts length and style per channel (Idealista, Zillow, agency site).

## Tips

1. Fill required fields (\*) before generating.
2. Use tabs to compare variants and copy the one you publish.
3. Save your favourite from the **listings library** for reuse.
    `,
    },
  } satisfies DocArticleEntry,
  'crm/pipeline': {
    ...docPipelineLocales,
    it: {
      title: 'Pipeline lead — come usarla',
      content: `
# Pipeline lead

La vista a **colonne** (Kanban) mostra i lead per fase: Nuovi → Contattati → Follow-up → Chiusi / Persi.

## Come funziona

1. **Trascina** una card da una colonna all’altra per aggiornare lo stato (salvataggio automatico).
2. Apri il **dettaglio lead** per note, punteggio AI e follow-up.
3. Le **automazioni CRM** possono reagire al cambio stato (se configurate in Regole automazione).

## Buone pratiche

- Tieni i lead “Contattati” solo dopo un contatto reale.
- Usa Follow-up per promemoria visite o callback.
- Sincronizza con la **lista lead** (vista tabella) quando preferisci filtri e ordinamento.
    `,
    },
    en: {
      title: 'Lead pipeline — how to use it',
      content: `
# Lead pipeline

The **column** (Kanban) view shows leads by stage: New → Contacted → Follow-up → Closed / Lost.

## How it works

1. **Drag** a card between columns to update status (auto-saved).
2. Open **lead detail** for notes, AI score, and follow-ups.
3. **CRM automation rules** may react to status changes (if configured).

## Best practices

- Move to Contacted only after a real touchpoint.
- Use Follow-up for visits or callbacks.
- Switch to the **lead list** (table) when you need filters and sorting.
    `,
    },
  } satisfies DocArticleEntry,
  'account/billing-guide': {
    ...docBillingGuideLocales,
    it: {
      title: 'Piano e fatturazione',
      content: `
# Piano e fatturazione

Da qui gestisci **upgrade**, **Stripe Customer Portal** (metodo di pagamento, fatture) e vedi lo **stato** dell’abbonamento.

## Cosa controllare

- **Piano attuale** e badge (Free, Starter, Pro, Agency) devono combaciare con ciò che hai acquistato.
- Se il pagamento è in **corso** o in errore, usa il portale cliente o riprova il checkout.
- **Cancellazione a fine periodo**: puoi restare attivo fino alla data indicata.

## Sicurezza

I pagamenti passano da **Stripe**: PropertyPilot non memorizza i dati completi della carta. Per problemi di addebito controlla prima il portale Stripe collegato all’email dell’account.
    `,
    },
    en: {
      title: 'Plan and billing',
      content: `
# Plan and billing

Manage **upgrades**, the **Stripe Customer Portal** (payment method, invoices), and your subscription **status**.

## What to check

- **Current plan** and badge (Free, Starter, Pro, Agency) should match what you purchased.
- If payment is **pending** or failed, use the customer portal or retry checkout.
- **Cancel at period end**: you keep access until the date shown.

## Security

Payments run through **Stripe**; PropertyPilot does not store full card details. For charge issues, check the Stripe portal linked to your account email first.
    `,
    },
  } satisfies DocArticleEntry,
  'prospecting/scraper-guide': {
    ...docScraperGuideLocales,
    it: {
      title: 'Guida allo Scraper Globale',
      content: `
# Guida allo Scraper Globale

Lo scraper raccoglie annunci da **Idealista**, **Zillow**, **Immobiliare.it** e altri portali per analizzare le opportunità in un unico flusso.

## Cosa puoi fare

- **Cerca per zona o URL**: partire da città, quartiere o link annuncio.
- **Filtra i risultati**: prezzo, metratura, tipologia e criteri del tuo mercato.
- **Arricchisci i dati**: apri il dettaglio per foto, storico e segnali di mercato quando disponibili.

## Buone pratiche

1. Definisci **mercato e budget** del cliente prima di grandi volumi.
2. Salva ricerche ricorrenti come **filtri** (vedi guida filtri) per alert coerenti.
3. Incrocia con **Market Gap** e arbitraggio per dare priorità agli sconti sulla media.

## Privacy e uso

Usa lo scraper nel rispetto dei **termini di ogni portale** e della normativa locale (protezione dati, outreach).
    `,
    },
    en: {
      title: 'Global Scraper Guide',
      content: `
# Global Scraper Guide

The scraper pulls listings from **Idealista**, **Zillow**, **Immobiliare.it**, and other portals so you can review opportunities in one workflow.

## What you can do

- **Search by area or URL**: start from a city, neighborhood, or listing link.
- **Filter results**: price, size, deal type, and criteria that match your market.
- **Enrich data**: open detail for photos, history, and market signals when available.

## Best practices

1. Lock in **market and client budget** before running large batches.
2. Save recurring searches as **filters** (see the filters guide) for consistent alerts.
3. Cross-check **Market Gap** and arbitrage views to prioritize below-market asks.

## Compliance

Use the scraper in line with each portal’s **terms of service** and local rules (data protection, outreach).
    `,
    },
  } satisfies DocArticleEntry,
  'prospecting/filters': {
    ...docProspectingFiltersLocales,
    it: {
      title: 'Filtri di Ricerca Avanzati',
      content: `
# Filtri di Ricerca Avanzati

I filtri memorizzano i tuoi criteri (prezzo, zona, tipologia, Market Gap, ecc.) così il motore di prospezione mostra solo ciò che conta.

## Come usarli

1. Apri **Prospecting** dalla dashboard e vai alla sezione filtri o alert (secondo il piano).
2. **Crea un filtro**: nome chiaro (es. «Milano 3 locali / gap > 10%») e regole precise.
3. **Attiva o metti in pausa** senza cancellare la cronologia quando cambia la campagna.

## Suggerimenti

- Parti con **pochi criteri** e affina; troppe regole nascondono opportunità.
- Allinea i filtri a **script di chiamata** e **pipeline CRM** per un follow-up uniforme.
- Rivedi periodicamente: i mercati cambiano e le soglie di prezzo vanno aggiornate.

## API e team

Se il piano lo consente, gli stessi filtri possono sincronizzarsi con **/api/prospecting/filters** per integrazioni interne; non condividere chiavi fuori dall'organizzazione.
    `,
    },
    en: {
      title: 'Advanced Search Filters',
      content: `
# Advanced Search Filters

Filters store your criteria (price, area, property type, Market Gap, etc.) so prospecting surfaces only what matters.

## How to use them

1. Open **Prospecting** on the dashboard and go to filters or alerts (depending on your plan).
2. **Create a filter**: a clear name (e.g. «Madrid 2-bed / gap > 10%») and concrete rules.
3. **Enable or pause** without deleting history when campaigns change.

## Tips

- Start with **few criteria** and refine; too many rules hide opportunities.
- Align filters with **call scripts** and the **CRM pipeline** for consistent follow-up.
- Review regularly: markets move and price thresholds need updates.

## API & team

When your plan allows, filters can sync with **/api/prospecting/filters** for internal integrations—do not share keys outside your organization.
    `,
    },
  } satisfies DocArticleEntry,
  'prospecting/arbitrage': {
    ...docArbitrageExtraLocales,
    it: {
      title: "Guida all'Arbitraggio",
      content: `
# Guida all'Arbitraggio

L'arbitraggio immobiliare consiste nell'identificare immobili venduti sotto il prezzo di mercato.

## Come funziona

1. **Market Gap**: Calcoliamo la differenza tra prezzo annuncio e media zona
2. **Opportunità**: Se il gap è > 15%, è un TOP DEAL
3. **Strategia**: Usa il Market Gap per negoziare con il proprietario

## Esempio

- Prezzo annuncio: €200.000
- Media zona: €250.000
- **Market Gap: -20%**
    `,
    },
    en: {
      title: 'Arbitrage guide',
      content: `
# Arbitrage guide

Real estate arbitrage means spotting properties listed below fair market value.

## How it works

1. **Market Gap**: we compare list price to area averages
2. **Opportunity**: gaps above ~15% can be TOP DEAL signals
3. **Playbook**: use the gap narrative when talking to owners

## Example

- List price: €200,000
- Area average: €250,000
- **Market Gap: -20%**
    `,
    },
  } satisfies DocArticleEntry,
  'ai-voice/voice-setup': {
    ...docAiVoiceVoiceSetupLocales,
    it: {
      title: 'Configurazione Chiamate AI',
      content: `
# Configurazione Chiamate AI

Le chiamate in uscita usano **Bland AI** (o l’integrazione voice attiva sul tuo piano). Qui imposti chi sei, cosa dici e come registrare l’esito.

## Prima di chiamare

1. Verifica che la **chiave API** e il numero/identità mittente siano configurati in workspace o env (solo admin).
2. Scegli **lingua e mercato** coerenti con il proprietario (allineate al selettore lingua dell’app).
3. Testa con una **chiamata breve** su un numero interno prima del primo contatto reale.

## Script e sicurezza

- Usa solo **dati pubblici** dell’annuncio e informazioni che avresti già in agenda.
- Rispetta **opt-out** e normativa sulle chiamate commerciali nel tuo Paese.
- Annota esito e prossimo passo nel **CRM** subito dopo la chiamata.
    `,
    },
    en: {
      title: 'AI Call Setup',
      content: `
# AI Call Setup

Outbound calls use **Bland AI** (or the active voice integration on your plan). Configure who you are, what you say, and how outcomes are logged.

## Before you dial

1. Confirm **API keys** and sender identity are set in workspace or environment (admin).
2. Pick **language and market** that match the owner (aligned with the app language selector).
3. Run a **short test call** to an internal number before real outreach.

## Scripts and compliance

- Use only **public listing data** and information you would already have in a normal call.
- Respect **opt-out** and telemarketing rules in your jurisdiction.
- Log outcome and next step in the **CRM** right after the call.
    `,
    },
  } satisfies DocArticleEntry,
  'ai-voice/call-scripts': {
    ...docAiVoiceCallScriptsLocales,
    it: {
      title: 'Script di Chiamata Personalizzati',
      content: `
# Script di Chiamata per Ottenere Mandati

Uno script efficace può trasformare una chiamata in un mandato.

## Template base

"Buongiorno, chiamo per l'annuncio in [Location]. Avremmo un acquirente interessato; sarebbe disponibile per un sopralluogo nei prossimi giorni?"

## Varianti

- **Market gap**: potenziale ancora inespresso sul mercato
- **Dopo ribasso**: ho notato il nuovo prezzo…
- **Urgenza**: l'immobile è online da tempo…
    `,
    },
    en: {
      title: 'Call scripts',
      content: `
# Call scripts for mandates

A clear script turns cold outreach into booked meetings.

## Base template

"Hi, I’m calling about the listing at [Location]. We may have a qualified buyer—would you be open to a short viewing this week?"

## Variants

- **Market gap**: upside vs recent comps
- **After a price drop**: I saw you repositioned…
- **Urgency**: the home has been on the market…
    `,
    },
  } satisfies DocArticleEntry,
  'ai-voice/obstacle-handling': {
    ...docAiVoiceObstacleLocales,
    it: {
      title: 'Gestione Obiezioni',
      content: `
# Gestione Obiezioni

Il proprietario spesso alza **prezzo**, **tempo** o **fiducia** come barriera. L’AI può suggerire risposte, ma il tono umano resta decisivo.

## Obiezioni frequenti

- **«Non vendo / penso»**: chiedi permesso di richiamare con un dato di mercato (comparables, giorni online).
- **«Già ho un agente»**: rispetta il rapporto; offri solo un secondo parere o buyer qualificato se vero.
- **«Prezzo troppo basso»**: allinea su Market Gap o range zona, senza promettere esiti.

## Flusso consigliato

1. **Ascolta** senza interrompere.
2. **Riformula** l’obiezione («Se ho capito, il tema è…»).
3. **Proponi un micro-passo** (visita, invio comparables, richiamo con data certa).

## Nota

Le risposte AI vanno sempre **verificate** prima di mandare messaggi o registrare impegni legali.
    `,
    },
    en: {
      title: 'Objection handling',
      content: `
# Objection handling

Owners often push back on **price**, **timing**, or **trust**. AI can suggest replies—your human tone still closes the loop.

## Common objections

- **“Not selling / thinking”**: ask permission to follow up with one market fact (comps, days on market).
- **“I already have an agent”**: respect the relationship; only offer a second opinion or a real qualified buyer.
- **“Price is too low”**: anchor on Market Gap or local ranges—never guarantee outcomes.

## Suggested flow

1. **Listen** without interrupting.
2. **Reflect** the objection (“If I’m hearing you, the concern is…”).
3. **Offer a micro-next step** (viewing, comps by email, callback on a fixed date).

## Note

Always **review** AI-suggested wording before sending messages or making commitments.
    `,
    },
  } satisfies DocArticleEntry,
  '3d-staging/staging-guide': {
    ...docStagingGuideLocales,
    it: {
      title: 'Guida al 3D Staging',
      content: `
# Guida al 3D Staging

Il 3D staging genera **visualizzazioni** (arredi, luce, stile) partendo dalle foto dell'immobile per aiutare proprietari e acquirenti a immaginare il potenziale.

## Quando usarlo

- **Vuoto o poco valorizzato**: valorizza soggiorno, camere e zone chiave senza cantiere.
- **Riqualifica in vendita**: mostra una linea estetica coerente (moderno, scandinavo, ecc.) allineata al prezzo richiesto.
- **Multicanale**: esporta o condividi viste per portali, WhatsApp o presentazioni.

## Buone pratiche

1. Carica **foto nitide** e ben illuminate; evita angoli estremi che distorcono.
2. Mantieni uno **stile credibile** per quartiere e target (investitore vs famiglia).
3. Etichetta le immagini come **visualizzazione / render** se portale o normativa lo richiedono.

## Aspettative

È uno strumento di **marketing**, non un progetto esecutivo: rivedi sempre prima di pubblicare.
    `,
    },
    en: {
      title: '3D Staging Guide',
      content: `
# 3D Staging Guide

3D staging creates **visuals** (furniture, lighting, style) from property photos so owners and buyers can picture the potential.

## When to use it

- **Empty or underwhelming**: lift living areas, bedrooms, and key rooms without construction.
- **Renovation story**: show a coherent design direction that matches the asking price.
- **Multi-channel**: export or share views for portals, WhatsApp, or pitch decks.

## Best practices

1. Upload **sharp, well-lit** photos; avoid extreme angles that distort space.
2. Keep the **style believable** for the neighborhood and buyer profile (investor vs family).
3. Label images as **visualization / render** if the portal or law requires it.

## Expectations

This is a **marketing** tool, not a build spec—always review before publishing.
    `,
    },
  } satisfies DocArticleEntry,
  '3d-staging/whatsapp-integration': {
    ...docStagingWhatsappLocales,
    it: {
      title: 'Invio via WhatsApp',
      content: `
# Invio via WhatsApp

Condividi **render 3D** o confronti prima/dopo con proprietari e clienti sul canale dove rispondono più in fretta.

## Cosa inviare

- **Un'immagine forte** per messaggio; evita allegati enormi su mobile.
- **Testo breve**: cosa mostra l'immagine e il passo successivo (visita, chiamata, link annuncio).
- **Consenso**: verifica che accettino messaggi WhatsApp quando serve per GDPR o normativa locale.

## Flusso suggerito

1. Genera o seleziona la vista nel modulo **Virtual Staging** della dashboard.
2. Esporta o usa **Condividi** se disponibile.
3. Registra nel **CRM** l'invio e la reazione del cliente.

## Qualità

Comprimi senza rovinare il dettaglio: file troppo pesanti riducono l'apertura su telefono.
    `,
    },
    en: {
      title: 'Send via WhatsApp',
      content: `
# Send via WhatsApp

Share **3D renders** or before/after comparisons with owners and buyers on the channel where they reply fastest.

## What to send

- **One strong image** per message; avoid huge attachments on mobile data.
- **Short copy**: what the image shows and the next step (viewing, call, listing link).
- **Consent**: confirm they want WhatsApp outreach where GDPR or local rules apply.

## Suggested flow

1. Generate or pick the view in dashboard **Virtual Staging**.
2. Export or use **Share** if the product exposes it.
3. Log the send and response in your **CRM**.

## Quality

Compress without crushing detail—oversized files hurt open rates on phones.
    `,
    },
  } satisfies DocArticleEntry,
  'price-sniper/sniper-guide': {
    ...docSniperGuideLocales,
    it: {
      title: 'Come funziona lo Sniper',
      content: `
# Price Drop Sniper

Lo Sniper rileva automaticamente quando un immobile subisce un ribasso di prezzo.

## Funzionalità

- **Rilevamento rapido**: notifica dopo un ribasso
- **Storico prezzo**: segui le variazioni nel tempo
- **Script di contatto**: approccia il proprietario con messaggi mirati

## Strategia

1. Contatta il proprietario in tempi brevi
2. Riferisciti al riposizionamento sul mercato
3. Proponi visita o valutazione
    `,
    },
    en: {
      title: 'How the Sniper works',
      content: `
# Price Drop Sniper

The Sniper surfaces listings when the price has been reduced.

## Capabilities

- **Fast detection**: alerts after a drop
- **Price history**: track changes over time
- **Outreach scripts**: owner-focused messaging

## Strategy

1. Reach out quickly after a drop
2. Reference the new positioning
3. Offer a viewing or appraisal
    `,
    },
  } satisfies DocArticleEntry,
  'price-sniper/sniper-strategy': {
    ...docSniperStrategyLocales,
    it: {
      title: 'Strategia Sniper',
      content: `
# Strategia Sniper

Un ribasso di prezzo è una **finestra di conversazione**: il proprietario ha già mosso una leva; il tuo compito è portare valore senza risultare invadente.

## Messaggio

- Riconosci il cambiamento: «Ho visto l'aggiornamento su [portale]».
- Ancora sui dati: giorni online, comparabili, interesse acquirenti se reale.
- Evita il tono «te l'avevo detto» o la richiesta di mandato nella prima frase.

## Timing

- **24–72 ore** dal ribasso spesso bilanciano velocità e rispetto.
- Se c'era già un contatto, riprendi il filo con il nuovo prezzo come aggancio.

## CRM

Crea attività **follow-up + promemoria** e collega l'annuncio. Se usi automazioni, evita sequenze generiche sul primo touch.

## Compliance

Rispetta opt-out, registro pubblico delle opposizioni (ove applicabile) e normativa sulla prospezione nel tuo Paese.
    `,
    },
    en: {
      title: 'Sniper Strategy',
      content: `
# Sniper Strategy

A price drop is a **conversation window**: the owner already adjusted; your job is to add value without sounding pushy.

## Messaging

- Acknowledge the move: “I saw the update on [portal].”
- Anchor on facts: days on market, comps, buyer interest when real.
- Skip “I told you so” or demanding a mandate in sentence one.

## Timing

- **24–72 hours** after the drop often balances speed and respect.
- If you already spoke, reopen with the new price as the hook.

## CRM

Create a **follow-up task + reminder** and link the listing. If you automate, avoid generic blast sequences on the first touch.

## Compliance

Honor opt-outs, do-not-call lists where applicable, and local prospecting rules.
    `,
    },
  } satisfies DocArticleEntry,
};
