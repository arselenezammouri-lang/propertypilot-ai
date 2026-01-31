# 🔧 Configurazione Stripe Test Keys - Guida Completa

## 📋 STEP 1: Ottenere Stripe Test Keys

### 1.1 Accedi a Stripe Dashboard
1. Vai su [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Accedi con il tuo account Stripe
3. **IMPORTANTE**: Assicurati di essere in modalità **Test** (toggle in alto a destra deve dire "Test mode")

### 1.2 Ottieni le API Keys
1. Vai su **Developers** → **API keys**
2. Trova la sezione **Test mode keys**
3. Copia:
   - **Publishable key** (inizia con `pk_test_`)
   - **Secret key** (inizia con `sk_test_`) - Clicca "Reveal test key"

### 1.3 Crea i Price IDs per i Piani

#### Crea Prodotto e Price per STARTER (€197/mese):
1. Vai su **Products** → **+ Add product**
2. Nome prodotto: `PropertyPilot AI - Starter`
3. Descrizione: `AI Listing Engine + Lead Score Base`
4. Prezzo: `€197.00`
5. Billing period: `Monthly` (ricorrente)
6. Clicca **Save product**
7. **Copia il Price ID** (inizia con `price_`)

#### Crea Prodotto e Price per PRO (€497/mese):
1. Vai su **Products** → **+ Add product**
2. Nome prodotto: `PropertyPilot AI - Pro`
3. Descrizione: `Smart Briefing Multi-Categoria + Virtual Staging 3D + CRM`
4. Prezzo: `€497.00`
5. Billing period: `Monthly` (ricorrente)
6. Clicca **Save product**
7. **Copia il Price ID** (inizia con `price_`)

#### Crea Prodotto e Price per AGENCY (€897/mese):
1. Vai su **Products** → **+ Add product**
2. Nome prodotto: `PropertyPilot AI - Agency`
3. Descrizione: `Omnichannel Domination Suite - Voice AI Illimitato`
4. Prezzo: `€897.00`
5. Billing period: `Monthly` (ricorrente)
6. Clicca **Save product**
7. **Copia il Price ID** (inizia con `price_`)

#### Crea Prodotto e Price per AGENCY BOOST (€2,497 una tantum):
1. Vai su **Products** → **+ Add product`
2. Nome prodotto: `PropertyPilot AI - Agency Boost`
3. Descrizione: `Done-for-you setup package`
4. Prezzo: `€2,497.00`
5. Billing period: `One time` (una tantum)
6. Clicca **Save product**
7. **Copia il Price ID** (inizia con `price_`)

---

## 📋 STEP 2: Configurare .env.local

### 2.1 Verifica se .env.local esiste
Controlla se hai già un file `.env.local` nella root del progetto.

### 2.2 Aggiungi le variabili Stripe

Apri `.env.local` e aggiungi/modifica queste variabili:

```env
# ============================================
# STRIPE (Test Mode)
# ============================================
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Verrà configurato dopo con Stripe CLI

# Stripe Price IDs (Test Mode)
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_YOUR_STARTER_PRICE_ID
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_YOUR_PRO_PRICE_ID
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_YOUR_AGENCY_PRICE_ID
NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID=price_YOUR_BOOST_PRICE_ID

# App URL (per redirect dopo checkout)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Sostituisci:**
- `YOUR_SECRET_KEY_HERE` con la tua Secret key da Stripe
- `YOUR_PUBLISHABLE_KEY_HERE` con la tua Publishable key da Stripe
- `YOUR_STARTER_PRICE_ID` con il Price ID del piano Starter
- `YOUR_PRO_PRICE_ID` con il Price ID del piano Pro
- `YOUR_AGENCY_PRICE_ID` con il Price ID del piano Agency
- `YOUR_BOOST_PRICE_ID` con il Price ID del pacchetto Boost

---

## 📋 STEP 3: Configurare Stripe CLI per Webhook (Opzionale ma Consigliato)

### 3.1 Installa Stripe CLI

**Windows (PowerShell come Admin):**
```powershell
# Opzione 1: Con Scoop (se installato)
scoop install stripe

# Opzione 2: Con Chocolatey (se installato)
choco install stripe-cli

# Opzione 3: Download manuale
# Vai su: https://github.com/stripe/stripe-cli/releases/latest
# Scarica: stripe_X.X.X_windows_x86_64.zip
# Estrai e aggiungi al PATH
```

**Verifica installazione:**
```bash
stripe --version
```

### 3.2 Login Stripe CLI
```bash
stripe login
```

Questo aprirà il browser per autenticarti con il tuo account Stripe.

### 3.3 Avvia Webhook Forwarding

In un terminale separato (lascialo aperto durante i test):

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

**IMPORTANTE**: Copia il `whsec_xxxxx` che appare e aggiungilo al `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

Poi **riavvia il server Next.js**.

---

## 📋 STEP 4: Verifica Configurazione

### 4.1 Verifica Variabili d'Ambiente

Crea uno script di verifica o controlla manualmente che tutte le variabili siano presenti:

```bash
# Verifica che le variabili siano caricate (non mostrerà i valori per sicurezza)
node -e "console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Configurato' : '❌ Mancante')"
```

### 4.2 Riavvia il Server

Dopo aver aggiunto le variabili, **riavvia il server Next.js**:

```bash
# Ferma il server (Ctrl+C)
# Poi riavvia:
npm run dev
```

---

## 📋 STEP 5: Test Rapido Configurazione

### 5.1 Test API Checkout

Apri il browser e vai su:
```
http://localhost:3000/dashboard/billing
```

Dovresti vedere:
- ✅ Tutti i piani visualizzati
- ✅ Nessun errore in console
- ✅ Pulsanti "Scegli" presenti

### 5.2 Test Checkout (con utente autenticato)

1. Assicurati di essere loggato
2. Vai su `/dashboard/billing`
3. Clicca "Scegli Starter" (o qualsiasi piano)
4. **Dovresti essere reindirizzato a Stripe Checkout**

Se vedi un errore, controlla:
- Console del browser (F12)
- Log del server Next.js
- Che tutte le variabili siano configurate correttamente

---

## 🧪 Carte di Test Stripe

Quando testi il checkout, usa queste carte di test:

### Carta di Test Standard (Successo):
- **Numero**: `4242 4242 4242 4242`
- **Expiry**: Qualsiasi data futura (es. `12/25`)
- **CVC**: Qualsiasi 3 cifre (es. `123`)
- **ZIP**: Qualsiasi 5 cifre (es. `12345`)

### Altre Carte di Test:
- **3D Secure richiesto**: `4000 0025 0000 3155`
- **Carta rifiutata**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`

Vedi tutte le carte di test: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## ✅ Checklist Configurazione

- [ ] Account Stripe creato/accessibile
- [ ] Modalità Test attiva in Stripe Dashboard
- [ ] API Keys copiate (Secret e Publishable)
- [ ] 4 Price IDs creati (Starter, Pro, Agency, Boost)
- [ ] Variabili aggiunte a `.env.local`
- [ ] Stripe CLI installato (opzionale)
- [ ] Webhook secret configurato (se usi Stripe CLI)
- [ ] Server Next.js riavviato
- [ ] Test rapido checkout funzionante

---

## 🚨 Troubleshooting

### Errore: "STRIPE_SECRET_KEY is not set"
- Verifica che `.env.local` esista nella root del progetto
- Verifica che la variabile sia scritta correttamente: `STRIPE_SECRET_KEY=sk_test_...`
- Riavvia il server Next.js

### Errore: "Invalid price ID"
- Verifica che i Price IDs in `.env.local` corrispondano a quelli in Stripe
- Verifica che i Price IDs siano in modalità Test (non Live)
- Verifica che i prodotti siano creati correttamente in Stripe

### Checkout non si apre
- Verifica che l'utente sia autenticato
- Controlla la console del browser per errori
- Verifica che `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` sia configurato
- Verifica che i Price IDs siano corretti

### Webhook non ricevuto
- Verifica che `stripe listen` sia attivo
- Verifica che `STRIPE_WEBHOOK_SECRET` sia corretto
- Verifica che l'endpoint webhook sia accessibile: `http://localhost:3000/api/stripe/webhook`

---

## 📝 Note Importanti

1. **Test Mode vs Live Mode**: Assicurati sempre di essere in Test Mode durante lo sviluppo
2. **Price IDs**: I Price IDs in Test Mode sono diversi da quelli in Live Mode
3. **Webhook**: Per test locali, usa Stripe CLI. Per produzione, configura webhook in Stripe Dashboard
4. **Sicurezza**: Non committare mai `.env.local` nel repository (dovrebbe essere già in `.gitignore`)

---

**Status**: ✅ **GUIDA COMPLETA PER CONFIGURAZIONE STRIPE TEST**

Dopo aver completato questa configurazione, procedi con i test manuali seguendo `TEST_COMPLETI_FINALI.md`
