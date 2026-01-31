# ⚡ COMANDI RAPIDI - TEST ACQUISTO AGENCY

## 🎯 SETUP VELOCE (5 minuti)

### 1️⃣ INSTALLA STRIPE CLI

**Windows:**
```powershell
# Opzione A: Download diretto
# https://github.com/stripe/stripe-cli/releases/latest
# Scarica stripe_X.X.X_windows_x86_64.zip
# Estrai e aggiungi al PATH

# Opzione B: Con Scoop (se installato)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
scoop install stripe
```

### 2️⃣ LOGIN STRIPE CLI

```bash
stripe login
```

### 3️⃣ AVVIA WEBHOOK FORWARDING

**In un terminale separato (lascialo aperto):**

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

**Copia il `whsec_xxxxx` e aggiungilo a `.env.local`:**
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Riavvia il server Next.js:**
```bash
npm run dev
```

---

## 🚀 TEST AUTOMATICO (Script PowerShell)

```powershell
.\test-agency-purchase.ps1
```

Lo script ti guiderà passo-passo!

---

## 🧪 TEST MANUALE

### STEP 1: Ottieni User ID

**Opzione A: Script Node.js**
```bash
node get-user-id.mjs
```

**Opzione B: Supabase Dashboard**
- Vai su Supabase Dashboard → Authentication → Users
- Copia l'`id` (UUID)

### STEP 2: Crea Checkout Session

**PowerShell (una riga):**
```powershell
stripe checkout sessions create --success-url "http://localhost:3000/dashboard?success=true" --cancel-url "http://localhost:3000/dashboard?canceled=true" --mode subscription --line-items[0][price]=price_1SbnuWPIXFceTuUzZnECDZR --line-items[0][quantity]=1 --metadata[userId]=TUO_USER_ID_QUI --metadata[paymentType]=subscription
```

**Bash/Linux:**
```bash
stripe checkout sessions create \
  --success-url "http://localhost:3000/dashboard?success=true" \
  --cancel-url "http://localhost:3000/dashboard?canceled=true" \
  --mode subscription \
  --line-items[0][price]=price_1SbnuWPIXFceTuUzZnECDZR \
  --line-items[0][quantity]=1 \
  --metadata[userId]=TUO_USER_ID_QUI \
  --metadata[paymentType]=subscription
```

### STEP 3: Completa il Checkout

1. Apri l'URL restituito dal comando
2. Usa card di test: `4242 4242 4242 4242`
3. Expiry: `12/25` (qualsiasi data futura)
4. CVC: `123`
5. ZIP: `12345`

### STEP 4: Verifica

**Nel terminale `stripe listen`:**
```
✅ checkout.session.completed
✅ customer.subscription.created
✅ customer.subscription.updated
```

**Supabase Dashboard:**
- `subscriptions.status = 'agency'`
- `profiles.subscription_plan = 'agency'`

**Dashboard App:**
- Piano Agency attivo
- Badge 💎 SOLDI visibile per lead con `lead_score > 90`

---

## 📊 PRICE ID CONFIGURATI

```
✅ Starter:  price_1SbnRNPIXFfceTJumcNk9uhO (€197)
✅ Pro:      price_1SbnlmPIXFfceTJuVDLUsvCg (€497)
✅ Agency:   price_1SbnuWPIXFceTuUzZnECDZR  (€897) ← TEST
✅ Boost:    price_1SbnzvP1XFceTuLETLvT9G   (€2,497)
```

---

## 🔧 TROUBLESHOOTING

### Stripe CLI non trovato
```powershell
# Verifica installazione
stripe --version

# Se non installato, vedi STEP 1 sopra
```

### Webhook non ricevuto
1. Verifica `stripe listen` è attivo
2. Verifica `STRIPE_WEBHOOK_SECRET` in `.env.local`
3. Riavvia server Next.js

### Database non aggiornato
1. Controlla log server Next.js
2. Verifica `SUPABASE_SERVICE_ROLE_KEY` configurato
3. Verifica utente esiste in `subscriptions` table

### Price ID non riconosciuto
1. Verifica `.env.local` ha `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_1SbnuWPIXFceTuUzZnECDZR`
2. Verifica Price ID in Stripe Dashboard corrisponde

---

**Status:** ✅ **PRONTO PER TEST**
