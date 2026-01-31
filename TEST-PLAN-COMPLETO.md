# 🧪 PIANO DI TEST COMPLETO - PropertyPilot AI

## 📋 STATO ATTUALE DELLE VERIFICHE

### ✅ **COMPLETATI**

1. **Landing Page**
   - ✅ Ripristinata versione finale con sistema internazionale
   - ✅ Selettore lingua funzionante (IT, EN, ES, FR, DE, AR)
   - ✅ Selettore valuta funzionante (USD, EUR, GBP)
   - ✅ Prezzi corretti (Starter: €197, Pro: €497, Agency: €897)
   - ✅ Agency Boost aggiunto (€2.497 una tantum)
   - ✅ Pulsanti Login e Start Free presenti

2. **Sistema di Internazionalizzazione**
   - ✅ Traduzioni funzionanti
   - ✅ Conversione valute automatica
   - ✅ RTL support per arabo

3. **Protezione Feature PRO/AGENCY**
   - ✅ API routes protette con `requireProOrAgencySubscription`
   - ✅ UI paywall implementato con `ProFeaturePaywall`
   - ✅ Error handling 403 per utenti Free/Starter

4. **Prezzi e Configurazione Stripe**
   - ✅ Prezzi sincronizzati in tutto il codice
   - ✅ Price ID gestiti tramite variabili d'ambiente
   - ✅ Configurazione Stripe test corretta

### ⚠️ **DA TESTARE**

1. **Autenticazione e Registrazione**
   - [ ] Login con credenziali valide
   - [ ] Signup nuovo utente
   - [ ] Recupero password
   - [ ] Logout
   - [ ] Session persistence

2. **Dashboard**
   - [ ] Caricamento dashboard
   - [ ] Visualizzazione piano corrente
   - [ ] Statistiche e metriche
   - [ ] Navigazione tra sezioni

3. **Feature FREE**
   - [ ] AI Scraper
   - [ ] Generazione annunci base
   - [ ] Visualizzazione listings salvati

4. **Feature STARTER**
   - [ ] Generazione annunci con stili
   - [ ] Lead Score base
   - [ ] PDF professionali
   - [ ] Multi-lingua

5. **Feature PRO/AGENCY**
   - [ ] Audit Immobiliare AI
   - [ ] Lead Manager + AI
   - [ ] Virtual Staging 3D
   - [ ] Agency Assistant AI
   - [ ] Automazioni AI
   - [ ] AI Voice Calling (solo Agency: illimitato)

6. **Pagamenti Stripe**
   - [ ] Checkout session creation
   - [ ] Webhook handling
   - [ ] Subscription activation
   - [ ] Upgrade/Downgrade piano
   - [ ] One-time payment (Agency Boost)
   - [ ] Cancellazione subscription

7. **Billing e Subscription**
   - [ ] Visualizzazione piano corrente
   - [ ] Upgrade a piano superiore
   - [ ] Gestione fatturazione
   - [ ] Storico pagamenti

8. **Sicurezza**
   - [ ] Protezione route API
   - [ ] Validazione input
   - [ ] Rate limiting
   - [ ] CORS configuration

---

## 🚀 PIANO DI TEST MANUALE COMPLETO

### **FASE 1: Test Autenticazione**

#### Test 1.1: Registrazione Nuovo Utente
```
1. Vai su http://localhost:3000/auth/signup
2. Compila il form:
   - Email: test.user.{timestamp}@propilot-ai.com
   - Password: PasswordSicura123!
   - Conferma password
3. Clicca "Registrati"
4. Verifica: Redirect a dashboard
5. Verifica: Piano Free assegnato
```

#### Test 1.2: Login Utente Esistente
```
1. Vai su http://localhost:3000/auth/login
2. Usa credenziali test:
   - Email: cliente.test.1769701040489@propilot-ai.com
   - Password: PasswordSicura123!
3. Clicca "Accedi"
4. Verifica: Redirect a dashboard
5. Verifica: Session persistente dopo refresh
```

#### Test 1.3: Logout
```
1. Dalla dashboard, clicca "Esci"
2. Verifica: Redirect a homepage
3. Verifica: Non puoi accedere a /dashboard senza login
```

---

### **FASE 2: Test Dashboard e Navigazione**

