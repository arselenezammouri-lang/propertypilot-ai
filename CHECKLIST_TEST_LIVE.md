# ✅ Checklist Test Live - PropertyPilot AI

## 📅 Data: 31 Gennaio 2026 - Sessione Test

> **Modalità**: Test parallelo - Browser utente + Browser AI
> **Obiettivo**: Verificare che tutto funzioni perfettamente prima del lancio

---

## 🔍 FASE 0: Verifica Configurazione (PRIMA DI INIZIARE)

### Configurazione Base
- [x] File `.env.local` esiste
- [x] Variabili Supabase configurate
- [x] Variabili Stripe configurate (con nomi alternativi)
- [ ] **Verificare che server sia in esecuzione** (`npm run dev`)
- [ ] **Aprire console browser (F12) e verificare errori**

### Variabili Stripe Verificate
- [x] `TESTING_STRIPE_SECRET_KEY` - ✅ Configurato
- [x] `TESTING_VITE_STRIPE_PUBLIC_KEY` - ✅ Configurato
- [x] `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` - ✅ Configurato
- [x] `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` - ✅ Configurato
- [x] `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID` - ✅ Configurato
- [x] `NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID` - ✅ Configurato
- [x] `STRIPE_WEBHOOK_SECRET` - ✅ Configurato

**✅ CONFIGURAZIONE STRIPE: OK**

---

## 🧪 FASE 1: Test Autenticazione

### Test 1.1: Signup (Creazione Account)
**URL**: `http://localhost:3000/auth/signup`

**Azioni**:
1. [ ] Navigare a `/auth/signup`
2. [ ] Compilare form:
   - Full Name: "Test User [TIMESTAMP]"
   - Email: "test.[TIMESTAMP]@propilot-ai.com"
   - Password: "TestPassword123!"
3. [ ] Cliccare "Create Free Account"

**Verifiche**:
- [ ] ✅ Redirect a `/dashboard` dopo signup
- [ ] ✅ Dialog benvenuto visibile (se presente)
- [ ] ✅ Nessun errore in console browser
- [ ] ✅ Nessun errore in console server
- [ ] ✅ In Supabase Dashboard → Authentication → Users: nuovo utente presente
- [ ] ✅ In Supabase Dashboard → Table Editor → `profiles`: profilo creato
- [ ] ✅ In Supabase Dashboard → Table Editor → `subscriptions`: subscription "free" creata

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

### Test 1.2: Login
**URL**: `http://localhost:3000/auth/login`

**Azioni**:
1. [ ] Navigare a `/auth/login`
2. [ ] Inserire email e password dell'utente creato
3. [ ] Cliccare "Sign In"

**Verifiche**:
- [ ] ✅ Redirect a `/dashboard`
- [ ] ✅ Session attiva
- [ ] ✅ Dashboard mostra dati utente
- [ ] ✅ Nessun errore in console

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

### Test 1.3: Logout
**Azioni**:
1. [ ] Dalla dashboard, trovare pulsante logout (menu utente o header)
2. [ ] Cliccare logout

**Verifiche**:
- [ ] ✅ Redirect a homepage o `/auth/login`
- [ ] ✅ Session terminata
- [ ] ✅ Tentativo di accesso a `/dashboard` reindirizza a login

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

## 🧪 FASE 2: Test Dashboard

### Test 2.1: Dashboard Principale
**URL**: `http://localhost:3000/dashboard`

**Verifiche**:
- [ ] ✅ Si carica senza errori
- [ ] ✅ Mostra dati utente
- [ ] ✅ Mostra piano corrente (FREE)
- [ ] ✅ Navigazione funziona
- [ ] ✅ Nessun errore in console

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

### Test 2.2: Billing Dashboard
**URL**: `http://localhost:3000/dashboard/billing`

**Verifiche**:
- [ ] ✅ Si carica senza errori
- [ ] ✅ Mostra tutti i piani (FREE, Starter, Pro, Agency)
- [ ] ✅ Prezzi corretti visualizzati
- [ ] ✅ Pulsanti "Scegli" presenti per ogni piano
- [ ] ✅ Nessun errore in console
- [ ] ✅ Nessun errore `[BILLING] Subscription fetch failed` (o è normale se non autenticato)

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

### Test 2.3: Altre Pagine Dashboard
**Pagine da testare**:
- [ ] `/dashboard/prospecting` - Prospecting con filtri
- [ ] `/dashboard/map` - Mappa interattiva
- [ ] `/dashboard/leads` - Tabella leads
- [ ] `/dashboard/leads/pipeline` - Pipeline Kanban
- [ ] `/dashboard/crm/automations` - Automazioni CRM
- [ ] `/dashboard/settings/workspace` - Settings workspace
- [ ] `/dashboard/settings/notifications` - Settings notifiche
- [ ] `/dashboard/referral` - Referral dashboard

**Per ogni pagina verificare**:
- [ ] ✅ Si carica senza errori
- [ ] ✅ Navigazione funziona
- [ ] ✅ Componenti principali presenti
- [ ] ✅ Nessun errore in console

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

## 🧪 FASE 3: Test Stripe Checkout

### Prerequisiti
- [ ] Utente autenticato
- [ ] Stripe CLI installato (opzionale ma consigliato)
- [ ] Webhook forwarding attivo (se si usa Stripe CLI)

