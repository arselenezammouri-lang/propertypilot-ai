# PROPILOT AI - REPORT TECNICO COMPLETO
## Stato Progetto: Real Estate Prospecting Engine + Voice AI Integration

**Data Report:** Gennaio 2025  
**Versione:** 1.0 MVP  
**Target:** €100k/mese MRR (€100.000 ricavi ricorrenti mensili)

---

## 📊 STATO IMPLEMENTAZIONE: READY vs MISSING

### ✅ **READY (Pronto per Produzione)**

#### 1. **DATABASE & INFRASTRUTTURA**
- ✅ **Tabelle Supabase create:**
  - `external_listings` - Tabella principale per annunci esterni (scalabile a migliaia/giorno)
  - `prospecting_filters` - Filtri ricerca utente (10 PRO, 50 AGENCY)
  - `leads` - CRM completo con lead scoring
  - `subscriptions` - Gestione piani Stripe
  - `communication_logs` - Log comunicazioni
  - `automations_rules` - Regole automazione
  - `saved_listings` - Annunci salvati utente

- ✅ **Indici ottimizzati:** Composite indexes, partial indexes, GIN per full-text search
- ✅ **RLS Policies:** Sicurezza a livello database implementata
- ✅ **Cleanup automatico:** Funzione `archive_old_listings(60)` per archiviazione dopo 60 giorni

#### 2. **SCRAPING ENGINE (Esistente)**
- ✅ **Scrapers implementati:**
  - `IdealistaScraper` - `/lib/scrapers/idealista-scraper.ts`
  - `ImmobiliareScraper` - `/lib/scrapers/immobiliare-scraper.ts`
  - `ZillowScraper` - `/lib/scrapers/zillow-scraper.ts`
  - `CasaScraper` - `/lib/scrapers/casa-scraper.ts`
  - `SubitoScraper` - `/lib/scrapers/subito-scraper.ts`

- ✅ **Factory Pattern:** `/lib/scrapers/factory.ts` - Selezione automatica scraper per URL
- ✅ **API Endpoint:** `/app/api/scrape-listing/route.ts` - Scraping on-demand
- ✅ **API Endpoint:** `/app/api/analyze-link/route.ts` - Analisi completa con AI

**NOTA CRITICA:** Gli scrapers esistono ma sono **on-demand** (chiamati manualmente). **MANCA** il sistema di scraping automatico basato su filtri.

#### 3. **VOICE AI INTEGRATION (Completato)**
- ✅ **Modulo Voice Agent:** `/lib/ai/voice-agent.ts`
  - Integrazione Bland AI API
  - Script chiamata prospecting
  - Objection handlers (6 obiezioni comuni gestite)
  - Analisi outcome chiamata

- ✅ **API Endpoint:** `/app/api/prospecting/call/route.ts`
  - Avvio chiamata con `listing_id`
  - Recupero numero telefono da `external_listings`
  - Aggiornamento status a 'called'

- ✅ **Webhook Handler:** `/app/api/prospecting/call/webhook/route.ts`
  - Riceve callback da Bland AI
  - Analizza transcript
  - Aggiorna status ('appointment_set', 'rejected', 'no_answer')
  - Salva transcript in `ai_summary`

#### 4. **PROSPECTING FILTERS API (Completato)**
- ✅ **Endpoint CRUD:** `/app/api/prospecting/filters/route.ts`
  - GET: Lista filtri utente
  - POST: Crea nuovo filtro (con limite piano)
  - PATCH: Aggiorna filtro
  - DELETE: Elimina filtro

- ✅ **Protezione:** `requireProOrAgencySubscription()` implementata
- ✅ **Limiti per piano:** 
  - PRO: max 10 filtri attivi ✅
  - AGENCY: max 50 filtri attivi ✅

#### 5. **CRM COMPLETO (Esistente)**
- ✅ **Lead Management:**
  - Dashboard `/dashboard/leads` - Lista lead con filtri
  - Pipeline Kanban `/dashboard/leads/pipeline` - Drag & drop
  - Dettaglio lead `/dashboard/leads/[id]` - Vista completa

- ✅ **Lead Scoring AI:** `/app/api/lead-score/route.ts`
  - Score 0-100
  - Categoria HOT/WARM/COLD
  - Suggerimenti azioni
  - Aggiornamento automatico database

- ✅ **Lead Enrichment AI:** `/app/api/leads/enrich/route.ts`
  - Profilo psicografico
  - Probabilità chiusura
  - Budget analysis
  - Buyer persona

- ✅ **Communication Hub:** `/app/api/leads/[id]/followup/route.ts`
  - Genera WhatsApp, Email, SMS
  - 3 toni: Persuasivo, Gentile, Emozionale
  - Adattamento per categoria lead

