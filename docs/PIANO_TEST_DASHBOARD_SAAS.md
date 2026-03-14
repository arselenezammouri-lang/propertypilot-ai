# Piano completo: test web Dashboard SaaS, verifica tasti/funzioni, blindatura e design

Piano esecutivo da seguire sul web per verificare che ogni pagina della dashboard risponda, ogni pulsante/azione funzioni, e per blindare la struttura e sistemare il design.

---

## Come testare in locale

1. **Avvia l’app**: `npm run dev` → apri [http://localhost:3000](http://localhost:3000), fai login.
2. **Error boundary**: vai a [http://localhost:3000/dashboard/test-error?trigger=1](http://localhost:3000/dashboard/test-error?trigger=1) → deve apparire la card “Qualcosa è andato storto” con **Riprova** e **Torna alla Dashboard**. Senza `?trigger=1` la pagina è normale.
3. **Listings – Elimina**: [Dashboard](http://localhost:3000/dashboard) → **Annunci Salvati** (o `/dashboard/listings`) → apri un annuncio → **Elimina** → deve aprirsi il dialog di conferma → **Elimina** → spinner sul bottone e toast “Annuncio eliminato”.
4. **Leads – Elimina**: [Lead Manager](http://localhost:3000/dashboard/leads) → menu su un lead → **Elimina** → conferma → bottone “Eliminazione...” con spinner e toast “Lead eliminato”.
5. **CRM Settings – Elimina API Key**: [CRM Settings](http://localhost:3000/dashboard/crm/settings) → **Elimina** su una key → dialog “Elimina API Key?” → **Elimina** → spinner e toast “API Key eliminata”.
6. **CRM Automazioni – Elimina regola**: [Automation Center](http://localhost:3000/dashboard/crm/automations) → **Elimina** su una regola → conferma browser → spinner sul bottone e toast di successo.

*(Il tab browser in Cursor va aperto e usato da te; l’assistente non può aprire o controllare il browser.)*

---

## 1. Scope e obiettivi

- **Ogni route dashboard** deve caricare senza errori e mostrare contenuto coerente.
- **Ogni pulsante/link/azione** deve avere un feedback (loading, toast, redirect o stato) e non lasciare l’utente senza risposta.
- **API** chiamate dalle pagine devono usare `fetchApi` o `queryClient` e gestire 401/403/5xx in modo uniforme.
- **Blindatura**: error boundary, stati di loading, messaggi di errore chiari, paywall/upgrade dove serve.
- **Design**: allineamento layout, spacing, bottoni, form e stati vuoti tra le pagine.

---

## 2. Inventario pagine Dashboard (da testare)

Elenco delle **34 pagine** sotto `/dashboard` da verificare una per una.

| # | Route | Descrizione breve | Priorità |
|---|--------|-------------------|----------|
| 1 | `/dashboard` | Home, stats, shortcut, billing CTA | Alta |
| 2 | `/dashboard/listings` | Annunci salvati, elimina, rigenera | Alta |
| 3 | `/dashboard/leads` | Lista lead, filtri, add/edit/delete, note, status | Alta |
| 4 | `/dashboard/leads/pipeline` | Kanban lead, drag, update status, execute rule | Alta |
| 5 | `/dashboard/leads/[id]` | Dettaglio lead, note, enrich, comunicazioni | Alta |
| 6 | `/dashboard/prospecting` | Listings, filtri, call AI, status, stats, filters CRUD | Alta |
| 7 | `/dashboard/billing` | Subscription, cancel/reactivate, portal, checkout, upgrade, boost | Alta |
| 8 | `/dashboard/crm/settings` | API keys CRUD, embed code, impostazioni lead | Alta |
| 9 | `/dashboard/crm/automations` | Regole CRM CRUD, log esecuzioni | Alta |
| 10 | `/dashboard/scraper` | Scrape URL, genera AI, salva in libreria | Alta |
| 11 | `/dashboard/perfect-copy` | Form copy, genera, tab risultati | Alta |
| 12 | `/dashboard/translate` | Traduci annuncio, lingua target | Media |
| 13 | `/dashboard/refine-listing` | Raffina testo esistente | Media |
| 14 | `/dashboard/titles` | Genera titoli | Media |
| 15 | `/dashboard/social-posts` | Genera post social | Media |
| 16 | `/dashboard/emotional-listing` | Annuncio emozionale | Media |
| 17 | `/dashboard/followup-emails` | Email follow-up | Media |
| 18 | `/dashboard/video-scripts` | Script video | Media |
| 19 | `/dashboard/agent-bio` | Bio agente | Media |
| 20 | `/dashboard/hashtags` | Hashtag | Media |
| 21 | `/dashboard/pdf` | Genera PDF | Media |
| 22 | `/dashboard/analyze` | Analisi immobile (foto/URL) | Media |
| 23 | `/dashboard/auditor` | AI Auditor annunci | Media |
| 24 | `/dashboard/lead-score` | Lead Score AI | Media |
| 25 | `/dashboard/opportunities` | Opportunità (underpriced/old/uncontacted) | Media |
| 26 | `/dashboard/map` | Mappa tattica, call da mappa | Media |
| 27 | `/dashboard/automations` | Automazioni (followup/reminder/weekly) | Media |
| 28 | `/dashboard/agency-branding` | Brand agenzia | Media |
| 29 | `/dashboard/agency-assistant` | Chat assistente | Media |
| 30 | `/dashboard/autopilot` | Autopilot 24/7 | Bassa (Agency) |
| 31 | `/dashboard/packages` | Pacchetti servizi, checkout boost | Media |
| 32 | `/dashboard/referral` | Programma referral | Media |
| 33 | `/dashboard/settings/workspace` | Workspace, nome, lingue | Media |
| 34 | `/dashboard/settings/notifications` | Notifiche, briefing | Media |

---

## 3. Checklist per ogni pagina (da eseguire sul web)

Per **ogni** pagina della tabella sopra, eseguire in ordine:

### 3.1 Caricamento e layout
- [ ] Aprire l’URL (es. `https://tuo-dominio/dashboard/leads`) da utente loggato.
- [ ] La pagina carica senza errore bianco o crash (no “Application error”).
- [ ] Header dashboard è visibile (logo, Cerca, Lingua, Tema, Genera, Logout).
- [ ] Titolo/descrizione della sezione sono visibili e coerenti.
- [ ] Nessun blocco “undefined” o “[object Object]” in UI.
- [ ] Link “Torna alla dashboard” / “Indietro” (se presenti) portano alla route corretta.

### 3.2 Pulsanti e azioni primarie
- [ ] **Ogni** pulsante/CTA ha un’azione (submit, redirect, apertura modale, toggle).
- [ ] Click su pulsante principale (es. “Genera”, “Salva”, “Invia”) mostra loading (spinner/disabled) durante la richiesta.
- [ ] A fine azione: toast di successo o errore, oppure redirect/navigazione corretta.
- [ ] In caso di errore API: messaggio utente leggibile (no stack trace in produzione).
- [ ] Se la feature richiede piano PRO/AGENCY: da utente FREE deve comparire paywall/modal upgrade e non errore generico.

### 3.3 Form e input
- [ ] Campi obbligatori senza valore mostrano errore al submit (o validazione inline).
- [ ] Submit del form chiama l’API corretta (verifica in Network tab: metodo, URL, body).
- [ ] Dopo successo: form si resetta o messaggio “Fatto” e eventuale redirect.

### 3.4 Liste e tabelle
- [ ] Se la pagina ha lista/tabella: i dati si caricano (o stato “Nessun dato”).
- [ ] Filtri (status, priorità, ricerca) aggiornano la lista.
- [ ] Azioni per riga (Modifica, Elimina, Cambia status) funzionano e aggiornano la UI o mostrano toast.

### 3.5 Modali e dialog
- [ ] Apertura modale: contenuto visibile, pulsante Chiudi/Indietro chiude.
- [ ] Submit da modale: stessa logica di 3.2 (loading, toast, chiusura).

### 3.6 Link e navigazione
- [ ] Tutti i link interni (es. “Vai a Billing”, “Pipeline”) portano alla route corretta.
- [ ] Link esterni (es. Stripe, docs) aprono in nuova scheda se previsto.

### 3.7 Stati limite
- [ ] **401**: da non loggato, redirect a login (middleware).
- [ ] **403** (feature premium): messaggio chiaro + CTA upgrade (es. “Piano PRO richiesto”).
- [ ] **Rete/5xx**: messaggio tipo “Riprova” o “Errore di connessione”, non crash.

---

## 4. Checklist per funzionalità (clic e risposta)

Usare questa sezione per verificare **ogni** funzione sensibile, una per una.

### 4.1 Dashboard home (`/dashboard`)
- [ ] Card statistiche visibili (o placeholder se FREE).
- [ ] Link/CTA “Upgrade” / “Vai a Billing” funziona.
- [ ] Command Palette: Ctrl+K / Cmd+K apre; ricerca e scelta voce portano alla pagina corretta.
- [ ] Pulsante “Genera” in header → `/dashboard/listings`.
- [ ] Logout → signout e redirect a login.

### 4.2 Listings (`/dashboard/listings`)
- [ ] Lista annunci si carica (o empty state).
- [ ] Elimina annuncio: conferma (se presente), poi toast + lista aggiornata.
- [ ] Rigenera contenuto: loading, poi toast + contenuto aggiornato.
- [ ] Apertura dettaglio/anteprima funziona.

### 4.3 Leads (`/dashboard/leads`)
- [ ] Tabella lead con filtri (status, priorità, mercato, ricerca).
- [ ] Aggiungi lead: modale, submit, toast, refresh lista.
- [ ] Modifica lead: modale, submit, toast, refresh.
- [ ] Elimina lead: conferma, toast, refresh.
- [ ] Cambio status da dropdown/azione: toast, refresh.
- [ ] Aggiungi nota: modale/input, submit, nota visibile.
- [ ] Apertura dettaglio lead: modale o pagina dettaglio, dati e note visibili.
- [ ] Da FREE: paywall/CTA upgrade dove previsto (es. Lead Manager PRO).

### 4.4 Pipeline (`/dashboard/leads/pipeline`)
- [ ] Colonne Kanban caricate con lead.
- [ ] Spostare card tra colonne aggiorna status (e API).
- [ ] Click su lead apre dettaglio o modale.
- [ ] Esecuzione regola automatica (se presente) non rompe la pagina.

### 4.5 Dettaglio lead (`/dashboard/leads/[id]`)
- [ ] Dati lead, note, storico status visibili.
- [ ] Enrich lead: pulsante, loading, toast.
- [ ] Link “Torna a lead” → `/dashboard/leads`.

### 4.6 Prospecting (`/dashboard/prospecting`)
- [ ] Lista listings con filtri (status, piattaforma, location).
- [ ] Pulsante “Chiama” (Voice AI): loading, toast, eventuale paywall se FREE.
- [ ] Cambio status da select: salvataggio e refresh.
- [ ] Filtri salvati: crea/modifica/elimina, toggle auto-run.
- [ ] Stats (chiamate oggi, ecc.) visibili per PRO/AGENCY.
- [ ] Link upgrade in paywall → billing.

### 4.7 Billing (`/dashboard/billing`)
- [ ] Piano corrente e prezzo mostrati correttamente.
- [ ] Annulla abbonamento: conferma, toast, stato aggiornato.
- [ ] Riattiva abbonamento: pulsante, toast.
- [ ] Portale gestione (Stripe): redirect a Stripe e ritorno.
- [ ] Checkout nuovo piano: redirect a Stripe checkout.
- [ ] Upgrade (cambio piano): submit, toast, reload.
- [ ] Checkout Agency Boost: redirect a Stripe.

### 4.8 CRM Impostazioni (`/dashboard/crm/settings`)
- [ ] Lista API keys con mascheramento.
- [ ] Crea key: nome + opzioni, submit, toast, nuova key mostrata (solo una volta).
- [ ] Modifica key (toggle auto lead score, followup): submit, toast.
- [ ] Elimina key: conferma, toast, lista aggiornata.
- [ ] Copia embed code: clipboard e feedback.

### 4.9 CRM Automazioni (`/dashboard/crm/automations`)
- [ ] Lista regole caricata.
- [ ] Crea regola: form (trigger, condizione, azione), submit, toast, refresh.
- [ ] Modifica regola: patch, toast, refresh.
- [ ] Elimina regola: conferma, toast, refresh.
- [ ] Tab/lista log esecuzioni (se presente) caricata.

### 4.10 Scraper (`/dashboard/scraper`)
- [ ] Inserimento URL, “Scraper”: loading, dati scraped o messaggio errore/suggestion.
- [ ] “Genera con AI”: loading, contenuto generato in UI.
- [ ] “Salva in libreria”: loading, toast, redirect a listings (se previsto).

### 4.11 Perfect Copy (`/dashboard/perfect-copy`)
- [ ] Compilazione form, “Genera”: loading, risultati in tab (professionale/breve/titoli/EN).
- [ ] Copia negli appunti: feedback toast.

### 4.12 Translate (`/dashboard/translate`)
- [ ] Input titolo/descrizione, lingua target, “Traduci”: loading, testo tradotto.

### 4.13 Altre pagine “Genera” (titles, social-posts, emotional-listing, followup-emails, video-scripts, agent-bio, hashtags, refine-listing, pdf)
- [ ] Form compilato, pulsante “Genera”/“Crea”: loading, risultato visibile o download (PDF).
- [ ] Errore (es. 429 o 403): toast con messaggio chiaro.

### 4.14 Analyze (`/dashboard/analyze`)
- [ ] Upload immagine o URL: submit, risultato analisi visibile.

### 4.15 Auditor (`/dashboard/auditor`)
- [ ] Input testo o URL: submit, report qualità visibile.
- [ ] Controllo piano (PRO/AGENCY) e paywall se FREE.

### 4.16 Lead Score (`/dashboard/lead-score`)
- [ ] Form lead (nome, messaggio, tipo immobile, ecc.): submit, punteggio e dettagli mostrati.

### 4.17 Opportunities (`/dashboard/opportunities`)
- [ ] Lista opportunità (tipo: underpriced/old/uncontacted) caricata.
- [ ] Filtri (tipo, giorni, città) aggiornano la lista.

### 4.18 Map (`/dashboard/map`)
- [ ] Mappa carica con pin/listing (se PRO/AGENCY).
- [ ] Click su listing o “Chiama”: azione corretta o paywall.

### 4.19 Automazioni (`/dashboard/automations` – followup/reminder/weekly)
- [ ] Lista automazioni caricata.
- [ ] Crea automazione: form, submit, in lista.
- [ ] Esegui ora (se presente): loading, toast.
- [ ] Elimina: conferma, toast, refresh.

### 4.20 Agency Branding (`/dashboard/agency-branding`)
- [ ] Form logo/colori/testo: salvataggio e anteprima coerenti.

### 4.21 Agency Assistant (`/dashboard/agency-assistant`)
- [ ] Chat: invio messaggio, risposta AI (o messaggio di errore chiaro).

### 4.22 Autopilot (`/dashboard/autopilot`)
- [ ] Pagina carica; azioni (attiva/pausa/mandati) con feedback (solo Agency se gated).

### 4.23 Packages (`/dashboard/packages`)
- [ ] Lista pacchetti e acquisti.
- [ ] “Acquista” Agency Boost: redirect a Stripe checkout.

### 4.24 Referral (`/dashboard/referral`)
- [ ] Codice/link referral visibili, copia link: clipboard + toast.

### 4.25 Settings Workspace (`/dashboard/settings/workspace`)
- [ ] Nome agenzia, lingue, preferenze: salva, toast.

### 4.26 Settings Notifications (`/dashboard/settings/notifications`)
- [ ] Toggle notifiche, briefing: salvataggio e toast.

---

## 5. Blindatura struttura (azioni da implementare/verificare)

### 5.1 Error handling
- [ ] Ogni pagina sotto dashboard è wrappata da un Error Boundary (layout o componente) che mostra messaggio generico e “Riprova” / “Torna alla dashboard”.
- [ ] Chiamate API (fetchApi / queryClient) non lasciano promise non gestite: sempre `.catch` o gestione `!res.success` e toast.
- [ ] Messaggi 403: testo unificato tipo “Questa funzionalità richiede un piano superiore” + link a `/dashboard/billing`.

### 5.2 Loading e stati
- [ ] Ogni azione che chiama API ha stato di loading (spinner su bottone o overlay) per evitare doppi click.
- [ ] Liste/tabelle: skeleton o “Caricamento...” mentre `isLoading`.
- [ ] Empty state: messaggio chiaro (es. “Nessun lead”, “Aggiungi il primo annuncio”) e CTA se utile.

### 5.3 Auth e redirect
- [ ] Middleware: utente non loggato che apre `/dashboard/*` → redirect a `/auth/login?redirect=...`.
- [ ] Dopo login, redirect al `redirect` in query (o `/dashboard`).
- [ ] API che ritornano 401: frontend non crasha; da SPA si può mostrare toast “Sessione scaduta” e redirect a login.

### 5.4 Paywall e piani
- [ ] Pagine/feature PRO o AGENCY: controllo lato server (subscription-check) già presente; frontend mostra paywall/modal invece di errore generico quando status === 403.
- [ ] Test con utente FREE: verificare che le CTA “Upgrade” portino a `/dashboard/billing` o checkout.

### 5.5 Accessibilità e UX
- [ ] Pulsanti con `aria-label` dove il testo non è esplicito (es. solo icona).
- [ ] Form: `<label>` associati agli input o `aria-label`.
- [ ] Messaggi di errore associati ai campi (id/aria-describedby) dove possibile.

---

## 6. Design: allineamento e sistemazioni

### 6.1 Layout e spacing
- [ ] Container principale: stessa `max-width` e padding (es. `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`) in tutte le pagine dashboard.
- [ ] Titolo pagina: stile unificato (es. `text-2xl font-bold` + eventuale sottotitolo).
- [ ] Spaziatura tra sezioni: `space-y-6` o `gap-6` coerente.

### 6.2 Bottoni
- [ ] Primario: stesso variant (es. `default` con colore brand) per CTA principali.
- [ ] Secondario/ghost per “Annulla”, “Indietro”.
- [ ] Destructive per “Elimina” (rosso o variant destructive).
- [ ] Dimensioni: almeno `min-h-[36px]` o `size="sm"`/`default` coerente.

### 6.3 Form
- [ ] Label e input allineati (stesso componente `Label` + `Input` da UI).
- [ ] Messaggi di errore sotto il campo, colore errore (es. `text-destructive`).
- [ ] Bottoni submit in fondo al form o nel footer del card.

### 6.4 Card e tabelle
- [ ] Card: stesso `Card`, `CardHeader`, `CardTitle`, `CardContent` dove usate.
- [ ] Tabelle: stessi `Table`, header visibile, righe hover/alternate se previsto.

### 6.5 Empty state e error state
- [ ] Componente `EmptyState` (o equivalente) usato dove serve; icona + titolo + descrizione + opzionale CTA.
- [ ] Stato errore (fallback API): messaggio + pulsante “Riprova”.

### 6.6 Link “Indietro”
- [ ] Pagine secondarie (es. dettaglio lead, singola feature): link “← Torna a …” in alto a sinistra, stile coerente (es. `text-muted-foreground hover:text-foreground`).

---

## 7. Ordine di esecuzione consigliato sul web

1. **Login**: accedere con utente FREE e con utente PRO (o Agency) per testare sia paywall che funzionalità piene.
2. **Dashboard home**: verificare 4.1.
3. **Pagine ad alto uso**: leads, listings, prospecting, billing (sezioni 4.2–4.7).
4. **CRM e Scraper/Perfect Copy**: 4.8–4.11.
5. **Pagine “Genera”**: 4.12–4.13 in batch (stessa checklist: form → genera → risultato/toast).
6. **Analyze, Auditor, Lead Score, Opportunities, Map**: 4.14–4.18.
7. **Automazioni, Branding, Assistant, Autopilot, Packages, Referral, Settings**: 4.19–4.26.
8. **Blindatura**: ripercorrere 5.1–5.5 e correggere dove manca.
9. **Design**: applicare 6.1–6.6 e fare un pass finale visivo su tutte le pagine.

---

## 8. Report problemi (template)

Per ogni problema trovato durante il test, annotare:

- **Pagina**: URL esatto (es. `/dashboard/leads`).
- **Azione**: cosa è stato cliccato/fatto (es. “Click su Elimina lead”).
- **Atteso**: cosa ci si aspetta (es. “Conferma, poi toast e lead rimosso dalla lista”).
- **Risultato**: cosa è successo (es. “Nessun feedback, lista non aggiornata”).
- **Browser/Device**: se rilevante (es. Chrome desktop, Safari mobile).
- **Console/Network**: eventuale errore JS o status code API (es. 500, payload).

Questo documento può essere aggiornato con esiti dei test (es. “OK” / “DA FIX” per ogni voce) e con riferimenti a issue o PR di fix.

---

## 9. (Opzionale) data-testid per test E2E

Aggiungere `data-testid` su submit, delete, modali e liste per Playwright/Cypress.

## Riferimenti

- `docs/PIANO_NETWORK_SAAS.md` · `docs/AUTOMATIONS_VS_CRM_RULES.md` · `components/command-palette.tsx`
