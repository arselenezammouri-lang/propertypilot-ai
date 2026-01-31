# 🚀 STRIPE TEST SETUP - Test Acquisto Agency €897

## 📋 STEP 1: INSTALLAZIONE STRIPE CLI

### Windows (PowerShell come Admin):

```powershell
# Opzione 1: Con Scoop (se installato)
scoop install stripe

# Opzione 2: Download diretto
# Vai su: https://github.com/stripe/stripe-cli/releases/latest
# Scarica: stripe_X.X.X_windows_x86_64.zip
# Estrai e aggiungi al PATH

# Opzione 3: Con Chocolatey (se installato)
choco install stripe-cli
```

### Verifica installazione:
```bash
stripe --version
```

---

## 📋 STEP 2: LOGIN STRIPE CLI

```bash
stripe login
```

Questo aprirà il browser per autenticarti con il tuo account Stripe.

---

## 📋 STEP 3: AVVIA WEBHOOK FORWARDING

In un terminale separato (lascialo aperto):

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

**IMPORTANTE:** Copia il `whsec_xxxxx` che appare e aggiungilo al `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

Poi **riavvia il server Next.js**.

---

## 📋 STEP 4: OTTIENI IL TUO USER_ID

### Metodo A: Dalla Dashboard Supabase
1. Vai su Supabase Dashboard → Authentication → Users
2. Trova il tuo utente
3. Copia l'`id` (UUID)

### Metodo B: Dalla Console Browser
1. Apri `http://localhost:3000/dashboard`
2. Apri DevTools (F12) → Console
3. Esegui:
```javascript
fetch('/api/user/subscription').then(r => r.json()).then(d => console.log('User ID:', d.userId || 'Check response'))
```

### Metodo C: Script Node.js
Esegui lo script `get-user-id.mjs` (vedi sotto)

---

## 📋 STEP 5: TEST ACQUISTO AGENCY

### Price ID Agency (già configurato):
```
price_1SbnuWPIXFceTuUzZnECDZR
```

### Comando Test (sostituisci YOUR_USER_ID):

```bash
stripe checkout sessions create \
  --success-url "http://localhost:3000/dashboard?success=true" \
  --cancel-url "http://localhost:3000/dashboard?canceled=true" \
  --mode subscription \
  --line-items[0][price]=price_1SbnuWPIXFceTuUzZnECDZR \
  --line-items[0][quantity]=1 \
  --metadata[userId]=YOUR_USER_ID \
  --metadata[paymentType]=subscription
```

### Oppure con PowerShell (una riga):

```powershell
stripe checkout sessions create --success-url "http://localhost:3000/dashboard?success=true" --cancel-url "http://localhost:3000/dashboard?canceled=true" --mode subscription --line-items[0][price]=price_1SbnuWPIXFceTuUzZnECDZR --line-items[0][quantity]=1 --metadata[userId]=YOUR_USER_ID --metadata[paymentType]=subscription
```

### Completa il Checkout:
1. Il comando restituirà un `url`
2. Apri quel URL nel browser
3. Usa card di test: `4242 4242 4242 4242`
4. Expiry: qualsiasi data futura (es. 12/25)
5. CVC: qualsiasi 3 cifre (es. 123)
6. ZIP: qualsiasi 5 cifre (es. 12345)

---

## 📋 STEP 6: VERIFICA RISULTATO

### Nel terminale `stripe listen` vedrai:
```
2025-01-XX XX:XX:XX   --> checkout.session.completed [evt_xxxxx]
2025-01-XX XX:XX:XX   --> customer.subscription.created [evt_xxxxx]
2025-01-XX XX:XX:XX   --> customer.subscription.updated [evt_xxxxx]
```

### Verifica Database Supabase:
1. Vai su Supabase Dashboard → Table Editor → `subscriptions`
2. Cerca il tuo `user_id`
3. Verifica:
   - ✅ `status = 'agency'`
   - ✅ `stripe_subscription_id` popolato
   - ✅ `price_id = 'price_1SbnuWPIXFceTuUzZnECDZR'`

4. Verifica `profiles`:
   - ✅ `subscription_plan = 'agency'`

### Verifica Dashboard:
1. Ricarica `http://localhost:3000/dashboard`
2. Dovresti vedere il piano Agency attivo
3. I badge **💎 SOLDI** dovrebbero apparire per lead con `lead_score > 90`

---

## 🔧 TROUBLESHOOTING

### Webhook non ricevuto:
- Verifica che `stripe listen` sia attivo
- Verifica che `STRIPE_WEBHOOK_SECRET` sia corretto
- Riavvia il server Next.js dopo aver aggiunto il secret

### Database non aggiornato:
- Controlla i log del server Next.js
- Verifica che `SUPABASE_SERVICE_ROLE_KEY` sia configurato
- Verifica che l'utente esista in `subscriptions` table

### Price ID non riconosciuto:
- Verifica `.env.local` ha `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_1SbnuWPIXFceTuUzZnECDZR`
- Verifica che il Price ID in Stripe corrisponda

---

**Status:** ✅ **GUIDA COMPLETA PER TEST LOCALE**