#### 6. **AI LISTING ENGINE 2.0 (Completato)**
- ✅ **Generazione Multi-Style:** `/app/api/generate/route.ts`
  - Luxury Style (emozionale, premium)
  - Investment Style (ROI, numeri, CAP Rate)
  - Standard Pro (ottimizzato portali)

- ✅ **Multi-Titolo A/B Testing:** 5 titoli ottimizzati per CTR
- ✅ **Localizzazione:** Terminologia USA vs Italia
- ✅ **Cache intelligente:** Include style e market nella cache key

#### 7. **SICUREZZA & SUBSCRIPTION (Completato)**
- ✅ **Subscription Check:** `/lib/utils/subscription-check.ts`
  - `requireActiveSubscription()` - Per funzionalità base
  - `requireProOrAgencySubscription()` - Per funzionalità premium

- ✅ **Stripe Integration:**
  - Webhook hardening (usa `price_id` non metadata)
  - Checkout session
  - Subscription management
  - Upgrade/downgrade

- ✅ **Rate Limiting:** User + IP rate limiting su tutti gli endpoint AI

---

### ❌ **MISSING (Mancante per MVP)**

#### 1. **SCRAPING AUTOMATICO (CRITICO)**
- ❌ **Cron Job / Scheduled Tasks:**
  - Nessun sistema per eseguire scraping automatico basato su `prospecting_filters`
  - Gli scrapers esistono ma devono essere chiamati manualmente
  - **SOLUZIONE NECESSARIA:**
    - Implementare endpoint `/app/api/prospecting/scrape/route.ts` che:
      1. Legge filtri attivi con `auto_run = true`
      2. Per ogni filtro, esegue scraping su piattaforme configurate
      3. Inserisce risultati in `external_listings` con deduplicazione
      4. Chiama AI per estrarre numero telefono e owner_name
    - Configurare cron job (Vercel Cron, GitHub Actions, o servizio esterno) per eseguire ogni X ore

- ❌ **Estrazione Contatti AI:**
  - Scraper estrae solo dati pubblici (titolo, prezzo, location)
  - **MANCA** logica AI per estrarre `phone_number` e `owner_name` da annuncio
  - **SOLUZIONE:** Aggiungere chiamata OpenAI dopo scraping per analizzare descrizione e estrarre contatti

#### 2. **DASHBOARD PROSPECTING (CRITICO)**
- ❌ **Pagina UI Mancante:** `/app/dashboard/prospecting/page.tsx`
  - **COMPONENTI DA CREARE:**
    1. **Lista Annunci:** Tabella con colonne:
       - Titolo, Location, Prezzo
       - Status (new, called, appointment_set, rejected)
       - Source Platform (badge)
       - Lead Score (se disponibile)
       - Azioni rapide (Chiama, Dettagli, Reject)
    
    2. **Filtri Sidebar:**
       - Filtro per status
       - Filtro per source_platform
       - Filtro per location (search)
       - Filtro per price range
    
    3. **Card Dettaglio Annuncio:**
       - Informazioni complete
       - AI Summary (quality_score, detected_objections, best_time_to_call)
       - Transcript chiamata (se disponibile)
       - Pulsante "Avvia Chiamata AI"
    
    4. **Gestione Filtri:**
       - Lista filtri attivi
       - Crea/Modifica/Elimina filtro
       - Toggle `auto_run`
       - Statistiche (listings_found_count)

- ❌ **Integrazione con API:**
  - Chiamata GET `/api/prospecting/listings` (da creare)
  - Chiamata POST `/api/prospecting/call` (esiste)
  - Chiamata GET `/api/prospecting/filters` (esiste)

#### 3. **NOTIFICHE EMAIL (IMPORTANTE)**
- ❌ **Sistema Notifiche:**
  - Quando webhook riceve `appointment_set`, **MANCA** invio email all'agente
  - **SOLUZIONE NECESSARIA:**
    - Integrare servizio email (Resend, SendGrid, o AWS SES)
    - Creare template email notifica appuntamento
    - Aggiungere logica in `/app/api/prospecting/call/webhook/route.ts`:
      ```typescript
      if (newStatus === 'appointment_set') {
        await sendAppointmentNotification(user_id, listing);
      }
      ```

- ⚠️ **Stato Attuale:** `/app/api/communications/send-email/route.ts` ha commento:
  ```typescript
  // In production, integrate with email service (SendGrid, Resend, etc.)
  // For now, we simulate sending and log the communication
  ```
  **Email è simulata, non inviata realmente.**

