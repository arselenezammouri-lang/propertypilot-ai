# 🧪 PIANO TEST MANUALE COMPLETO - PropertyPilot AI

**Data:** 29 Gennaio 2025  
**Obiettivo:** Test completo di tutte le funzionalità come cliente reale

---

## 📋 STRUTTURA TEST

### **FASE 1: Autenticazione & Onboarding** 🔐
### **FASE 2: Dashboard & Navigation** 🏠
### **FASE 3: Prospecting & Listings** 🏘️
### **FASE 4: CRM & Leads** 👥
### **FASE 5: AI Features** 🤖
### **FASE 6: Billing & Subscriptions** 💳
### **FASE 7: Settings & Profile** ⚙️
### **FASE 8: Edge Cases & Security** 🔒

---

## 🔐 FASE 1: AUTENTICAZIONE & ONBOARDING

### **TEST 1.1: Homepage & Landing**
- [ ] Aprire `http://localhost:3000`
- [ ] Verificare che la pagina carichi correttamente
- [ ] Verificare che tutti i link funzionino
- [ ] Verificare che il design sia responsive
- [ ] Cliccare su "Get Started" o "Login"

### **TEST 1.2: Signup (Nuovo Utente)**
- [ ] Andare su `/auth/signup`
- [ ] Compilare form:
  - Nome completo: "Mario Rossi Test"
  - Email: `test.${Date.now()}@propilot-ai.com`
  - Password: "TestPassword123!"
- [ ] Cliccare "Crea Account"
- [ ] Verificare messaggio di successo
- [ ] Verificare redirect a dashboard
- [ ] Verificare che profilo sia creato

### **TEST 1.3: Login (Utente Esistente)**
- [ ] Andare su `/auth/login`
- [ ] Inserire credenziali:
  - Email: `cliente.test.1769701040489@propilot-ai.com`
  - Password: `PasswordSicura123!`
- [ ] Cliccare "Accedi"
- [ ] Verificare redirect a dashboard
- [ ] Verificare che sessione sia attiva

### **TEST 1.4: Logout**
- [ ] Cliccare su avatar/username in alto a destra
- [ ] Cliccare "Logout" o "Esci"
- [ ] Verificare redirect a homepage o login
- [ ] Verificare che sessione sia terminata

### **TEST 1.5: Password Reset (Opzionale)**
- [ ] Andare su `/auth/login`
- [ ] Cliccare "Password dimenticata?"
- [ ] Inserire email
- [ ] Verificare messaggio di conferma

---

## 🏠 FASE 2: DASHBOARD & NAVIGATION

### **TEST 2.1: Dashboard Principale**
- [ ] Accedere alla dashboard (`/dashboard`)
- [ ] Verificare che tutti i widget siano visibili:
  - Statistiche listings
  - Statistiche leads
  - Statistiche automazioni
  - Upgrade banner (se free plan)
- [ ] Verificare che i numeri siano corretti
- [ ] Verificare che i link funzionino

### **TEST 2.2: Navigation Menu**
- [ ] Verificare che il menu laterale sia visibile
- [ ] Testare ogni link del menu:
  - [ ] Prospecting
  - [ ] Map
  - [ ] Leads
  - [ ] CRM
  - [ ] Perfect Copy
  - [ ] Listings
  - [ ] Automations
  - [ ] Billing
  - [ ] Settings
- [ ] Verificare che ogni pagina carichi correttamente
- [ ] Verificare che il menu sia responsive (mobile)

### **TEST 2.3: User Profile Dropdown**
- [ ] Cliccare su avatar/username
- [ ] Verificare dropdown menu:
  - [ ] Nome utente visibile
  - [ ] Piano corrente visibile
  - [ ] Link a Settings
  - [ ] Link a Billing
  - [ ] Link Logout
- [ ] Testare ogni link

---

## 🏘️ FASE 3: PROSPECTING & LISTINGS

### **TEST 3.1: Prospecting Page**
- [ ] Andare su `/dashboard/prospecting`
- [ ] Verificare che la pagina carichi
- [ ] Verificare filtri:
  - [ ] Location
  - [ ] Price range
  - [ ] Property type
  - [ ] Bedrooms/Bathrooms
