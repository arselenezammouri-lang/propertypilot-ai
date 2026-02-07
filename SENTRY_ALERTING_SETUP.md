# 📊 Sentry Alerting Setup - PropertyPilot AI

## ✅ Status Attuale

### Configurazione Sentry

Sentry è già configurato nel progetto:

1. **Client-side** (`sentry.client.config.ts`)
   - Error tracking
   - Performance monitoring
   - Session replay

2. **Server-side** (`sentry.server.config.ts`)
   - API error tracking
   - Server-side exceptions

3. **Edge Runtime** (`sentry.edge.config.ts`)
   - Edge function errors

4. **Integration** (`lib/monitoring/sentry.ts`)
   - Wrapper functions per logging
   - `captureException` e `captureMessage`

---

## 🔔 Configurazione Alerting

### Step 1: Verificare Sentry DSN

Assicurati che `.env.local` contenga:

```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_AUTH_TOKEN=your_auth_token_here
SENTRY_ORG=your_org_slug
SENTRY_PROJECT=your_project_slug
```

### Step 2: Creare Alert Rules in Sentry Dashboard

1. **Vai a:** https://sentry.io → Il tuo progetto → Settings → Alerts

2. **Crea Alert per Errori Critici:**

   **Alert Name:** `Critical Errors - Production`
   - **Conditions:**
     - Event count is greater than 10 in 1 minute
     - OR Event count is greater than 50 in 5 minutes
   - **Filters:**
     - Environment: production
     - Level: error, fatal
     - Tags: non include "test", "development"
   - **Actions:**
     - Send email to: team@yourdomain.com
     - Send Slack notification (se configurato)
     - Create PagerDuty incident (se configurato)

3. **Crea Alert per Errori Stripe:**

   **Alert Name:** `Stripe Payment Errors`
   - **Conditions:**
     - Event count is greater than 5 in 5 minutes
   - **Filters:**
     - Tags: stripe, payment, checkout
     - Level: error
   - **Actions:**
     - Send email (URGENT)
     - Send SMS (se configurato)

4. **Crea Alert per Errori OpenAI:**

   **Alert Name:** `OpenAI API Errors`
   - **Conditions:**
     - Event count is greater than 20 in 5 minutes
   - **Filters:**
     - Tags: openai, ai, generation
     - Message contains: "quota" OR "rate limit"
   - **Actions:**
     - Send email
     - Create issue in GitHub (se integrato)

5. **Crea Alert per Performance:**

   **Alert Name:** `Slow API Responses`
   - **Conditions:**
     - Transaction duration is greater than 5000ms
     - Event count is greater than 10 in 5 minutes
   - **Filters:**
     - Transaction type: request
     - Environment: production
   - **Actions:**
     - Send email

---

## 📧 Configurazione Email Notifications

### In Sentry Dashboard:

1. **Settings → Notifications**
2. **Email:** Aggiungi indirizzi email del team
3. **Preferences:** Configura quando ricevere notifiche

### Raccomandazioni:

- **Critical Errors:** Notifica immediata
- **Warnings:** Digest giornaliero
- **Info:** Solo per review settimanale

---

## 🔗 Integrazioni Consigliate

### 1. Slack Integration

1. **Sentry Dashboard → Settings → Integrations → Slack**
2. **Connect Slack workspace**
3. **Seleziona canale** (es: #alerts-prod)
4. **Configura notifiche:**
   - Critical errors → #alerts-prod
   - Warnings → #alerts-prod (meno frequenti)

### 2. PagerDuty (Opzionale)

Per alerting 24/7:
1. **Sentry Dashboard → Settings → Integrations → PagerDuty**
2. **Connect PagerDuty**
3. **Configura escalation policies**

### 3. GitHub Integration

Per creare issue automaticamente:
1. **Sentry Dashboard → Settings → Integrations → GitHub**
2. **Connect repository**
3. **Configura auto-issue creation per errori critici**

---

## 🎯 Alert Rules Specifiche per PropertyPilot

### Alert 1: Payment Failures
```yaml
Name: Payment Processing Failures
Condition: > 5 errors in 5 minutes
Filters:
  - Tag: stripe
  - Tag: payment
  - Level: error
Actions:
  - Email: founder@propilot.ai
  - Slack: #critical-alerts
```

### Alert 2: Subscription Issues
```yaml
Name: Subscription Activation Failures
Condition: > 3 errors in 5 minutes
Filters:
  - Tag: subscription
  - Tag: webhook
  - Message contains: "subscription"
Actions:
  - Email: founder@propilot.ai
  - SMS: (se configurato)
```

### Alert 3: AI Generation Failures
```yaml
Name: AI Generation Errors
Condition: > 20 errors in 10 minutes
Filters:
  - Tag: openai
  - Tag: generation
  - Message contains: "quota" OR "rate limit"
Actions:
  - Email: tech@propilot.ai
  - Create GitHub issue
```

### Alert 4: Authentication Issues
```yaml
Name: Auth System Failures
Condition: > 10 errors in 5 minutes
Filters:
  - Tag: auth
  - Tag: login
  - Level: error
Actions:
  - Email: founder@propilot.ai
  - Slack: #critical-alerts
```

---

## 📊 Dashboard Monitoring

### Creare Dashboard in Sentry:

1. **Sentry Dashboard → Dashboards → New Dashboard**

2. **Aggiungi Widgets:**
   - **Error Rate:** Ultime 24h
   - **Top Errors:** Top 10 errori
   - **Performance:** P50, P95, P99 response times
   - **User Impact:** Utenti affetti da errori
   - **Stripe Events:** Successo/fallimento pagamenti
   - **AI Generation:** Successo/fallimento generazioni

3. **Salva Dashboard** come "Production Overview"

---

## 🔍 Verifica Setup

### Test Alert:

1. **Crea test error:**
   ```typescript
   // In un API route temporaneo
   import { captureException } from '@/lib/monitoring/sentry';
   
   captureException(new Error('TEST ALERT - Please ignore'));
   ```

2. **Verifica che:**
   - ✅ Error appare in Sentry
   - ✅ Alert viene triggerato
   - ✅ Email/Slack notification arriva

3. **Rimuovi test error**

---

## 📝 Checklist Pre-Launch

- [ ] Sentry DSN configurato in produzione
- [ ] Alert rules create e testate
- [ ] Email notifications configurate
- [ ] Slack integration (opzionale) configurata
- [ ] Dashboard monitoring creato
- [ ] Team ha accesso a Sentry
- [ ] Test alert eseguito e verificato
- [ ] Documentazione alerting condivisa con team

---

## 🚀 Post-Launch

### Monitorare:

1. **Daily:** Review errori critici
2. **Weekly:** Review performance trends
3. **Monthly:** Review e ottimizzazione alert rules

### Aggiustamenti:

- Aggiustare threshold se troppi/few alert
- Aggiungere nuovi alert per pattern emergenti
- Rimuovere alert non utili

---

**Status:** ✅ Sentry configurato, ⚠️ Alert rules da configurare in dashboard

**Prossimo Step:** Accedere a Sentry dashboard e configurare alert rules come sopra.
