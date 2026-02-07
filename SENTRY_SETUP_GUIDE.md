# 🔧 SENTRY SETUP GUIDE - PropertyPilot AI

**Status:** ✅ Configurazione pronta | ⏳ Installazione richiesta

---

## 📋 COSA È STATO FATTO

### ✅ **1. Configurazione Completa**
- ✅ `sentry.client.config.ts` - Client-side config
- ✅ `sentry.server.config.ts` - Server-side config
- ✅ `sentry.edge.config.ts` - Edge runtime config
- ✅ `instrumentation.ts` - Next.js instrumentation hook
- ✅ `lib/monitoring/sentry.ts` - Helper functions
- ✅ Integrazione in Error Boundaries
- ✅ Integrazione in Global Error Handler
- ✅ Integrazione nel Logger

### ✅ **2. Integrazioni**
- ✅ Error Boundary → Sentry
- ✅ Global Error Handler → Sentry
- ✅ Safe Logger → Sentry (automatico per errori)
- ✅ Performance monitoring ready

---

## 🚀 INSTALLAZIONE (2-3 ore)

### **STEP 1: Install Sentry**
```bash
npm install @sentry/nextjs
```

### **STEP 2: Setup Sentry Account**
1. Vai su https://sentry.io
2. Crea account (free tier: 5k events/mese)
3. Crea nuovo progetto "PropertyPilot AI"
4. Seleziona "Next.js" come framework
5. Copia il **DSN** (es: `https://xxx@sentry.io/xxx`)

### **STEP 3: Configura Environment Variables**
Aggiungi in `.env.local`:
```bash
# Sentry DSN (stesso per client e server)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_DSN=https://xxx@sentry.io/xxx

# Opzionale: Debug mode
SENTRY_DEBUG=false
NEXT_PUBLIC_SENTRY_DEBUG=false
```

### **STEP 4: Run Sentry Wizard (Opzionale)**
```bash
npx @sentry/wizard@latest -i nextjs
```
**Nota:** I file di configurazione sono già creati, il wizard può sovrascriverli. Usa solo se vuoi la configurazione automatica.

### **STEP 5: Verifica**
1. Avvia il server: `npm run dev`
2. Genera un errore di test (es: vai su una route che non esiste)
3. Controlla Sentry Dashboard → Dovresti vedere l'errore

---

## ✅ **VERIFICA INTEGRAZIONE**

### **Test Error Boundary**
1. Vai su `/dashboard`
2. Apri console (F12)
3. Esegui: `throw new Error('Test Sentry')`
4. Verifica che l'errore appaia in Sentry

### **Test API Error**
1. Chiama un'API che fallisce
2. Verifica che l'errore appaia in Sentry con context

### **Test Performance**
1. Naviga tra le pagine
2. Verifica che le performance transactions appaiano in Sentry

---

## 📊 **COSA MONITORA SENTRY**

### **Errori**
- ✅ React component errors (Error Boundary)
- ✅ Route errors (Global Error Handler)
- ✅ API errors (Logger integration)
- ✅ Unhandled exceptions

### **Performance**
- ✅ Page load times
- ✅ API response times
- ✅ Database query times
- ✅ Third-party API calls

### **User Context**
- ✅ User ID (se autenticato)
- ✅ Browser/Device info
- ✅ URL e route
- ✅ Session info

---

## 🔒 **SICUREZZA**

### **Dati Sanitizzati**
- ✅ Nessun dato sensibile inviato
- ✅ Cookies rimossi
- ✅ Authorization headers rimossi
- ✅ Email/Phone/User IDs redacted

### **Privacy**
- ✅ Session Replay con maskAllText
- ✅ Media bloccati in replay
- ✅ beforeSend filtra dati sensibili

---

## 🎯 **ALERT CONFIGURATION**

### **Setup Alert in Sentry Dashboard:**
1. Vai su **Alerts** → **Create Alert Rule**
2. Configura:
   - **Trigger:** Error rate > 5% in 5 minuti
   - **Action:** Email/Slack notification
   - **Filter:** Solo production environment

### **Alert Consigliati:**
- Error rate spike (>10 errori/minuto)
- Critical errors (500, 502, 503)
- Performance degradation (p95 > 2s)
- New error types

---

## 📈 **DASHBOARD SENTRY**

### **Metriche Chiave:**
- **Error Rate:** <0.1%
- **Performance:** p95 < 500ms
- **Uptime:** 99.9%+

### **Report Settimanali:**
- Top 10 errori
- Performance trends
- User impact analysis

---

## ✅ **CONCLUSIONE**

**Configurazione:** ✅ COMPLETA  
**Installazione:** ⏳ Richiede npm install + DSN  
**Tempo:** 2-3 ore totali

**Una volta installato, Sentry monitorerà automaticamente:**
- Tutti gli errori
- Performance issues
- User experience problems

**Il SaaS sarà BLINDATO!** 🛡️