- [ ] Testare ricerca con filtri
- [ ] Verificare che i risultati appaiano

### **TEST 3.2: Listings Display**
- [ ] Verificare che i listings siano visualizzati correttamente
- [ ] Verificare immagini (se presenti)
- [ ] Verificare informazioni base (prezzo, location, tipo)
- [ ] Cliccare su un listing
- [ ] Verificare dettagli completi

### **TEST 3.3: Save Listing**
- [ ] Cliccare "Salva" su un listing
- [ ] Verificare che il listing sia salvato
- [ ] Andare su `/dashboard/listings`
- [ ] Verificare che il listing salvato sia presente

### **TEST 3.4: Map View**
- [ ] Andare su `/dashboard/map`
- [ ] Verificare che la mappa carichi
- [ ] Verificare che i markers siano visibili
- [ ] Cliccare su un marker
- [ ] Verificare popup con informazioni
- [ ] Testare zoom e pan

### **TEST 3.5: Price Drops (se disponibile)**
- [ ] Andare su `/dashboard/prospecting`
- [ ] Cliccare su "Price Drops" o tab equivalente
- [ ] Verificare che i price drops siano visualizzati
- [ ] Verificare che le date siano corrette

### **TEST 3.6: Expired Listings (se disponibile)**
- [ ] Andare su `/dashboard/prospecting`
- [ ] Cliccare su "Expired Listings" o tab equivalente
- [ ] Verificare che gli expired listings siano visualizzati

---

## 👥 FASE 4: CRM & LEADS

### **TEST 4.1: Leads List**
- [ ] Andare su `/dashboard/leads`
- [ ] Verificare che la lista carichi
- [ ] Verificare filtri:
  - [ ] Status (new, contacted, followup, closed, lost)
  - [ ] Priority (low, medium, high)
  - [ ] Market (italy, usa)
  - [ ] Search
- [ ] Testare ogni filtro

### **TEST 4.2: Create New Lead**
- [ ] Cliccare "Nuovo Lead" o "+"
- [ ] Compilare form:
  - Nome: "Giuseppe Verdi"
  - Email: "giuseppe@example.com"
  - Telefono: "+39 123 456 7890"
  - Messaggio: "Interessato a casa in centro"
  - Priority: "high"
  - Market: "italy"
- [ ] Cliccare "Salva"
- [ ] Verificare che il lead appaia nella lista

### **TEST 4.3: Lead Details**
- [ ] Cliccare su un lead dalla lista
- [ ] Verificare dettagli completi:
  - [ ] Informazioni di contatto
  - [ ] Status e priority
  - [ ] Lead score (se disponibile)
  - [ ] Notes
  - [ ] Communication history
- [ ] Testare modifica lead

### **TEST 4.4: Lead Pipeline (Kanban)**
- [ ] Andare su `/dashboard/leads/pipeline`
- [ ] Verificare che il Kanban board sia visibile
- [ ] Verificare colonne:
  - [ ] New
  - [ ] Contacted
  - [ ] Followup
  - [ ] Closed
  - [ ] Lost
- [ ] Drag & drop un lead tra colonne
- [ ] Verificare che lo status si aggiorni

### **TEST 4.5: Lead Scoring (se PRO)**
- [ ] Andare su `/dashboard/lead-score`
- [ ] Verificare che la pagina carichi (solo PRO/AGENCY)
- [ ] Se free plan, verificare messaggio di upgrade
- [ ] Se PRO, testare generazione lead score

### **TEST 4.6: CRM Automations**
- [ ] Andare su `/dashboard/crm/automations`
- [ ] Verificare lista automazioni
- [ ] Cliccare "Nuova Automazione"
- [ ] Testare creazione automazione base

---

## 🤖 FASE 5: AI FEATURES

### **TEST 5.1: Perfect Copy Generator**
- [ ] Andare su `/dashboard/perfect-copy`
- [ ] Compilare form:
  - Location: "Milano, Centro"
  - Property Type: "Appartamento"
  - Size: "100 m²"
  - Rooms: "3"
  - Price: "€350,000"