#### Test 2.1: Caricamento Dashboard
```
1. Login come utente Free
2. Verifica: Dashboard si carica senza errori
3. Verifica: Piano corrente visualizzato (Free)
4. Verifica: Statistiche visibili
5. Verifica: Cards feature visibili
```

#### Test 2.2: Navigazione Feature Cards
```
Per ogni card nella dashboard:
1. Clicca sulla card
2. Verifica: Pagina si carica correttamente
3. Verifica: Nessun errore 404 o 500
4. Verifica: Feature bloccata se PRO/AGENCY (utente Free)
5. Verifica: Messaggio upgrade mostrato se necessario
```

**Cards da testare:**
- AI Scraper → /dashboard/scraper
- Lead Scoring AI → /dashboard/lead-score
- Lead Manager + AI → /dashboard/leads (PRO/AGENCY)
- Analizza Link → /dashboard/analyze
- Audit Immobiliare AI → /dashboard/auditor (PRO/AGENCY)
- Virtual Staging 3D → /dashboard/prospecting (PRO/AGENCY)
- Agency Assistant AI → /dashboard/agency-assistant (PRO/AGENCY)
- Automazioni AI → /dashboard/automations (PRO/AGENCY)

---

### **FASE 3: Test Feature FREE**

#### Test 3.1: AI Scraper
```
1. Vai su /dashboard/scraper
2. Inserisci URL o parametri di ricerca
3. Clicca "Cerca"
4. Verifica: Risultati visualizzati
5. Verifica: Nessun errore
```

#### Test 3.2: Generazione Annunci Base
```
1. Vai su /dashboard/listings
2. Clicca "Genera Nuovo Annuncio"
3. Compila form base
4. Clicca "Genera"
5. Verifica: Annuncio generato
6. Verifica: Annuncio salvato
```

---

### **FASE 4: Test Feature PRO/AGENCY (con utente PRO)**

#### Test 4.1: Audit Immobiliare AI
```
1. Login come utente PRO
2. Vai su /dashboard/auditor
3. Inserisci link annuncio
4. Clicca "Analizza"
5. Verifica: Report generato
6. Verifica: Nessun errore 403
```

#### Test 4.2: Lead Manager + AI
```
1. Vai su /dashboard/leads
2. Clicca "Aggiungi Lead"
3. Compila form
4. Verifica: Lead aggiunto
5. Testa: Cambio status
6. Testa: Aggiunta note
7. Verifica: Tutte le operazioni funzionano
```

#### Test 4.3: Virtual Staging 3D
```
1. Vai su /dashboard/prospecting
2. Scrolla fino a "Virtual Staging 3D"
3. Carica immagine
4. Clicca "Genera Staging"
5. Verifica: Immagine generata
```

#### Test 4.4: Agency Assistant AI
```
1. Vai su /dashboard/agency-assistant
2. Scrivi una domanda
3. Clicca "Invia"
4. Verifica: Risposta generata
5. Verifica: Conversazione salvata
```

#### Test 4.5: Automazioni AI
```
1. Vai su /dashboard/automations
2. Clicca "Crea Automazione"
3. Configura regola
4. Salva
5. Verifica: Automazione creata
6. Testa: Esecuzione automazione
```

---

### **FASE 5: Test Pagamenti Stripe**

#### Test 5.1: Checkout Session Creation
```
1. Vai su /pricing
2. Clicca "Scegli Starter" (o Pro/Agency)
3. Verifica: Redirect a Stripe Checkout
4. Verifica: Prezzo corretto mostrato
5. NON completare il pagamento (test mode)
```

#### Test 5.2: Subscription Activation (con test card)
```
1. Completa checkout con test card:
   - Card: 4242 4242 4242 4242
   - Expiry: Qualsiasi data futura
   - CVC: Qualsiasi 3 cifre
2. Verifica: Redirect a success page
3. Verifica: Webhook ricevuto
4. Verifica: Subscription attivata nel DB
5. Verifica: Piano aggiornato nella dashboard
```

#### Test 5.3: Agency Boost One-Time Payment
```
1. Vai su landing page, scrolla a Agency Boost
2. Clicca "Acquista Agency Boost"
3. Verifica: Redirect a Stripe Checkout
4. Verifica: Prezzo €2.497 mostrato
5. Completa con test card
6. Verifica: Pagamento one-time processato
```

