# 🏗️ Architecture Documentation - PropertyPilot AI

**Versione:** 1.0.0  
**Ultimo aggiornamento:** ${new Date().toISOString()}

---

## 📋 Overview

PropertyPilot AI è un SaaS Enterprise per il mercato immobiliare globale, costruito con Next.js 14, Supabase, e Stripe.

**Stack Tecnologico:**
- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend:** Next.js API Routes, Supabase
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **AI:** OpenAI GPT-4
- **Voice:** Bland AI
- **Monitoring:** Sentry
- **Deployment:** Replit / Vercel

---

## 🏛️ Architettura Generale

```
┌─────────────────┐
│   Client (Web)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Next.js App   │
│  (App Router)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │        │
    ▼        ▼
┌────────┐ ┌──────────┐
│Supabase│ │  Stripe   │
│  (DB)  │ │ (Payment) │
└────────┘ └──────────┘
    │
    ▼
┌──────────┐
│ OpenAI   │
│  GPT-4   │
└──────────┘
```

---

## 📁 Struttura Progetto

```
propilot-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard pages
│   ├── (auth)/            # Auth pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
│
├── components/             # React components
│   ├── ui/               # UI components (shadcn)
│   └── ...               # Feature components
│
├── lib/                   # Utilities & helpers
│   ├── ai/               # AI logic (OpenAI)
│   ├── i18n/             # Internationalization
│   ├── monitoring/       # Sentry, logging
│   ├── stripe/           # Stripe integration
│   ├── supabase/         # Supabase client
│   └── utils/            # Utilities
│
├── __tests__/            # Unit tests (Jest)
├── e2e/                  # E2E tests (Playwright)
│
└── scripts/              # Utility scripts
    ├── performance/     # Performance tests
    └── ...              # Other scripts
```

---

## 🔐 Autenticazione

### Flow

1. **Signup/Login:** Supabase Auth
2. **JWT Token:** Salvato in cookie (httpOnly, secure)
3. **API Protection:** `apiWrapper` middleware verifica token
4. **Session:** Gestita da Supabase SSR

### File Chiave

- `lib/supabase/client.ts` - Client Supabase
- `lib/supabase/server.ts` - Server Supabase (SSR)
- `lib/api-wrapper.ts` - API wrapper con auth check

---

## 💳 Pagamenti (Stripe)

### Flow

1. **Checkout:** Utente clicca "Subscribe"
2. **Session:** API crea Stripe Checkout Session
3. **Redirect:** Utente va a Stripe Checkout
4. **Webhook:** Stripe invia evento a `/api/stripe/webhook`
5. **Update DB:** Webhook aggiorna subscription in Supabase

### File Chiave

- `lib/stripe/config.ts` - Configurazione piani
- `app/api/stripe/checkout/route.ts` - Crea checkout session
- `app/api/stripe/webhook/route.ts` - Gestisce webhook
- `lib/utils/subscription-check.ts` - Verifica subscription

### Piani

- **FREE:** Funzionalità base
- **STARTER:** €97/mese
- **PRO:** €497/mese
- **AGENCY:** Custom pricing

### One-time Packages

- **Agency Boost:** €997 (one-time)

---

## 🤖 AI Integration

### OpenAI GPT-4

**Uso:**
- Generazione contenuto listing
- Traduzione listing
- Generazione social posts
- Lead scoring
- Follow-up messages

**File Chiave:**
- `lib/ai/aria-brain.ts` - Aria AI Coach
- `lib/ai/generate-comprehensive.ts` - Generazione listing
- `app/api/generate-comprehensive/route.ts` - API endpoint

**Rate Limiting:**
- FREE: 10/ora
- PRO: 100/ora
- AGENCY: 500/ora

**Caching:**
- `lib/cache/ai-cache.ts` - Cache risultati AI

---

## 🌍 Internationalization (i18n)

### Lingue Supportate

- `it` - Italiano (default)
- `en` - English
- `es` - Español
- `fr` - Français
- `de` - Deutsch
- `ar` - العربية

### Implementazione

- **Detection:** Browser locale detection
- **Storage:** Cookie `NEXT_LOCALE`
- **Context:** `lib/i18n/context.tsx`
- **Translations:** `lib/i18n/config.ts`

### File Chiave