- [ ] Cliccare "Genera"
- [ ] Verificare che il contenuto sia generato
- [ ] Verificare qualità del testo
- [ ] Testare varianti (se disponibili)

### **TEST 5.2: Refine Listing**
- [ ] Andare su `/dashboard/refine-listing`
- [ ] Selezionare un listing salvato
- [ ] Cliccare "Migliora"
- [ ] Verificare che il contenuto migliorato appaia

### **TEST 5.3: Follow-up Emails**
- [ ] Andare su `/dashboard/followup-emails`
- [ ] Selezionare un lead
- [ ] Scegliere tipo email (24h, 72h, etc.)
- [ ] Cliccare "Genera Email"
- [ ] Verificare che l'email sia generata
- [ ] Verificare personalizzazione

### **TEST 5.4: Video Scripts**
- [ ] Andare su `/dashboard/video-scripts`
- [ ] Compilare form con info property
- [ ] Cliccare "Genera Script"
- [ ] Verificare che lo script sia generato

### **TEST 5.5: Hashtags Generator**
- [ ] Andare su `/dashboard/hashtags`
- [ ] Inserire info property
- [ ] Cliccare "Genera Hashtags"
- [ ] Verificare che gli hashtags siano generati

### **TEST 5.6: Social Posts**
- [ ] Andare su `/dashboard/social-posts`
- [ ] Compilare form
- [ ] Cliccare "Genera Post"
- [ ] Verificare che il post sia generato

### **TEST 5.7: Titles Generator**
- [ ] Andare su `/dashboard/titles`
- [ ] Inserire info property
- [ ] Cliccare "Genera Titoli"
- [ ] Verificare che i titoli siano generati

### **TEST 5.8: Translate**
- [ ] Andare su `/dashboard/translate`
- [ ] Inserire testo italiano
- [ ] Cliccare "Traduci"
- [ ] Verificare traduzione in inglese

### **TEST 5.9: Analyze**
- [ ] Andare su `/dashboard/analyze`
- [ ] Inserire URL o testo listing
- [ ] Cliccare "Analizza"
- [ ] Verificare che l'analisi sia generata

### **TEST 5.10: Aria Chat (se disponibile)**
- [ ] Andare su `/dashboard` o cercare chat Aria
- [ ] Inviare messaggio: "Ciao Aria, aiutami con questo listing"
- [ ] Verificare che Aria risponda
- [ ] Testare conversazione

---

## 💳 FASE 6: BILLING & SUBSCRIPTIONS

### **TEST 6.1: Billing Page**
- [ ] Andare su `/dashboard/billing`
- [ ] Verificare piano corrente
- [ ] Verificare data rinnovo
- [ ] Verificare limite utilizzi (se applicabile)

### **TEST 6.2: Upgrade Plan (Test Mode)**
- [ ] Cliccare "Upgrade to PRO" o "Upgrade to AGENCY"
- [ ] Verificare che Stripe Checkout si apra
- [ ] Usare carta di test Stripe:
  - Card: `4242 4242 4242 4242`
  - Expiry: qualsiasi data futura
  - CVC: qualsiasi 3 cifre
- [ ] Completare checkout
- [ ] Verificare redirect a dashboard
- [ ] Verificare che il piano sia aggiornato

### **TEST 6.3: Downgrade/Cancel**
- [ ] Andare su `/dashboard/billing`
- [ ] Cliccare "Cancella Abbonamento"
- [ ] Verificare conferma
- [ ] Verificare che lo status diventi "free"

### **TEST 6.4: Stripe Portal**
- [ ] Cliccare "Gestisci Abbonamento" o link Stripe Portal
- [ ] Verificare che Stripe Customer Portal si apra
- [ ] Verificare che si possa gestire subscription

### **TEST 6.5: Feature Lock (Free Plan)**
- [ ] Se free plan, testare accesso a feature PRO:
  - [ ] `/dashboard/lead-score` → deve mostrare upgrade banner
  - [ ] `/dashboard/prospecting` → "CHIAMA ORA" deve essere disabilitato
  - [ ] Verificare che i limiti siano rispettati