#### 4. **API ENDPOINT MANCANTI**
- ❌ **GET `/api/prospecting/listings`**
  - Lista annunci con filtri (status, platform, location, price)
  - Paginazione
  - Ordinamento

- ❌ **POST `/api/prospecting/scrape`**
  - Esegue scraping per un filtro specifico
  - Inserisce risultati in `external_listings`
  - Ritorna count annunci trovati

- ❌ **PATCH `/api/prospecting/listings/[id]`**
  - Aggiorna status manuale
  - Aggiunge note
  - Marca come rejected/converted

#### 5. **ESTRAZIONE CONTATTI AI**
- ❌ **Modulo AI per estrarre phone_number e owner_name:**
  - Analizza descrizione annuncio
  - Estrae numero telefono (pattern matching + AI)
  - Estrae nome proprietario
  - Salva in `external_listings.phone_number` e `external_listings.owner_name`

---

## 🎯 ROADMAP PER MVP COMPLETO

### **FASE 1: Scraping Automatico (Priorità ALTA)**
1. Creare `/app/api/prospecting/scrape/route.ts`
2. Implementare estrazione contatti AI
3. Configurare cron job per esecuzione automatica

### **FASE 2: Dashboard UI (Priorità ALTA)**
1. Creare `/app/dashboard/prospecting/page.tsx`
2. Componenti: Lista, Filtri, Dettaglio, Gestione Filtri
3. Integrazione con API esistenti

### **FASE 3: Notifiche (Priorità MEDIA)**
1. Integrare servizio email (Resend consigliato)
2. Template email notifica appuntamento
3. Trigger in webhook handler

### **FASE 4: API Completamento (Priorità MEDIA)**
1. GET `/api/prospecting/listings`
2. PATCH `/api/prospecting/listings/[id]`

---

## 📈 VALORE TECNICO IMPLEMENTATO

### **Architettura Scalabile:**
- Database ottimizzato per migliaia di annunci/giorno
- Cache AI per ridurre costi OpenAI
- Rate limiting per proteggere API
- Deduplicazione URL per evitare duplicati

### **Sicurezza Enterprise:**
- Subscription check centralizzato
- RLS policies su tutte le tabelle
- Webhook hardening (no metadata manipulation)
- Validazione input con Zod

### **AI Integration:**
- 14+ endpoint AI protetti
- Prompt engineering avanzato
- Multi-market support (Italia/USA)
- Objection handling intelligente

---

## ⚠️ RISCHI E LIMITAZIONI

1. **Scraping Rate Limits:** I portali possono bloccare IP se scraping troppo aggressivo
   - **Soluzione:** Implementare delay tra richieste, rotazione proxy (futuro)

2. **Costi OpenAI:** Generazione AI per migliaia di annunci può essere costosa
   - **Mitigazione:** Cache implementata, rate limiting attivo

3. **Bland AI Costs:** Chiamate voice AI hanno costo per minuto
   - **Mitigazione:** Rate limiting 500/giorno PRO, 2000/giorno AGENCY

4. **Email Service:** Attualmente simulato, serve integrazione reale
   - **Soluzione:** Integrare Resend (€20/mese per 50k email)

---

## ✅ CONFERME TECNICHE

### **Limiti Filtri Implementati:**
```typescript
// File: app/api/prospecting/filters/route.ts
const FILTER_LIMITS: Record<string, number> = {
  pro: 10,      // ✅ Implementato
  agency: 50,   // ✅ Implementato
};
```

### **Protezione Subscription:**
- ✅ `requireProOrAgencySubscription()` attiva su:
  - `/api/prospecting/filters`
  - `/api/prospecting/call`
  - `/api/lead-score`
  - `/api/leads/[id]/followup`

---

## 📝 NOTE PER IL TEAM

1. **Variabili Ambiente Necessarie:**
   - `BLAND_AI_API_KEY` - Per voice calls
   - `OPENAI_API_KEY` - Già configurata
   - `STRIPE_SECRET_KEY` - Già configurata
   - `NEXT_PUBLIC_SUPABASE_URL` - Già configurata
   - `SUPABASE_SERVICE_ROLE_KEY` - Già configurata

2. **Database Migration:**
   - Eseguire `supabase-prospecting-migration.sql` in Supabase SQL Editor
   - Verificare tabelle create
   - Testare RLS policies

3. **Testing Necessario:**
   - Test chiamata Bland AI end-to-end
   - Test webhook callback
   - Test scraping automatico
   - Test limiti filtri per piano

---

**Prossimi Step Consigliati:**
1. Implementare scraping automatico (FASE 1)
2. Creare dashboard prospecting (FASE 2)
3. Integrare notifiche email (FASE 3)

