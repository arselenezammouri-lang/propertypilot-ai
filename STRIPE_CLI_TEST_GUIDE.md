# 🧪 STRIPE CLI TEST GUIDE

**Come testare un acquisto Agency (€897) e verificare l'aggiornamento del database Supabase in tempo reale**

---

## 📋 PREREQUISITI

1. **Stripe CLI installato:**
   ```bash
   # Windows (con Scoop)
   scoop install stripe
   
   # O scarica da: https://stripe.com/docs/stripe-cli
   ```

2. **Account Stripe** con:
   - API keys configurate (Test Mode)
   - Webhook endpoint configurato

3. **Variabili ambiente configurate:**
   - `STRIPE_SECRET_KEY` (test key)
   - `STRIPE_WEBHOOK_SECRET` (per validazione webhook)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## 🚀 SETUP STRIPE CLI

### **1. Login a Stripe CLI:**

```bash
stripe login
```

Questo aprirà il browser per autenticarti.

### **2. Avvia Webhook Forwarding:**

In un terminale separato, avvia il forwarding dei webhook Stripe al tuo server locale:

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

**Output atteso:**
```
> Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
```

**IMPORTANTE:** Copia il `whsec_xxxxx` e aggiungilo al tuo `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### **3. Riavvia il server Next.js:**

```bash
npm run dev
```

---

## 🧪 TEST ACQUISTO AGENCY (€897)

### **Metodo 1: Test Manuale con Stripe CLI**

#### **Step 1: Crea un Checkout Session di Test**

In un nuovo terminale:

```bash
stripe checkout sessions create \
  --success-url "http://localhost:3000/dashboard?success=true" \
  --cancel-url "http://localhost:3000/dashboard?canceled=true" \
  --mode subscription \
  --line-items[0][price]=price_xxxxx \
  --line-items[0][quantity]=1 \
  --metadata[userId]=YOUR_USER_ID \
  --metadata[paymentType]=subscription
```

**Sostituisci:**
- `price_xxxxx` con il `price_id` del piano Agency (da Stripe Dashboard → Products → Agency)
- `YOUR_USER_ID` con l'ID utente reale da Supabase

#### **Step 2: Apri il Checkout URL**

Il comando restituirà un `url`. Apri quel URL nel browser e completa il checkout con:
- **Card di test:** `4242 4242 4242 4242`
- **Expiry:** Qualsiasi data futura
- **CVC:** Qualsiasi 3 cifre
- **ZIP:** Qualsiasi 5 cifre

#### **Step 3: Verifica Webhook**

Nel terminale dove hai avviato `stripe listen`, vedrai:
```
2025-01-XX XX:XX:XX   --> checkout.session.completed [evt_xxxxx]
2025-01-XX XX:XX:XX   --> customer.subscription.created [evt_xxxxx]
2025-01-XX XX:XX:XX   --> customer.subscription.updated [evt_xxxxx]
```

#### **Step 4: Verifica Database Supabase**

Apri Supabase Dashboard → Table Editor → `subscriptions`:

**Dovresti vedere:**
- ✅ `status = 'agency'`
- ✅ `stripe_subscription_id = 'sub_xxxxx'`
- ✅ `price_id = 'price_xxxxx'` (Agency)
- ✅ `current_period_start` e `current_period_end` popolati

**E in `profiles`:**
- ✅ `subscription_plan = 'agency'`

---

### **Metodo 2: Test Automatico con Stripe CLI Events**

#### **Step 1: Trigger Eventi di Test**

```bash
# Simula checkout completato
stripe trigger checkout.session.completed

# Simula subscription creata
stripe trigger customer.subscription.created

# Simula subscription aggiornata
stripe trigger customer.subscription.updated
```

**Nota:** Questi eventi generici potrebbero non avere tutti i metadata necessari. Meglio usare il Metodo 1.

---

### **Metodo 3: Test End-to-End Completo**

#### **Step 1: Crea Utente di Test in Supabase**

1. Vai su Supabase Dashboard → Authentication → Users
2. Crea un nuovo utente o usa uno esistente
3. Copia l'`user_id`

#### **Step 2: Crea Subscription Record in Supabase**

```sql
INSERT INTO subscriptions (user_id, status, stripe_customer_id)
VALUES ('YOUR_USER_ID', 'free', NULL);
```

#### **Step 3: Avvia Checkout dalla Dashboard**

1. Accedi con l'utente di test
2. Vai su `/dashboard/billing`
3. Clicca "Upgrade to Agency"
4. Completa il checkout con card di test

#### **Step 4: Monitora Webhook in Tempo Reale**

Nel terminale `stripe listen`, vedrai tutti gli eventi in tempo reale.

#### **Step 5: Verifica Database**

Controlla che `subscriptions` e `profiles` siano aggiornati correttamente.

---

## 🔍 DEBUGGING

### **Problema: Webhook non ricevuto**

**Soluzione:**
1. Verifica che `stripe listen` sia attivo
2. Verifica che `STRIPE_WEBHOOK_SECRET` sia corretto
3. Controlla i log del server Next.js per errori

### **Problema: Database non aggiornato**

**Soluzione:**
1. Controlla i log del webhook: `app/api/stripe/webhook/route.ts`
2. Verifica che `SUPABASE_SERVICE_ROLE_KEY` sia configurato
3. Controlla che l'utente esista in `subscriptions` table

### **Problema: Price ID non riconosciuto**

**Soluzione:**
1. Verifica che `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID` sia configurato
2. Verifica che il `price_id` in Stripe corrisponda a quello in `.env.local`
3. Controlla `lib/stripe/config.ts` per mapping corretto

---

## 📊 VERIFICA FINALE

**Checklist per test riuscito:**

- [ ] Webhook ricevuto (vedi in `stripe listen`)
- [ ] `subscriptions.status = 'agency'`
- [ ] `subscriptions.stripe_subscription_id` popolato
- [ ] `subscriptions.price_id` corretto (Agency)
- [ ] `subscriptions.current_period_start` e `current_period_end` popolati
- [ ] `profiles.subscription_plan = 'agency'`
- [ ] Nessun errore nei log del server

---

## 🎯 COMANDI RAPIDI

```bash
# 1. Avvia webhook forwarding
stripe listen --forward-to http://localhost:3000/api/stripe/webhook

# 2. In un altro terminale, avvia il server
npm run dev

# 3. Test checkout (sostituisci price_id e user_id)
stripe checkout sessions create \
  --success-url "http://localhost:3000/dashboard?success=true" \
  --cancel-url "http://localhost:3000/dashboard?canceled=true" \
  --mode subscription \
  --line-items[0][price]=price_xxxxx \
  --line-items[0][quantity]=1 \
  --metadata[userId]=user_xxxxx \
  --metadata[paymentType]=subscription
```

---

**Documento Generato da:** Auto (CTO AI Assistant)  
**Data:** Gennaio 2025  
**Status:** ✅ **GUIDA COMPLETA**