---

## ⚙️ FASE 7: SETTINGS & PROFILE

### **TEST 7.1: Workspace Settings**
- [ ] Andare su `/dashboard/settings/workspace`
- [ ] Verificare informazioni workspace
- [ ] Modificare nome workspace
- [ ] Salvare modifiche
- [ ] Verificare che le modifiche siano salvate

### **TEST 7.2: Notification Settings**
- [ ] Andare su `/dashboard/settings/notifications`
- [ ] Testare toggle notifiche:
  - [ ] Email notifications
  - [ ] Push notifications
  - [ ] SMS notifications (se disponibili)
- [ ] Salvare modifiche
- [ ] Verificare che le preferenze siano salvate

### **TEST 7.3: Profile Settings**
- [ ] Cliccare su avatar → Settings
- [ ] Modificare nome
- [ ] Modificare email (se permesso)
- [ ] Modificare password
- [ ] Salvare modifiche
- [ ] Verificare che le modifiche siano salvate

### **TEST 7.4: API Keys (se disponibile)**
- [ ] Andare su `/dashboard/crm/settings` o `/dashboard/crm/api-keys`
- [ ] Verificare lista API keys
- [ ] Creare nuova API key
- [ ] Verificare che la key sia generata
- [ ] Testare revoke key

---

## 🔒 FASE 8: EDGE CASES & SECURITY

### **TEST 8.1: Rate Limiting**
- [ ] Fare 10+ richieste rapide a un'API AI
- [ ] Verificare che il rate limit sia applicato
- [ ] Verificare messaggio di errore appropriato

### **TEST 8.2: Session Expiry**
- [ ] Aspettare che la sessione scada (o forzare logout)
- [ ] Tentare di accedere a `/dashboard`
- [ ] Verificare redirect a login

### **TEST 8.3: Invalid Input**
- [ ] Testare form con input invalidi:
  - [ ] Email senza @
  - [ ] Password troppo corta
  - [ ] Campi obbligatori vuoti
- [ ] Verificare che i messaggi di errore appaiano

### **TEST 8.4: Cross-User Data Access**
- [ ] Creare due account diversi
- [ ] Tentare di accedere ai dati dell'altro utente
- [ ] Verificare che l'accesso sia negato (RLS)

### **TEST 8.5: Mobile Responsiveness**
- [ ] Testare su mobile viewport
- [ ] Verificare che il menu sia responsive
- [ ] Verificare che i form siano usabili
- [ ] Verificare che le tabelle siano scrollabili

### **TEST 8.6: Error Handling**
- [ ] Disconnettere internet
- [ ] Tentare di fare un'azione
- [ ] Verificare che un messaggio di errore appropriato appaia
- [ ] Riconnettere e verificare che tutto funzioni

---

## ✅ CHECKLIST FINALE

### **Funzionalità Core**
- [ ] Signup funziona
- [ ] Login funziona
- [ ] Dashboard carica correttamente
- [ ] Navigation funziona
- [ ] Logout funziona

### **Features Principali**
- [ ] Prospecting funziona
- [ ] Listings possono essere salvati
- [ ] Leads possono essere creati e gestiti
- [ ] AI generation funziona
- [ ] Billing funziona

### **Sicurezza**
- [ ] Route protette funzionano
- [ ] RLS funziona
- [ ] Rate limiting funziona
- [ ] PRO features sono protette

### **UX/UI**
- [ ] Design è coerente
- [ ] Messaggi di errore sono chiari
- [ ] Loading states sono presenti
- [ ] Mobile è responsive

---

## 📝 NOTE PER IL TEST

1. **Testare come cliente reale**: Non saltare passaggi, seguire il flusso naturale
2. **Documentare bug**: Se trovi un problema, annotalo immediatamente
3. **Testare edge cases**: Cosa succede con input strani?
4. **Verificare performance**: Le pagine caricano velocemente?
5. **Verificare errori**: I messaggi di errore sono chiari?

---

**Buon test! 🚀**
