# 🎯 Piano d'Azione - Test Completi PropertyPilot AI

## 📅 Data: 31 Gennaio 2026

### ✅ FASE 1: Configurazione Stripe Test Keys (DA FARE ORA)

**Tempo stimato: 15-20 minuti**

#### Step 1.1: Ottenere Stripe Test Keys
1. Vai su [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Accedi e attiva **Test mode** (toggle in alto a destra)
3. Vai su **Developers** → **API keys**
4. Copia:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`)

#### Step 1.2: Creare Price IDs
1. Vai su **Products** → **+ Add product**
2. Crea 4 prodotti:
   - **Starter**: €197/mese (monthly)
   - **Pro**: €497/mese (monthly)
   - **Agency**: €897/mese (monthly)
   - **Agency Boost**: €2,497 (one-time)
3. Per ogni prodotto, **copia il Price ID** (`price_...`)

#### Step 1.3: Configurare .env.local
Apri `.env.local` e aggiungi:

```env
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_TUA_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TUA_PUBLISHABLE_KEY

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_TUA_STARTER_PRICE_ID
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_TUA_PRO_PRICE_ID
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_TUA_AGENCY_PRICE_ID
NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID=price_TUA_BOOST_PRICE_ID

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Step 1.4: Riavvia Server
```bash
# Ferma server (Ctrl+C)
npm run dev
```

#### Step 1.5: Verifica
- Vai su `http://localhost:3000/dashboard/billing`
- Dovresti vedere i piani senza errori

**📄 Guida completa**: Vedi `CONFIGURAZIONE_STRIPE_TEST.md`

---

### ✅ FASE 2: Test Autenticazione Completo

**Tempo stimato: 10 minuti**

#### Test 2.1: Signup
1. Vai su `http://localhost:3000/auth/signup`
2. Compila form:
   - Full Name: "Test User"
   - Email: "test.user@propilot-ai.com" (o email unica)
   - Password: "TestPassword123!"
3. Clicca "Create Free Account"
4. **Verifica:**
   - ✅ Redirect a `/dashboard`
   - ✅ Dialog benvenuto visibile
   - ✅ In Supabase Dashboard → Authentication → Users: nuovo utente presente
   - ✅ In Supabase Dashboard → Table Editor → `profiles`: profilo creato
   - ✅ In Supabase Dashboard → Table Editor → `subscriptions`: subscription "free" creata

#### Test 2.2: Login
1. Vai su `http://localhost:3000/auth/login`
2. Inserisci email e password dell'utente creato
3. Clicca "Sign In"
4. **Verifica:**
   - ✅ Redirect a `/dashboard`
   - ✅ Session attiva
   - ✅ Dashboard mostra dati utente

#### Test 2.3: Logout
1. Dalla dashboard, trova pulsante logout (menu utente o header)
2. Clicca logout
3. **Verifica:**
   - ✅ Redirect a homepage o `/auth/login`
   - ✅ Tentativo di accesso a `/dashboard` reindirizza a login

**📄 Checklist completa**: Vedi `TEST_COMPLETI_FINALI.md` sezione "Test 1: Autenticazione Completo"

---

### ✅ FASE 3: Test Dashboard Completo

**Tempo stimato: 20-30 minuti**

#### Test 3.1: Pagine Principali
Per ogni pagina, verifica che:
- ✅ Si carica senza errori
- ✅ Navigazione funziona
- ✅ Componenti principali presenti
- ✅ Nessun errore in console (F12)

**Pagine da testare:**
- [ ] `/dashboard` - Dashboard principale
- [ ] `/dashboard/prospecting` - Prospecting con filtri
- [ ] `/dashboard/map` - Mappa interattiva
- [ ] `/dashboard/billing` - Billing e piani
- [ ] `/dashboard/leads` - Tabella leads
- [ ] `/dashboard/leads/pipeline` - Pipeline Kanban
- [ ] `/dashboard/crm/automations` - Automazioni CRM
- [ ] `/dashboard/settings/workspace` - Settings workspace
- [ ] `/dashboard/settings/notifications` - Settings notifiche
- [ ] `/dashboard/referral` - Referral dashboard

**📄 Checklist completa**: Vedi `TEST_COMPLETI_FINALI.md` sezione "Test 2: Dashboard Completo"

---

### ✅ FASE 4: Test Stripe Completo

**Tempo stimato: 30-40 minuti**

#### Test 4.1: Checkout (Opzionale: Stripe CLI per webhook)
1. Installa Stripe CLI (opzionale ma consigliato):
   ```bash
   # Windows con Chocolatey
   choco install stripe-cli
   
   # Oppure download manuale da:
   # https://github.com/stripe/stripe-cli/releases/latest
   ```

2. Login Stripe CLI:
   ```bash
   stripe login
   ```

3. Avvia webhook forwarding (in terminale separato):
   ```bash
   stripe listen --forward-to http://localhost:3000/api/stripe/webhook
   ```
   
4. Copia il `whsec_xxxxx` e aggiungilo a `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```
   
5. Riavvia server Next.js

#### Test 4.2: Checkout Starter
1. Vai su `http://localhost:3000/dashboard/billing`
2. Clicca "Scegli Starter"
3. **Verifica:**
   - ✅ Redirect a Stripe Checkout
   - ✅ Prezzo €197/mese visualizzato
   - ✅ Completa pagamento con carta test: `4242 4242 4242 4242`
   - ✅ Redirect a `/dashboard?success=true`
   - ✅ In Supabase → `subscriptions`: status = 'starter'
   - ✅ In Supabase → `profiles`: subscription_plan = 'starter'
   - ✅ Dashboard mostra piano Starter attivo

#### Test 4.3: Upgrade a Pro
1. Con utente Starter attivo, vai su `/dashboard/billing`
2. Clicca "Scegli Pro"
3. **Verifica:**
   - ✅ Checkout mostra differenza prezzo (proration)
   - ✅ Dopo pagamento, piano aggiornato a PRO
   - ✅ Funzionalità PRO sbloccate

#### Test 4.4: Webhook (se Stripe CLI attivo)
1. Nel terminale `stripe listen`, verifica eventi:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`

**📄 Checklist completa**: Vedi `TEST_COMPLETI_FINALI.md` sezione "Test 3: Stripe Completo"

---

### ✅ FASE 5: Test Funzionalità per Piano

**Tempo stimato: 20-30 minuti**

#### Test 5.1: Piano FREE
- [ ] Verifica limiti:
  - Listings per mese: 5
  - Nessuna funzionalità PRO
- [ ] Verifica che funzionalità PRO mostrino "Upgrade required"

#### Test 5.2: Piano STARTER
- [ ] Verifica limiti:
  - Listings per mese: 50
  - AI Listing Engine accessibile
  - Lead Score Base accessibile
- [ ] Verifica che funzionalità PRO mostrino "Upgrade required"

#### Test 5.3: Piano PRO
- [ ] Verifica limiti:
  - Listings per mese: 200
  - Voice Agent Calls: 30/mese
  - Tutte le funzionalità PRO accessibili
- [ ] Verifica funzionalità:
  - Smart Briefing Multi-Categoria
  - Virtual Staging 3D
  - CRM Completo
  - Pipeline Kanban

#### Test 5.4: Piano AGENCY
- [ ] Verifica limiti:
  - Listings per mese: Illimitati
  - Voice Agent Calls: Illimitati
  - Max Users: 10
- [ ] Verifica funzionalità:
  - Aura VR: Cinematic Virtual Tour
  - Omnichannel Domination Suite
  - AI Voice Calling Illimitato
  - Multi-utente

**📄 Checklist completa**: Vedi `TEST_COMPLETI_FINALI.md` sezione "Test 4: Funzionalità per Piano"

---

### ✅ FASE 6: Validazione Sicurezza

**Tempo stimato: 15-20 minuti**

#### Test 6.1: Protezione Route
- [ ] Tentare accesso a `/dashboard` senza login
  - ✅ Deve reindirizzare a `/auth/login`
- [ ] Tentare accesso a `/dashboard/billing` senza login
  - ✅ Deve reindirizzare a `/auth/login`
- [ ] Tentare accesso a API protette senza autenticazione
  - ✅ Deve ritornare 401 Unauthorized

#### Test 6.2: Protezione Funzionalità
- [ ] Utente FREE tenta di accedere a funzionalità PRO
  - ✅ Deve mostrare banner "Upgrade required"
  - ✅ Funzionalità non accessibili
- [ ] Utente STARTER tenta di accedere a funzionalità PRO
  - ✅ Deve mostrare banner "Upgrade required"
- [ ] Utente PRO accede a funzionalità PRO
  - ✅ Funzionalità accessibili
  - ✅ Nessun banner di upgrade

#### Test 6.3: Sicurezza Database
- [ ] Verificare RLS (Row Level Security) in Supabase
  - ✅ Utenti possono vedere solo i propri dati
  - ✅ Utenti non possono modificare subscription di altri
- [ ] Verificare che subscription sia verificata lato server
  - ✅ API verificano subscription prima di permettere accesso

**📄 Checklist completa**: Vedi `TEST_COMPLETI_FINALI.md` sezione "Test 5: Validazione Sicurezza"

---

## 📊 Riepilogo Tempi

- **FASE 1**: Configurazione Stripe - 15-20 min
- **FASE 2**: Test Autenticazione - 10 min
- **FASE 3**: Test Dashboard - 20-30 min
- **FASE 4**: Test Stripe - 30-40 min
- **FASE 5**: Test Funzionalità Piano - 20-30 min
- **FASE 6**: Validazione Sicurezza - 15-20 min

**TOTALE**: ~2-2.5 ore per test completi

---

## 🎯 Ordine di Esecuzione Consigliato

1. ✅ **FASE 1** - Configurazione Stripe (FONDAMENTALE)
2. ✅ **FASE 2** - Test Autenticazione (BASE)
3. ✅ **FASE 3** - Test Dashboard (NAVIGAZIONE)
4. ✅ **FASE 4** - Test Stripe (PAGAMENTI)
5. ✅ **FASE 5** - Test Funzionalità Piano (FEATURES)
6. ✅ **FASE 6** - Validazione Sicurezza (SICUREZZA)

---

## 📝 Documenti di Riferimento

1. `CONFIGURAZIONE_STRIPE_TEST.md` - Guida completa configurazione Stripe
2. `TEST_COMPLETI_FINALI.md` - Checklist dettagliata tutti i test
3. `STRIPE_TEST_SETUP.md` - Setup avanzato Stripe CLI
4. `TEST_AUTHENTICATION_REPORT.md` - Report test autenticazione
5. `TEST_DASHBOARD_REPORT.md` - Report test dashboard
6. `TEST_STRIPE_REPORT.md` - Report test Stripe

---

## ✅ Checklist Finale

Dopo aver completato tutti i test, verifica:

- [ ] Tutti i test FASE 1-6 completati
- [ ] Nessun errore critico trovato
- [ ] Tutte le funzionalità principali funzionano
- [ ] Sicurezza verificata
- [ ] Documentazione aggiornata
- [ ] Pronto per test con primo cliente reale

---

**🚀 Inizia dalla FASE 1: Configurazione Stripe Test Keys!**

Vedi `CONFIGURAZIONE_STRIPE_TEST.md` per la guida dettagliata.
