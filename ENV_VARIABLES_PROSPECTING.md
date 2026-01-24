# Variabili d'Ambiente per Prospecting Dashboard

Questo documento elenca tutte le variabili d'ambiente necessarie per far funzionare al 100% la **Prospecting Dashboard** con Voice AI e notifiche email.

## 🔑 Variabili Richieste

### **1. Supabase (Database & Auth)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Dove trovarle:** Supabase Dashboard → Settings → API
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key (⚠️ **SECRET**, non esporre al client)

---

### **2. Bland AI (Voice Calls)**
```env
BLAND_AI_API_KEY=sk_live_xxxxx...
```
**Dove trovarla:** [Bland AI Dashboard](https://bland.ai) → API Keys
- Necessaria per le chiamate automatiche ai proprietari
- **Status:** ⚠️ **CRITICA** - Senza questa, il pulsante "Chiama Ora" non funzionerà

---

### **3. Resend (Email Notifications)**
```env
RESEND_API_KEY=re_xxxxx...
RESEND_FROM_EMAIL=PropertyPilot AI <noreply@propertypilot.ai>
```
**Dove trovarla:** [Resend Dashboard](https://resend.com) → API Keys
- `RESEND_API_KEY`: API key da Resend (inizia con `re_`)
- `RESEND_FROM_EMAIL`: Email mittente (opzionale, default: `PropertyPilot AI <noreply@propertypilot.ai>`)
- **Status:** ⚠️ **IMPORTANTE** - Senza questa, le notifiche email non verranno inviate quando viene fissato un appuntamento

---

### **4. OpenAI (AI Features)**
```env
OPENAI_API_KEY=sk-xxxxx...
```
**Dove trovarla:** [OpenAI Platform](https://platform.openai.com) → API Keys
- Necessaria per Lead Scoring, AI Summary, e altre funzionalità AI
- **Status:** ✅ Già configurata (se hai altre feature AI funzionanti)

---

### **5. Stripe (Subscriptions - Già Configurata)**
```env
STRIPE_SECRET_KEY=sk_test_xxxxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx...
STRIPE_WEBHOOK_SECRET=whsec_xxxxx...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxx...
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_xxxxx...
```
**Dove trovarle:** Stripe Dashboard → Developers → API Keys
- **Status:** ✅ Già configurate (se hai i piani Stripe funzionanti)
- Necessarie perché Prospecting è solo per piani PRO/AGENCY

---

### **6. App URL (Webhook Callback)**
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```
**Dove trovarla:** URL della tua applicazione (Vercel, production, etc.)
- Necessaria per il webhook callback di Bland AI
- In sviluppo locale: `http://localhost:3000`
- In produzione: `https://your-domain.vercel.app`

---

## 📋 Checklist Setup Completo

### ✅ Setup Base (Minimo per Dashboard)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `OPENAI_API_KEY`

### ✅ Setup Voice AI (Per "Chiama Ora")
- [ ] `BLAND_AI_API_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` (per webhook callback)

### ✅ Setup Email Notifications (Per notifiche appuntamenti)
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_EMAIL` (opzionale)

### ✅ Setup Subscriptions (Per accesso PRO/AGENCY)
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
- [ ] `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID`

---

## 🔧 File `.env.local` Completo (Esempio)

```env
# ============================================
# SUPABASE
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# BLAND AI (Voice Calls)
# ============================================
BLAND_AI_API_KEY=sk_live_xxxxx...

# ============================================
# RESEND (Email Notifications)
# ============================================
RESEND_API_KEY=re_xxxxx...
RESEND_FROM_EMAIL=PropertyPilot AI <noreply@propertypilot.ai>

# ============================================
# OPENAI
# ============================================
OPENAI_API_KEY=sk-xxxxx...

# ============================================
# STRIPE
# ============================================
STRIPE_SECRET_KEY=sk_test_xxxxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx...
STRIPE_WEBHOOK_SECRET=whsec_xxxxx...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxx...
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_xxxxx...

# ============================================
# APP URL
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
# In produzione: https://your-domain.vercel.app
```

---

## ⚠️ Note Importanti

1. **Bland AI API Key:**
   - Puoi ottenere una API key da [bland.ai](https://bland.ai)
   - Il servizio è a pagamento per minuto di chiamata
   - Consigliato: iniziare con il piano trial per test

2. **Resend API Key:**
   - Registrati su [resend.com](https://resend.com)
   - Piano gratuito: 3,000 email/mese
   - Piano Pro: $20/mese per 50,000 email/mese
   - **Importante:** Verifica il dominio mittente in produzione (per ora puoi usare il dominio Resend di test)

3. **Webhook URL:**
   - In sviluppo: usa un tunnel (ngrok, Cloudflare Tunnel) per esporre `localhost:3000`
   - In produzione: usa il dominio Vercel
   - Configura il webhook URL in Bland AI Dashboard: `{NEXT_PUBLIC_APP_URL}/api/prospecting/call/webhook`

4. **Sicurezza:**
   - ⚠️ **MAI** committare `.env.local` nel repository
   - ⚠️ `SUPABASE_SERVICE_ROLE_KEY` e `BLAND_AI_API_KEY` sono **SECRET** - non esporli al client
   - In Vercel: aggiungi tutte le variabili in Settings → Environment Variables

---

## 🧪 Test Setup

Dopo aver configurato tutte le variabili, testa:

1. **Dashboard:** Vai su `/dashboard/prospecting` - deve caricare senza errori
2. **Voice AI:** Clicca "Chiama Ora" su un annuncio - deve avviare la chiamata
3. **Email:** Quando un appuntamento viene fissato, controlla la tua email

---

## 📞 Supporto

Se hai problemi:
1. Verifica che tutte le variabili siano nel file `.env.local`
2. Riavvia il server di sviluppo (`npm run dev`)
3. Controlla i log della console per errori specifici
4. Verifica che le API keys siano valide e attive