### Test 3.1: Checkout Starter
**Azioni**:
1. [ ] Navigare a `/dashboard/billing`
2. [ ] Cliccare "Scegli Starter"
3. [ ] **Verificare redirect a Stripe Checkout**

**Verifiche**:
- [ ] ✅ Redirect a Stripe Checkout
- [ ] ✅ Prezzo €197/mese visualizzato correttamente
- [ ] ✅ Completa pagamento con carta test: `4242 4242 4242 4242`
  - Expiry: `12/25`
  - CVC: `123`
  - ZIP: `12345`
- [ ] ✅ Redirect a `/dashboard?success=true`
- [ ] ✅ In Supabase → `subscriptions`: status = 'starter'
- [ ] ✅ In Supabase → `profiles`: subscription_plan = 'starter'
- [ ] ✅ Dashboard mostra piano Starter attivo

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

### Test 3.2: Upgrade a Pro
**Azioni**:
1. [ ] Con utente Starter attivo, navigare a `/dashboard/billing`
2. [ ] Cliccare "Scegli Pro"
3. [ ] Completare checkout

**Verifiche**:
- [ ] ✅ Checkout mostra differenza prezzo (proration)
- [ ] ✅ Dopo pagamento, piano aggiornato a PRO
- [ ] ✅ Funzionalità PRO sbloccate
- [ ] ✅ Database aggiornato correttamente

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

### Test 3.3: Webhook (se Stripe CLI attivo)
**Azioni**:
1. [ ] Avviare Stripe CLI: `stripe listen --forward-to http://localhost:3000/api/stripe/webhook`
2. [ ] Completare un checkout
3. [ ] Verificare eventi nel terminale Stripe CLI

**Verifiche**:
- [ ] ✅ Evento `checkout.session.completed` ricevuto
- [ ] ✅ Evento `customer.subscription.created` ricevuto
- [ ] ✅ Subscription aggiornata nel database
- [ ] ✅ Profilo utente aggiornato

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

## 🧪 FASE 4: Test Funzionalità per Piano

### Test 4.1: Piano FREE
**Verifiche**:
- [ ] ✅ Limiti: Listings per mese = 5
- [ ] ✅ Funzionalità PRO mostrano "Upgrade required"
- [ ] ✅ Funzionalità PRO non accessibili

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

### Test 4.2: Piano STARTER
**Verifiche**:
- [ ] ✅ Limiti: Listings per mese = 50
- [ ] ✅ AI Listing Engine accessibile
- [ ] ✅ Lead Score Base accessibile
- [ ] ✅ Funzionalità PRO mostrano "Upgrade required"

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

### Test 4.3: Piano PRO
**Verifiche**:
- [ ] ✅ Limiti: Listings per mese = 200, Voice Agent Calls = 30/mese
- [ ] ✅ Tutte le funzionalità PRO accessibili:
  - Smart Briefing Multi-Categoria
  - Virtual Staging 3D
  - CRM Completo
  - Pipeline Kanban

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

### Test 4.4: Piano AGENCY
**Verifiche**:
- [ ] ✅ Limiti: Listings illimitati, Voice Agent Calls illimitati, Max Users = 10
- [ ] ✅ Funzionalità accessibili:
  - Aura VR: Cinematic Virtual Tour
  - Omnichannel Domination Suite
  - AI Voice Calling Illimitato
  - Multi-utente

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

## 🧪 FASE 5: Test Sicurezza

### Test 5.1: Protezione Route
**Azioni**:
1. [ ] Logout (se autenticato)
2. [ ] Tentare accesso a `/dashboard`
3. [ ] Tentare accesso a `/dashboard/billing`
4. [ ] Tentare accesso a API protette senza autenticazione

**Verifiche**:
- [ ] ✅ Accesso a `/dashboard` reindirizza a `/auth/login`
- [ ] ✅ Accesso a `/dashboard/billing` reindirizza a `/auth/login`
- [ ] ✅ API protette ritornano 401 Unauthorized

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

### Test 5.2: Protezione Funzionalità
**Azioni**:
1. [ ] Utente FREE tenta di accedere a funzionalità PRO
2. [ ] Utente STARTER tenta di accedere a funzionalità PRO
3. [ ] Utente PRO accede a funzionalità PRO

**Verifiche**:
- [ ] ✅ Utente FREE vede banner "Upgrade required"
- [ ] ✅ Utente STARTER vede banner "Upgrade required"
- [ ] ✅ Utente PRO accede senza problemi

**Note Problemi**:
```
[Spazio per note problemi trovati]
```

---

## 📊 RIEPILOGO TEST

### Test Completati
- [ ] FASE 1: Autenticazione
- [ ] FASE 2: Dashboard
- [ ] FASE 3: Stripe Checkout
- [ ] FASE 4: Funzionalità per Piano
- [ ] FASE 5: Sicurezza

### Problemi Trovati
```
[Lista problemi trovati durante i test]
```

### Problemi Risolti
```
[Lista problemi risolti]
```

---

## ✅ STATO FINALE

**Data completamento**: _______________

**Test completati**: ___ / 5 fasi

**Pronto per produzione**: [ ] Sì [ ] No

**Note finali**:
```
[Note finali sulla sessione di test]
```

---

**Ultimo aggiornamento**: 31 Gennaio 2026
