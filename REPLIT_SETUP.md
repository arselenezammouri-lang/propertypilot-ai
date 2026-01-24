# 🚀 PropertyPilot AI - Setup Replit

## ✅ Cosa Succede Quando Apri il Progetto su Replit

Quando apri il progetto su Replit, vedrai **automaticamente**:
- ✅ Tutti i file del progetto
- ✅ La struttura delle cartelle
- ✅ Il codice sorgente

**MA** devi configurare alcune cose per farlo funzionare:

---

## 📋 Checklist Setup Replit

### 1. **Installare Dipendenze** (Prima volta)
```bash
npm install
```
Esegui questo comando nel terminale di Replit.

---

### 2. **Configurare Variabili d'Ambiente (Replit Secrets)**

Vai su **Tools → Secrets** in Replit e aggiungi tutte queste variabili:

#### **Supabase (Database & Auth)**
```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **OpenAI (AI Features)**
```
OPENAI_API_KEY = sk-xxxxx...
```

#### **Bland AI (Voice Calls)**
```
BLAND_AI_API_KEY = sk_live_xxxxx...
```

#### **Stripe (Payments)**
```
STRIPE_SECRET_KEY = sk_test_xxxxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_xxxxx...
STRIPE_WEBHOOK_SECRET = whsec_xxxxx...
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID = price_xxxxx...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID = price_xxxxx...
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID = price_xxxxx...
NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID = price_xxxxx...
```

#### **Google Calendar (Agency Plan)**
```
GOOGLE_CLIENT_ID = your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = your-client-secret
GOOGLE_REFRESH_TOKEN = your-refresh-token
```

#### **App Configuration**
```
NEXT_PUBLIC_APP_URL = https://your-replit-url.repl.co
```

#### **Opzionali**
```
RESEND_API_KEY = re_xxxxx...
RESEND_FROM_EMAIL = PropertyPilot AI <noreply@propertypilot.ai>
ENCRYPTION_KEY = your-256-bit-key-here
HASH_SALT = your-hash-salt-here
```

---

### 3. **Configurare Run Command**

In Replit, vai su **Tools → Run** e imposta:

**Run Command:**
```bash
npm run dev
```

Oppure per produzione:
```bash
npm run build && npm start
```

---

### 4. **Avviare il Server**

Clicca sul pulsante **Run** in Replit oppure esegui:
```bash
npm run dev
```

Il server partirà su `http://localhost:3000` o sull'URL Replit fornito.

---

## 🔍 Verifica Setup

Dopo aver configurato tutto, verifica che:

1. ✅ `npm install` completato senza errori
2. ✅ Tutte le variabili d'ambiente aggiunte in Replit Secrets
3. ✅ `NEXT_PUBLIC_APP_URL` punta al tuo URL Replit
4. ✅ Server avviato senza errori
5. ✅ Puoi accedere a `http://localhost:3000` o all'URL Replit

---

## 🐛 Troubleshooting

### **Errore: "Module not found"**
```bash
npm install
```

### **Errore: "Environment variable not found"**
- Verifica che tutte le variabili siano in **Replit Secrets**
- Riavvia il server dopo aver aggiunto nuove variabili

### **Errore: "Port already in use"**
- Replit gestisce automaticamente le porte
- Usa l'URL fornito da Replit invece di localhost

### **Build Fallisce**
- Verifica che tutte le dipendenze siano installate
- Controlla i log per errori specifici

---

## 📝 Note Importanti

1. **Replit Secrets** sono sicuri e non vengono esposti al client
2. **NEXT_PUBLIC_*** variabili sono accessibili dal browser
3. **NON** committare file `.env.local` nel repository
4. Il progetto è già configurato per Replit (vedi `package.json` con plugin Replit)

---

## 🎯 Pronto al Lancio!

Una volta completato il setup, PropertyPilot AI sarà **live su Replit** e accessibile tramite l'URL fornito dalla piattaforma.