- `lib/i18n/config.ts` - Configurazione e traduzioni
- `lib/i18n/browser-locale.ts` - Browser locale detection
- `components/aria-coach.tsx` - Aria con i18n

---

## 📊 Database Schema (Supabase)

### Tabelle Principali

#### `profiles`
- `id` (UUID, PK)
- `user_id` (UUID, FK to auth.users)
- `name` (text)
- `company` (text)
- `subscription_plan` (text)
- `subscription_status` (text)
- `created_at` (timestamp)

#### `subscriptions`
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `stripe_subscription_id` (text)
- `plan` (text)
- `status` (text)
- `current_period_end` (timestamp)

#### `listings`
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `address` (text)
- `price` (numeric)
- `property_type` (text)
- `transaction_type` (text)
- `content` (jsonb) - Generated content
- `created_at` (timestamp)

#### `leads`
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `name` (text)
- `email` (text)
- `phone` (text)
- `status` (text)
- `score` (integer)
- `created_at` (timestamp)

---

## 🔒 Sicurezza

### Implementazioni

1. **Input Validation:**
   - Zod schemas per tutti gli input
   - `lib/utils/validation.ts` - Sanitization

2. **SQL Injection:**
   - Supabase query builder (sicuro)
   - Drizzle ORM (type-safe)

3. **XSS:**
   - React default escaping
   - Sanitization per user-generated content

4. **CSRF:**
   - SameSite cookies
   - CSRF tokens (se necessario)

5. **Rate Limiting:**
   - `lib/utils/rate-limit.ts` - User + IP based

6. **Security Headers:**
   - `next.config.mjs` - HSTS, XSS Protection, ecc.

---

## 📈 Monitoring & Logging

### Sentry

- **Error Tracking:** Client + Server
- **Performance:** Transaction monitoring
- **Session Replay:** Error sessions

**File:**
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `lib/monitoring/sentry.ts`

### Logging

- **Secure Logger:** `lib/utils/safe-logger.ts`
- **No sensitive data:** Password, tokens, ecc. non loggati

### Analytics

- **Web Vitals:** `/api/analytics/web-vitals`
- **Event Tracking:** `/api/analytics/track`
- **Component:** `components/performance-monitor.tsx`

---

## 🚀 Deployment

### Replit

- **Platform:** Replit
- **Build:** `npm run build`
- **Start:** `npm start`
- **Environment:** `.env.local`

### Vercel (Alternativa)

- **Platform:** Vercel
- **Auto-deploy:** GitHub integration
- **Environment:** Vercel dashboard

---

## 🧪 Testing

### Unit Tests

- **Framework:** Jest
- **Location:** `__tests__/`
- **Coverage:** Critical paths (Stripe, Auth, API)

### E2E Tests

- **Framework:** Playwright
- **Location:** `e2e/`
- **Tests:** Auth, Checkout, Webhook, AI

### Performance Tests

- **Lighthouse:** Frontend performance
- **K6:** Load testing
- **API Benchmark:** Response times

---

## 🔄 CI/CD

### GitHub Actions

- **On Push:** Run tests
- **On PR:** Run tests + lint
- **On Merge:** Deploy (se configurato)

**File:** `.github/workflows/ci.yml`

---

## 📦 Dependencies Principali

### Core

- `next` - Framework
- `react` - UI library
- `@supabase/supabase-js` - Database & Auth
- `stripe` - Payments
- `openai` - AI

### UI

- `tailwindcss` - Styling
- `@radix-ui/*` - UI components
- `lucide-react` - Icons

### Utilities

- `zod` - Validation
- `date-fns` - Date handling
- `axios` - HTTP client

---

## 🎯 Best Practices

1. **Type Safety:** TypeScript strict mode
2. **Error Handling:** Global error boundaries
3. **Performance:** Lazy loading, code splitting
4. **Security:** Input validation, rate limiting
5. **Monitoring:** Sentry + Analytics
6. **Testing:** Unit + E2E tests
7. **Documentation:** API + Architecture docs

---

## 🔮 Future Improvements

1. **Caching:** Redis per sessioni e cache
2. **CDN:** Per assets statici
3. **Queue:** Per job asincroni (email, AI)
4. **Microservices:** Separare servizi pesanti
5. **GraphQL:** Se API diventa complessa

---

**Mantenuto da:** PropertyPilot AI Team  
**Ultimo aggiornamento:** ${new Date().toISOString()}
