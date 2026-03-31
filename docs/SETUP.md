# 🚀 Setup & Deployment Guide - PropertyPilot AI

**Versione:** 1.0.0  
**Ultimo aggiornamento:** ${new Date().toISOString()}

---

## 📋 Prerequisiti

- Node.js 18+ (LTS consigliato)
- npm o yarn
- Account Supabase
- Account Stripe
- Account OpenAI (opzionale, per AI features)
- Account Sentry (opzionale, per monitoring)

---

## 🔧 Setup Locale

### 1. Clone Repository

```bash
git clone https://github.com/your-org/propilot-ai.git
cd propilot-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Crea file `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID=price_...

# OpenAI
OPENAI_API_KEY=sk-...

# Bland AI (opzionale)
BLAND_AI_API_KEY=...

# Sentry (opzionale)
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Database Setup

#### Crea Tabelle in Supabase

Esegui questo SQL in Supabase SQL Editor:

```sql
-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  company TEXT,
  subscription_plan TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT,
  status TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT,
  price NUMERIC,
  property_type TEXT,
  transaction_type TEXT,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'new',
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
```

#### Row Level Security (RLS)

Abilita RLS e crea policies:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Listings policies
CREATE POLICY "Users can view own listings"
  ON listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id);

-- Leads policies
CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own leads"
  ON leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
  ON leads FOR UPDATE
  USING (auth.uid() = user_id);
```

### 5. Run Development Server

```bash
npm run dev
```

Apri http://localhost:3000

---

## 🚀 Deployment

### Replit

1. **Import Repository:**
   - Vai a Replit
   - Crea nuovo Repl
   - Import da GitHub

2. **Environment Variables:**
   - Vai a Secrets
   - Aggiungi tutte le variabili da `.env.local`

3. **Run:**
   - Replit avvia automaticamente `npm run dev`
   - Per produzione: `npm run build && npm start`

### Vercel

1. **Connect Repository:**
   - Vai a Vercel Dashboard
   - Import repository GitHub

2. **Environment Variables:**
   - Aggiungi tutte le variabili in Vercel Dashboard

3. **Deploy:**
   - Vercel deploy automatico su push

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

---

## 🔐 Stripe Webhook Setup

### 1. Crea Webhook Endpoint

In Stripe Dashboard:
- Vai a Developers → Webhooks
- Aggiungi endpoint: `https://your-domain.com/api/stripe/webhook`

### 2. Seleziona Eventi

Seleziona questi eventi:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### 3. Copia Webhook Secret

Copia il webhook secret e aggiungilo a `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Test Webhook

Usa Stripe CLI per testare localmente:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 📊 Monitoring Setup

### Sentry

1. **Crea Progetto:**
   - Vai a sentry.io
   - Crea nuovo progetto (Next.js)

2. **DSN:**
   - Copia DSN
   - Aggiungi a `.env.local`:
     ```env
     NEXT_PUBLIC_SENTRY_DSN=https://...
     ```

3. **Auth Token:**
   - Crea auth token in Sentry
   - Aggiungi a `.env.local`:
     ```env
     SENTRY_AUTH_TOKEN=...
     SENTRY_ORG=your-org
     SENTRY_PROJECT=your-project
     ```

---

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
# Avvia server dev prima
npm run dev

# In altro terminale
npm run test:e2e
```

### Performance Tests

```bash
npm run perf:all
```

---

## 🔧 Troubleshooting

### Database Connection Issues

- Verifica `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verifica che RLS policies siano corrette

### Stripe Webhook Not Working

- Verifica `STRIPE_WEBHOOK_SECRET`
- Verifica che endpoint sia accessibile pubblicamente
- Usa Stripe CLI per testare localmente

### Build Errors

- Verifica che tutte le variabili d'ambiente siano settate
- Esegui `npm install` di nuovo
- Cancella `.next` e riprova

---

## 📝 Checklist Pre-Launch

- [ ] Tutte le variabili d'ambiente configurate
- [ ] Database setup completato
- [ ] RLS policies configurate
- [ ] Stripe webhook configurato e testato
- [ ] Sentry configurato (opzionale)
- [ ] Test unitari passano
- [ ] Test E2E passano
- [ ] Performance test passano
- [ ] Security audit eseguito
- [ ] Monitoring configurato

---

## 🆘 Support

Per problemi o domande:
- GitHub Issues: https://github.com/your-org/propilot-ai/issues
- Email: support@propilot.ai

---

**Ultimo aggiornamento:** ${new Date().toISOString()}