#### Test 5.4: Upgrade Piano
```
1. Login come utente Starter
2. Vai su /dashboard/billing
3. Clicca "Upgrade a Pro"
4. Verifica: Checkout creato
5. Completa pagamento
6. Verifica: Piano aggiornato a Pro
```

---

### **FASE 6: Test Sicurezza e Protezione**

#### Test 6.1: Protezione Route API
```
1. Login come utente Free
2. Prova ad accedere direttamente a:
   - POST /api/audit-listing
   - GET /api/leads
   - POST /api/prospecting/virtual-staging
3. Verifica: Errore 403 Forbidden
4. Verifica: Messaggio appropriato
```

#### Test 6.2: UI Paywall
```
1. Login come utente Free
2. Vai su /dashboard/auditor
3. Verifica: Paywall mostrato
4. Verifica: Pulsante upgrade presente
5. Clicca upgrade
6. Verifica: Redirect a checkout
```

---

### **FASE 7: Test Internazionalizzazione**

#### Test 7.1: Cambio Lingua
```
1. Vai su landing page
2. Cambia lingua (IT → EN → ES → FR → DE → AR)
3. Verifica: Contenuto tradotto
4. Verifica: Prezzi convertiti
5. Verifica: RTL per arabo
```

#### Test 7.2: Cambio Valuta
```
1. Cambia valuta (EUR → USD → GBP)
2. Verifica: Prezzi convertiti correttamente
3. Verifica: Formato valuta corretto
```

---

## 📊 CHECKLIST FINALE PRE-LIVE

### **Funzionalità Core**
- [ ] Autenticazione funzionante
- [ ] Dashboard caricabile
- [ ] Tutte le feature accessibili secondo piano
- [ ] Protezione PRO/AGENCY funzionante

### **Pagamenti**
- [ ] Checkout Stripe funzionante
- [ ] Webhook configurati correttamente
- [ ] Subscription activation testata
- [ ] Upgrade/Downgrade testati
- [ ] One-time payments testati

### **Sicurezza**
- [ ] API routes protette
- [ ] Input validation
- [ ] Rate limiting attivo
- [ ] CORS configurato

### **Internazionalizzazione**
- [ ] Tutte le lingue funzionanti
- [ ] Conversioni valute corrette
- [ ] RTL support per arabo

### **Performance**
- [ ] Tempi di caricamento accettabili
- [ ] Nessun memory leak
- [ ] Errori console risolti

### **Documentazione**
- [ ] README aggiornato
- [ ] Documentazione API
- [ ] Guide utente
- [ ] Troubleshooting guide

---

## 🎯 PROSSIMI PASSI CONSIGLIATI

### **1. Completare Test Manuali**
- Eseguire tutti i test sopra elencati
- Documentare eventuali bug trovati
- Fixare bug critici prima di procedere

### **2. Test Pagamenti Stripe**
- Testare checkout completo
- Verificare webhook
- Testare subscription lifecycle
- Testare one-time payments

### **3. Review Documentazione**
- Verificare tutte le impostazioni
- Sistemare documentazione mancante
- Creare guide utente

### **4. Performance Testing**
- Testare con carico
- Ottimizzare query database
- Verificare caching

### **5. Security Audit**
- Review codice sicurezza
- Test penetration base
- Verificare best practices

### **6. Preparazione Live**
- Configurare variabili ambiente produzione
- Setup monitoring (Sentry, LogRocket, etc.)
- Backup strategy
- Rollback plan

### **7. Marketing Preparation**
- Landing page ottimizzata
- SEO check
- Analytics setup (Google Analytics, etc.)
- Conversion tracking

---

## 📝 NOTE IMPORTANTI

1. **Test Environment**: Usare sempre Stripe Test Mode per i pagamenti
2. **Database**: Verificare che tutte le tabelle siano create (supabase-crm-migration.sql)
3. **Environment Variables**: Verificare che tutte le variabili siano configurate
4. **Logging**: Monitorare i log durante i test per identificare problemi

---

## 🔗 LINK UTILI

- Stripe Test Cards: https://stripe.com/docs/testing
- Supabase Dashboard: https://supabase.com/dashboard
- Next.js Docs: https://nextjs.org/docs

---

**Ultimo aggiornamento**: 2026-01-30
**Versione**: 1.0
