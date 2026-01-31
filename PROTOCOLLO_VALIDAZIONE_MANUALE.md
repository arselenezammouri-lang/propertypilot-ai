# 🔬 PROTOCOLLO DI VALIDAZIONE MANUALE
## PropertyPilot AI - QA Testing Protocol

**Versione:** 1.0  
**Data:** Gennaio 2025  
**Target:** Pre-Lancio Globale  
**Status:** ⚠️ **CRITICO - ESECUZIONE OBBLIGATORIA**

---

## 📋 INDICE

1. [TEST DI FLUSSO ACQUISIZIONE](#1-test-di-flusso-acquisizione)
2. [TEST DEL 'KILLER' VOICE AI](#2-test-del-killer-voice-ai)
3. [TEST DI INTELLIGENCE](#3-test-di-intelligence)
4. [TEST COMMERCIALE (STRIPE)](#4-test-commerciale-stripe)
5. [TEST GLOBALE (i18n + RTL)](#5-test-globale-i18n--rtl)

---

## 1. TEST DI FLUSSO ACQUISIZIONE

### **OBIETTIVO:** Verificare che un link incollato (Idealista/Zillow) generi correttamente annunci in 3 stili e 6 lingue.

### **PREREQUISITI:**
- ✅ Account attivo con subscription **STARTER** o superiore
- ✅ Accesso a `/dashboard/scraper`
- ✅ URL di test validi:
  - **Idealista:** `https://www.idealista.it/inmueble/[ID]/`
  - **Zillow:** `https://www.zillow.com/homedetails/[ADDRESS]/[ZPID]/`

---

### **SEQUENZA DI TEST:**

#### **STEP 1: Inserimento URL**
**AZIONE:** 
1. Vai su `/dashboard/scraper`
2. Incolla un URL Idealista o Zillow nel campo "URL Annuncio"
3. Clicca "Analizza Annuncio"

**COSA INSERIRE:**
```
URL Idealista: https://www.idealista.it/inmueble/12345678/
URL Zillow: https://www.zillow.com/homedetails/123-Main-St-Miami-FL-33139/12345678_zpid/
```

**RISULTATO ATTESO:**
- ✅ Loading spinner appare
- ✅ Dopo 3-8 secondi, vedi sezione "Dati Estratti" con:
  - Titolo immobile
  - Prezzo (formattato con valuta)
  - Località
  - Superficie (mq o sqft)
  - Numero locali
  - Descrizione raw
  - Foto (se disponibili)
- ✅ Toast notification: "Scraping completato! Dati estratti con successo. Generazione contenuti AI in corso..."

---

#### **STEP 2: Verifica Generazione Automatica AI**
**AZIONE:**
- Attendi 5-15 secondi dopo lo scraping
- La generazione AI parte automaticamente

**COSA CONTROLLARE:**
- Sezione "Contenuti Generati" appare
- 3 stili generati:
  1. **Professional** (standard)
  2. **Short** (breve)
  3. **Luxury** (se style='luxury' selezionato)

**RISULTATO ATTESO:**
- ✅ Ogni stile contiene:
  - Titolo ottimizzato SEO
  - Descrizione professionale (200-500 parole)
  - Call-to-action chiaro
  - Keywords rilevanti
  - Formattazione corretta (paragrafi, elenchi)

---

#### **STEP 3: Test Multi-Lingua (6 Lingue)**
**AZIONE:**
1. Nella sezione "Contenuti Generati", cerca dropdown "Lingua" o "Traduci in"
2. Seleziona ogni lingua: **IT, EN, ES, FR, DE, AR**

**COSA INSERIRE:**
- Clicca su ogni lingua nel selettore
- Attendi traduzione (2-5 secondi per lingua)

**RISULTATO ATTESO:**
- ✅ **IT (Italiano):** Testo originale o tradotto correttamente
- ✅ **EN (Inglese):** Traduzione professionale, terminologia immobiliare corretta
- ✅ **ES (Spagnolo):** Traduzione fluida, formattazione preservata
- ✅ **FR (Francese):** Terminologia immobiliare francese corretta
- ✅ **DE (Tedesco):** Traduzione precisa, struttura mantenuta
- ✅ **AR (Arabo):** 
  - **CRITICO:** Layout RTL attivato automaticamente
  - Testo allineato a destra
  - Numeri e date formattati correttamente
  - Caratteri arabi leggibili (font supportato)

**VALIDAZIONE TESTI:**
Per ogni lingua, verifica che:
- ❌ **NON** ci siano testi hardcoded in italiano
- ✅ Terminologia immobiliare corretta (es. "appartamento" → "apartment" / "appartement" / "Wohnung")
- ✅ Prezzi formattati con valuta locale (€, $, £, د.إ)
- ✅ Misure convertite (mq → sqft per EN/USA)

---

#### **STEP 4: Download PDF Multi-Lingua**
**AZIONE:**
1. Dopo generazione, clicca "Scarica PDF" per ogni lingua
2. Verifica PDF generato

**RISULTATO ATTESO:**
- ✅ PDF contiene:
  - Logo PropertyPilot AI (se white-label abilitato)
  - Titolo e descrizione nella lingua selezionata
  - Foto immobile (se disponibili)
  - Formattazione professionale
  - Footer con branding
- ✅ Per **AR (Arabo):** Layout RTL nel PDF (testo da destra a sinistra)

---

#### **STEP 5: Verifica Database**
**AZIONE:**
1. Vai su `/dashboard/listings`
2. Cerca l'annuncio appena generato

**RISULTATO ATTESO:**
- ✅ Annuncio salvato in `saved_listings` con:
  - `source_url` originale
  - `raw_data` completo (dati scraped)
  - `generated_content` (3 stili + traduzioni)
  - `user_id` corretto
  - `created_at` timestamp recente

---

### **CHECKLIST FINALE FLUSSO ACQUISIZIONE:**
- [ ] Scraping funziona per Idealista
- [ ] Scraping funziona per Zillow
- [ ] 3 stili generati correttamente
- [ ] 6 lingue tradotte senza errori
- [ ] RTL attivo per Arabo
- [ ] PDF scaricabile per ogni lingua
- [ ] Annuncio salvato nel database
- [ ] Nessun testo hardcoded italiano rimasto

---

## 2. TEST DEL 'KILLER' VOICE AI

### **OBIETTIVO:** Verificare che il tasto "Chiama Ora" invii dati corretti a Bland AI, riceva webhook e aggiorni status/appuntamenti.

### **PREREQUISITI:**
- ✅ Account con subscription **PRO** o **AGENCY** (Voice AI non disponibile su Starter)
- ✅ Accesso a `/dashboard/prospecting`
- ✅ Listing con:
  - `status: 'new'`
  - `phone_number` valido (formato: +39 333 1234567 o +1 305 555 1234)
  - `lead_score >= 70` (per badge "🔥 CHIAMA ORA")
- ✅ Bland AI API Key configurata in `.env.local`
- ✅ Webhook URL pubblico accessibile (ngrok o dominio produzione)

---

### **SEQUENZA DI TEST:**

#### **STEP 1: Verifica Tasto "Chiama Ora" Visibile**
**AZIONE:**
1. Vai su `/dashboard/prospecting`
2. Cerca listing con badge "🔥 TOP DEAL" o "💎 SOLDI"
3. Verifica presenza pulsante "🔥 CHIAMA ORA"

**COSA CONTROLLARE:**
- Listing deve avere:
  - `status: 'new'`
  - `phone_number` non nullo
  - `lead_score >= 70` (opzionale, ma raccomandato)

**RISULTATO ATTESO:**
- ✅ Pulsante "🔥 CHIAMA ORA" visibile
- ✅ Badge "TOP DEAL" o "💎 SOLDI" presente
- ✅ Se subscription FREE/STARTER: pulsante disabilitato con tooltip "Richiede piano PRO o AGENCY"

---

#### **STEP 2: Avvio Chiamata**
**AZIONE:**
1. Clicca "🔥 CHIAMA ORA" su un listing valido
2. Attendi risposta API (1-3 secondi)

**COSA INSERIRE:**
- Listing ID valido (UUID)
- Subscription PRO/AGENCY attiva

**RISULTATO ATTESO:**
- ✅ Toast notification: "Chiamata avviata con successo"
- ✅ Status listing cambia da `'new'` a `'called'` (aggiornamento istantaneo UI)
- ✅ Badge "🔥 CHIAMA ORA" scompare, sostituito da "📞 In chiamata..."
- ✅ Console browser: Request a `/api/prospecting/call` con:
  ```json
  {
    "listing_id": "uuid-here",
    "webhook_url": "https://your-domain.com/api/prospecting/call/webhook?listing_id=uuid-here"
  }
  ```

---

#### **STEP 3: Verifica Invio a Bland AI**
**AZIONE:**
1. Apri Network tab in DevTools
2. Filtra richieste a `api.bland.ai`
3. Verifica payload inviato

**COSA CONTROLLARE:**
- Request POST a `https://api.bland.ai/v1/calls`
- Headers:
  - `Authorization: Bearer [BLAND_AI_API_KEY]`
  - `Content-Type: application/json`
- Body contiene:
  ```json
  {
    "phone_number": "+39 333 1234567",
    "task": "[Script generato con dati listing]",
    "from": "[Numero configurato]",
    "voicemail_detection": true,
    "model": "enhanced",
    "webhook_url": "https://your-domain.com/api/prospecting/call/webhook?listing_id=uuid"
  }
  ```

**RISULTATO ATTESO:**
- ✅ Bland AI risponde con:
  ```json
  {
    "call_id": "call_abc123",
    "status": "queued",
    "message": "Call queued successfully"
  }
  ```
- ✅ `call_id` salvato nel database (opzionale, se campo esiste)

---

#### **STEP 4: Simulazione Webhook (Appuntamento Fissato)**
**AZIONE:**
1. **OPZIONE A (Test Manuale):** Usa Stripe CLI o tool webhook:
   ```bash
   curl -X POST https://your-domain.com/api/prospecting/call/webhook?listing_id=UUID \
     -H "Content-Type: application/json" \
     -d '{
       "call_id": "call_test123",
       "status": "completed",
       "transcript": "Proprietario ha confermato disponibilità per visita giovedì 15 gennaio alle 15:00. Indirizzo: Via Roma 10, Milano.",
       "duration": 180,
       "phone_number": "+39 333 1234567"
     }'
   ```

2. **OPZIONE B (Test Reale):** Attendi chiamata Bland AI reale (5-10 minuti)

**COSA INSERIRE:**
- `listing_id` corretto (UUID del listing testato)
- `transcript` contenente keyword "appuntamento", "visita", "disponibile", "giovedì", "15:00"

**RISULTATO ATTESO:**
- ✅ Webhook ricevuto e processato (status 200)
- ✅ `analyzeCallOutcome()` rileva `appointment_set` dal transcript
- ✅ Database aggiornato:
  - `status: 'appointment_set'`
  - `ai_summary.call_transcript` salvato
  - `ai_summary.call_outcome: 'appointment_set'`
  - `ai_summary.call_completed_at` timestamp
- ✅ UI aggiornata: Badge cambia in "✅ Appuntamento Fissato"

---

#### **STEP 5: Verifica Google Calendar Sync**
**AZIONE:**
1. Dopo webhook `appointment_set`, verifica:
   - Email notifica inviata (se configurata)
   - Evento Google Calendar creato

**COSA CONTROLLARE:**
- Google Calendar API chiamata (se configurata)
- Evento creato con:
  - Titolo: "Visita: [Titolo Listing]"
  - Data/Ora: Estratta dal transcript
  - Location: Indirizzo estratto o location listing
  - Descrizione: Transcript completo

**RISULTATO ATTESO:**
- ✅ Se Google Calendar configurato: Evento creato automaticamente
- ✅ Se non configurato: Nessun errore, processo continua
- ✅ Email notifica (se Resend configurato) inviata all'utente

---

#### **STEP 6: Verifica Dashboard Aggiornata**
**AZIONE:**
1. Ricarica `/dashboard/prospecting`
2. Filtra per `status: 'appointment_set'`

**RISULTATO ATTESO:**
- ✅ Listing appare con:
  - Badge "✅ Appuntamento Fissato"
  - Transcript visibile in modal dettaglio
  - Data appuntamento estratta e mostrata
  - Pulsante "Vedi Dettagli" funzionante

---

### **CHECKLIST FINALE VOICE AI:**
- [ ] Pulsante "🔥 CHIAMA ORA" visibile solo per PRO/AGENCY
- [ ] Chiamata avviata correttamente
- [ ] Bland AI riceve dati corretti
- [ ] Webhook ricevuto e processato
- [ ] Status aggiornato a `appointment_set`
- [ ] Transcript salvato nel database
- [ ] Google Calendar evento creato (se configurato)
- [ ] Email notifica inviata (se configurato)
- [ ] UI aggiornata istantaneamente

---

## 3. TEST DI INTELLIGENCE

### **OBIETTIVO:** Verificare che Lead Scoring (0-100) e Market Gap siano precisi e che il badge 💎 SOLDI appaia correttamente.

### **PREREQUISITI:**
- ✅ Account attivo
- ✅ Accesso a `/dashboard/prospecting`
- ✅ Listing con dati completi (prezzo, superficie, location)

---

### **SEQUENZA DI TEST:**

#### **STEP 1: Verifica Lead Score Calcolato**
**AZIONE:**
1. Vai su `/dashboard/prospecting`
2. Seleziona un listing
3. Apri modal dettaglio
4. Verifica campo "Lead Score"

**COSA INSERIRE:**
- Listing con:
  - Prezzo: €500.000
  - Superficie: 100 mq
  - Location: "Milano, Centro"
  - Descrizione: "Vendita urgente, trasferimento lavoro, prezzo sotto mercato"

**RISULTATO ATTESO:**
- ✅ Lead Score visualizzato: **Numero da 0 a 100**
- ✅ Se descrizione contiene "urgente", "svendita", "sotto mercato": Score >= 75
- ✅ Se zona "centro" o "prestigiosa": Score += 10-15 punti
- ✅ Badge mostrato:
  - **0-49:** "❄️ COLD" (grigio)
  - **50-69:** "🔥 WARM" (arancione)
  - **70-84:** "🔥 TOP DEAL" (rosso)
  - **85-100:** "💎 SOLDI" (oro/diamante)

---

#### **STEP 2: Verifica Market Gap Calcolato**
**AZIONE:**
1. Nello stesso listing, verifica campo "Market Gap"
2. Apri modal "Investment Analysis" (se disponibile)

**COSA INSERIRE:**
- Listing con:
  - Prezzo: €1.000.000
  - Superficie: 150 mq
  - Prezzo/mq: €6.667/mq
  - Location: "Milano, Porta Nuova" (zona premium, media ~€8.500/mq)

**RISULTATO ATTESO:**
- ✅ Market Gap calcolato: **Percentuale positiva** (es. 22.5%)
- ✅ Formula: `((marketAvgPricePerSqm - pricePerSqm) / marketAvgPricePerSqm) * 100`
- ✅ Se Market Gap >= 18%: Badge "💎 SOLDI" visibile
- ✅ Se Market Gap < 18%: Badge "🔥 TOP DEAL" o inferiore

**VALIDAZIONE CALCOLO:**
- Prezzo/mq listing: €6.667/mq
- Media zona (Porta Nuova): ~€8.500/mq (stimata)
- Market Gap: `((8500 - 6667) / 8500) * 100 = 21.6%`
- ✅ Market Gap >= 18% → Badge "💎 SOLDI"

---

#### **STEP 3: Test Badge 💎 SOLDI**
**AZIONE:**
1. Cerca listing con:
   - `lead_score >= 85` **OPPURE**
   - `market_gap >= 18%`
2. Verifica badge visibile

**COSA INSERIRE:**
- Usa script `seed-elite-deals.ts` per inserire listing di test:
  ```bash
  npx tsx scripts/seed-elite-deals.ts <user_id>
  ```
- Listing seed hanno:
  - `lead_score: 88-96`
  - `market_gap: 18-25%`

**RISULTATO ATTESO:**
- ✅ Badge "💎 SOLDI" visibile su listing con:
  - Lead Score >= 85 **E/O** Market Gap >= 18%
- ✅ Badge "🔥 TOP DEAL" su listing con:
  - Lead Score 70-84 **E** Market Gap < 18%
- ✅ Badge "🔥 WARM" su listing con:
  - Lead Score 50-69
- ✅ Badge "❄️ COLD" su listing con:
  - Lead Score < 50

---

#### **STEP 4: Verifica Calcolo Market Gap da Database**
**AZIONE:**
1. Verifica che Market Gap sia salvato in:
   - `ai_summary.market_gap` (priorità)
   - `raw_data.market_gap_percentage` (fallback)
2. Se non presente, verifica calcolo in tempo reale

**COSA CONTROLLARE:**
- Query database:
  ```sql
  SELECT 
    id, 
    title, 
    price, 
    location,
    ai_summary->>'market_gap' as market_gap,
    raw_data->>'market_gap_percentage' as market_gap_raw
  FROM external_listings
  WHERE user_id = '[your_user_id]'
  LIMIT 10;
  ```

**RISULTATO ATTESO:**
- ✅ Market Gap presente in `ai_summary.market_gap` (se calcolato da AI)
- ✅ Market Gap presente in `raw_data.market_gap_percentage` (se da seed script)
- ✅ Se assente, calcolo in tempo reale funziona (frontend)

---

#### **STEP 5: Test Edge Cases**
**AZIONE:**
1. Testa listing con dati mancanti:
   - Prezzo nullo
   - Superficie nullo
   - Location vuota

**RISULTATO ATTESO:**
- ✅ Lead Score: Fallback a 50 (score base)
- ✅ Market Gap: `null` (non calcolabile)
- ✅ Nessun crash, UI mostra "Dati insufficienti"

---

### **CHECKLIST FINALE INTELLIGENCE:**
- [ ] Lead Score calcolato correttamente (0-100)
- [ ] Market Gap calcolato correttamente (%)
- [ ] Badge "💎 SOLDI" appare per Score >= 85 o Gap >= 18%
- [ ] Badge "🔥 TOP DEAL" appare per Score 70-84
- [ ] Calcolo funziona anche con dati parziali
- [ ] Market Gap salvato nel database
- [ ] UI mostra valori formattati correttamente

---

## 4. TEST COMMERCIALE (STRIPE)

### **OBIETTIVO:** Verificare che il database sblocchi le feature (Aura VR, Automazioni illimitate) passando da Starter a Agency.

### **PREREQUISITI:**
- ✅ Account con subscription **STARTER** attiva
- ✅ Accesso a `/dashboard/billing`
- ✅ Stripe Test Mode configurato
- ✅ Webhook Stripe configurato (ngrok o dominio produzione)

---

### **SEQUENZA DI TEST:**

#### **STEP 1: Verifica Stato Attuale (STARTER)**
**AZIONE:**
1. Vai su `/dashboard/billing`
2. Verifica piano attuale: "Starter"
3. Prova ad accedere a feature PRO:
   - `/dashboard/prospecting` → Tasto "🔥 CHIAMA ORA" (dovrebbe essere disabilitato)
   - `/dashboard/automations` → Limite 20 automazioni/mese
   - Aura VR → Non disponibile

**COSA CONTROLLARE:**
- Query database:
  ```sql
  SELECT 
    status as subscription_plan,
    stripe_subscription_id,
    current_period_end
  FROM subscriptions
  WHERE user_id = '[your_user_id]';
  ```

**RISULTATO ATTESO:**
- ✅ `subscriptions.status = 'starter'`
- ✅ `profiles.subscription_plan = 'starter'`
- ✅ Feature PRO/AGENCY bloccate:
  - Voice AI: Disabilitato
  - Automazioni: Limite 20/mese
  - Aura VR: Non accessibile

---

#### **STEP 2: Upgrade a PRO**
**AZIONE:**
1. Vai su `/dashboard/billing`
2. Clicca "Upgrade to PRO"
3. Completa checkout Stripe (usa carta test: `4242 4242 4242 4242`)
4. Attendi redirect a `/dashboard?upgrade=success`

**COSA INSERIRE:**
- Stripe Test Card: `4242 4242 4242 4242`
- Expiry: Qualsiasi data futura
- CVC: Qualsiasi 3 cifre

**RISULTATO ATTESO:**
- ✅ Checkout Stripe completato
- ✅ Redirect a `/dashboard?upgrade=success`
- ✅ Toast notification: "Upgrade completato! Benvenuto nel piano PRO"

---

#### **STEP 3: Verifica Webhook Stripe (PRO)**
**AZIONE:**
1. Attendi webhook Stripe (5-10 secondi)
2. Verifica database aggiornato

**COSA CONTROLLARE:**
- Stripe Dashboard → Webhooks → Eventi recenti:
  - `checkout.session.completed`
  - `customer.subscription.created`
- Database:
  ```sql
  SELECT 
    status,
    stripe_subscription_id,
    price_id,
    current_period_start,
    current_period_end
  FROM subscriptions
  WHERE user_id = '[your_user_id]';
  ```

**RISULTATO ATTESO:**
- ✅ `subscriptions.status = 'pro'`
- ✅ `subscriptions.stripe_subscription_id` popolato
- ✅ `subscriptions.price_id` corrisponde a PRO price ID
- ✅ `subscriptions.current_period_start` e `current_period_end` impostati
- ✅ `profiles.subscription_plan = 'pro'`

---

#### **STEP 4: Verifica Feature Sbloccate (PRO)**
**AZIONE:**
1. Ricarica dashboard
2. Verifica feature PRO accessibili:
   - `/dashboard/prospecting` → Tasto "🔥 CHIAMA ORA" abilitato
   - `/dashboard/automations` → Limite 20 automazioni/mese (non illimitato)
   - Aura VR → Solo visualizzazione (non generazione)

**RISULTATO ATTESO:**
- ✅ Voice AI: **30 chiamate/mese** disponibili
- ✅ Automazioni: **20 automazioni/mese** (limite PRO)
- ✅ Aura VR: **Solo visualizzazione** (non generazione)
- ✅ Virtual Staging 3D: Disponibile
- ✅ CRM: Accessibile

---

#### **STEP 5: Upgrade a AGENCY**
**AZIONE:**
1. Vai su `/dashboard/billing`
2. Clicca "Upgrade to AGENCY"
3. Completa checkout Stripe
4. Attendi webhook

**RISULTATO ATTESO:**
- ✅ Checkout completato
- ✅ Webhook ricevuto
- ✅ Database aggiornato: `status = 'agency'`

---

#### **STEP 6: Verifica Feature AGENCY Sbloccate**
**AZIONE:**
1. Ricarica dashboard
2. Verifica feature AGENCY:
   - Voice AI: **Illimitato** (nessun limite)
   - Automazioni: **Illimitate** (nessun limite)
   - Aura VR: **Generazione illimitata** (non solo visualizzazione)

**COSA CONTROLLARE:**
- Query database:
  ```sql
  SELECT status FROM subscriptions WHERE user_id = '[your_user_id]';
  ```
- Verifica logica frontend:
  ```typescript
  // app/dashboard/prospecting/page.tsx
  const canCall = subscriptionPlan === 'pro' || subscriptionPlan === 'agency';
  const callLimit = subscriptionPlan === 'agency' ? -1 : 30; // -1 = illimitato
  ```

**RISULTATO ATTESO:**
- ✅ Voice AI: **Illimitato** (nessun badge "30/mese")
- ✅ Automazioni: **Illimitate** (nessun limite mensile)
- ✅ Aura VR: **Generazione illimitata** (pulsante "Genera Tour" disponibile)
- ✅ Auto-Prospecting 24/7: Attivo
- ✅ Team multi-utente: Fino a 10 agenti

---

#### **STEP 7: Test Downgrade (AGENCY → FREE)**
**AZIONE:**
1. Vai su `/dashboard/billing`
2. Clicca "Cancella Abbonamento"
3. Conferma cancellazione
4. Attendi webhook `customer.subscription.deleted`

**RISULTATO ATTESO:**
- ✅ Webhook ricevuto
- ✅ Database aggiornato: `status = 'free'`
- ✅ Feature PRO/AGENCY bloccate immediatamente
- ✅ Messaggio: "Abbonamento cancellato. Le feature premium non sono più disponibili."

---

### **CHECKLIST FINALE STRIPE:**
- [ ] Upgrade STARTER → PRO funziona
- [ ] Webhook aggiorna database correttamente
- [ ] Feature PRO sbloccate dopo upgrade
- [ ] Upgrade PRO → AGENCY funziona
- [ ] Feature AGENCY sbloccate (Voice AI illimitato, Aura VR generazione)
- [ ] Downgrade blocca feature correttamente
- [ ] `profiles.subscription_plan` sincronizzato con `subscriptions.status`
- [ ] Nessuna feature PRO accessibile senza pagamento confermato

---

## 5. TEST GLOBALE (i18n + RTL)

### **OBIETTIVO:** Verificare che Aria e la Predator Map si adattino correttamente quando passiamo dall'italiano all'Arabo (RTL) o all'Inglese.

### **PREREQUISITI:**
- ✅ Account attivo
- ✅ Accesso a Landing Page (`/`)
- ✅ Accesso a Dashboard (`/dashboard`)
- ✅ Componenti Aria e Predator Map funzionanti

---

### **SEQUENZA DI TEST:**

#### **STEP 1: Test Landing Page - Selettore Lingua**
**AZIONE:**
1. Vai su `/` (Landing Page)
2. Trova selettore lingua in navbar (icona globo)
3. Clicca e seleziona ogni lingua: **IT, EN, ES, FR, DE, AR**

**COSA INSERIRE:**
- Clicca su ogni lingua nel dropdown

**RISULTATO ATTESO:**
- ✅ Testi Landing Page cambiano **istantaneamente** (senza ricaricare pagina)
- ✅ Per ogni lingua:
  - **IT:** "Il tuo Agente Immobiliare AI"
  - **EN:** "Your AI Real Estate Agent"
  - **ES:** "Tu Agente Inmobiliario IA"
  - **FR:** "Votre Agent Immobilier IA"
  - **DE:** "Ihr KI-Immobilienmakler"
  - **AR:** "وكيلك العقاري الذكي" (con layout RTL)
- ✅ `localStorage.setItem('propertypilot_locale', 'ar')` salvato
- ✅ `document.documentElement.dir = 'rtl'` impostato per Arabo
- ✅ `document.documentElement.lang = 'ar'` impostato

---

#### **STEP 2: Test RTL Layout (Arabo)**
**AZIONE:**
1. Seleziona lingua **AR (Arabo)** sulla Landing
2. Verifica layout RTL

**COSA CONTROLLARE:**
- Apri DevTools → Console:
  ```javascript
  console.log(document.documentElement.dir); // Deve essere "rtl"
  console.log(document.documentElement.lang); // Deve essere "ar"
  ```
- Verifica CSS:
  ```css
  html[dir="rtl"] {
    direction: rtl;
  }
  ```

**RISULTATO ATTESO:**
- ✅ Layout si sposta da sinistra a destra:
  - Navbar: Logo a destra, menu a sinistra
  - Testi: Allineati a destra
  - Icone: Margini invertiti (`ml-3` → `mr-3`)
  - CTA buttons: Allineati correttamente
- ✅ Numeri e date: Formattati in formato arabo (se supportato)
- ✅ Font arabo: Caratteri leggibili (font supportato)

---

#### **STEP 3: Test Dashboard - Internazionalizzazione**
**AZIONE:**
1. Dopo aver selezionato lingua sulla Landing, vai su `/dashboard`
2. Verifica che la lingua persista
3. Testa componenti principali:
   - Aria Coach (`/dashboard`)
   - Predator Map (`/dashboard/map`)
   - Prospecting (`/dashboard/prospecting`)

**COSA CONTROLLARE:**
- Selettore lingua in dashboard (se presente)
- Testi dashboard tradotti (se implementato)
- Componenti Aria e Map adattati

**RISULTATO ATTESO:**
- ✅ Lingua persiste da Landing a Dashboard
- ✅ Se dashboard non tradotta: Fallback a inglese (non italiano hardcoded)
- ✅ Componenti funzionano correttamente in tutte le lingue

---

#### **STEP 4: Test Aria Coach - Multi-Lingua**
**AZIONE:**
1. Vai su `/dashboard`
2. Apri Aria Coach (icona chat)
3. Cambia lingua (se selettore presente in dashboard)
4. Verifica messaggi Aria

**COSA INSERIRE:**
- Domanda a Aria: "Quali sono i migliori deal oggi?"
- Cambia lingua e ripeti domanda

**RISULTATO ATTESO:**
- ✅ Aria risponde nella lingua selezionata
- ✅ Se lingua non supportata: Fallback a inglese
- ✅ Layout RTL attivo se lingua Araba selezionata
- ✅ Numeri e valute formattati correttamente (€, $, د.إ)

---

#### **STEP 5: Test Predator Map - RTL**
**AZIONE:**
1. Vai su `/dashboard/map`
2. Seleziona lingua Araba (se selettore presente)
3. Verifica layout mappa

**COSA CONTROLLARE:**
- Marker sulla mappa
- Popup informazioni
- Legenda e controlli
- Testi tooltip

**RISULTATO ATTESO:**
- ✅ Mappa funziona correttamente
- ✅ Popup informazioni: Layout RTL se lingua Araba
- ✅ Testi tooltip: Tradotti o almeno leggibili
- ✅ Controlli mappa: Allineati correttamente (RTL)

---

#### **STEP 6: Test Persistenza Lingua**
**AZIONE:**
1. Seleziona lingua Araba
2. Ricarica pagina (F5)
3. Chiudi e riapri browser
4. Verifica che lingua persista

**RISULTATO ATTESO:**
- ✅ Lingua persiste dopo ricaricamento pagina
- ✅ Lingua persiste dopo chiusura browser (localStorage)
- ✅ `localStorage.getItem('propertypilot_locale')` restituisce lingua selezionata

---

#### **STEP 7: Test Valute Multi-Lingua**
**AZIONE:**
1. Seleziona lingua **EN (Inglese)**
2. Vai su `/dashboard/prospecting`
3. Verifica formattazione prezzi

**COSA CONTROLLARE:**
- Prezzi formattati:
  - **IT:** €1.250.000
  - **EN:** $2,850,000 (se listing USA)
  - **AR:** 12.000.000 د.إ (se listing Dubai)

**RISULTATO ATTESO:**
- ✅ Prezzi formattati con valuta corretta per mercato
- ✅ Separatori numerici corretti (punto vs virgola)
- ✅ Simbolo valuta posizionato correttamente (RTL per Arabo)

---

### **CHECKLIST FINALE i18n + RTL:**
- [ ] Selettore lingua funziona su Landing Page
- [ ] Testi cambiano istantaneamente (senza ricaricare)
- [ ] RTL attivo per Arabo (`dir="rtl"`, `lang="ar"`)
- [ ] Layout RTL corretto (navbar, testi, icone)
- [ ] Lingua persiste dopo ricaricamento
- [ ] Aria Coach supporta multi-lingua
- [ ] Predator Map funziona con RTL
- [ ] Valute formattate correttamente per ogni lingua
- [ ] Nessun testo hardcoded italiano rimasto

---

## 🎯 RIEPILOGO FINALE

### **STATO VALIDAZIONE:**
- [ ] **TEST 1: Flusso Acquisizione** - Completato
- [ ] **TEST 2: Voice AI** - Completato
- [ ] **TEST 3: Intelligence** - Completato
- [ ] **TEST 4: Stripe** - Completato
- [ ] **TEST 5: i18n + RTL** - Completato

### **PROSSIMI PASSI:**
1. Eseguire ogni test in sequenza
2. Documentare eventuali bug trovati
3. Correggere bug critici prima del lancio
4. Ripetere test dopo correzioni

---

## 📞 SUPPORTO

Per domande o problemi durante i test, contattare:
- **CTO:** [Nome CTO]
- **QA Lead:** [Nome QA]

---

**FINE PROTOCOLLO**
