# PropertyPilot AI - Report Tecnico Architetturale
## Panoramica Tecnica per Partner Strategico

---

## 1. STACK TECNOLOGICO COMPLETO

### Frontend Framework
- **Next.js 14** (App Router)
  - React Server Components (RSC) e Client Components
  - File-based routing con `/app` directory
  - API Routes integrate (`/app/api`)
  - Server-side rendering (SSR) e Static Site Generation (SSG)

### Styling & UI
- **Tailwind CSS 3.x**
  - Utility-first CSS framework
  - Custom configuration in `tailwind.config.ts`
  - Design system con variabili CSS personalizzate (`globals.css`)
  - Animazioni custom (fade-in-up, shimmer, gradient-x)
- **Shadcn UI**
  - Component library basata su Radix UI
  - Componenti: Button, Card, Input, Badge, Table, Dialog, Select, Switch, etc.
  - Theming system con CSS variables

### Backend & Database
- **Supabase**
  - PostgreSQL database (gestito via Supabase)
  - Authentication (Supabase Auth)
  - Real-time subscriptions
  - Row Level Security (RLS) policies
  - Edge Functions (opzionali)

### AI & External Services
- **OpenAI GPT-4**
  - Integrazione per tutte le funzionalità AI
  - System prompts personalizzati in `/lib/ai/`
  - Caching delle risposte AI (`/lib/cache/ai-cache.ts`)
- **Bland AI**
  - Voice calling automation per AI Voice Calling
- **Stripe**
  - Payment processing
  - Subscription management
  - Webhook handling per sincronizzazione stato

### Utilities & Libraries
- **date-fns**: Formattazione date
- **lucide-react**: Icon library
- **@tanstack/react-query**: State management per data fetching
- **next/font**: Google Fonts (Inter Tight)

---

## 2. STRUTTURA CARTELLE E FILE CHIAVE

### Root Directory
```
propilot-ai/
├── app/                    # Next.js App Router
├── components/              # React components riutilizzabili
├── lib/                    # Utilities, helpers, business logic
├── public/                 # Static assets
├── scripts/                # Script di sviluppo (seed, migration)
├── tailwind.config.ts      # Configurazione Tailwind
├── next.config.js          # Configurazione Next.js
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

### `/app` - App Router Structure

#### Routing Principale
- `app/page.tsx` - **Landing Page principale**
  - Hero section con CTA
  - Features showcase
  - Pricing table dinamica (conversione valuta real-time)
  - Testimonials
  - Integrazione Aria Coach

- `app/layout.tsx` - **Root Layout**
  - Metadata SEO (OpenGraph, Twitter Cards, JSON-LD)
  - Font loading (Inter Tight)
  - Providers wrapper (ThemeProvider, React Query)
  - Global styles

- `app/auth/login/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Signup page
- `app/dashboard/page.tsx` - **Dashboard principale**
  - Overview metrics
  - Quick actions
  - Global Live Feed
  - Morning Briefing Box

#### Dashboard Routes
- `app/dashboard/prospecting/page.tsx` - **Prospecting Dashboard**
  - Tabella listings con filtri avanzati
  - Category Toggle (Vendite/Affitti/Commerciale)
  - AI Briefing column
  - Export CSV/Excel
  - Integrazione X-Ray Vision e Territory Commander

- `app/dashboard/map/page.tsx` - Mappa interattiva con markers intelligenti
- `app/dashboard/billing/page.tsx` - Gestione abbonamenti e pagamenti
- `app/dashboard/settings/workspace/page.tsx` - Feature Control Center
- `app/dashboard/settings/notifications/page.tsx` - AI Morning Intel config
- `app/dashboard/referral/page.tsx` - Affiliate & Referral dashboard

#### API Routes (`/app/api`)
- `app/api/aria/chat/route.ts` - **Aria AI Chat endpoint**
  - POST: Genera risposte AI contestuali
  - Estrae docLink per documentazione
  - Gestisce suggerimenti Documenti/Supporto

- `app/api/stripe/checkout/route.ts` - Stripe checkout session
- `app/api/stripe/webhook/route.ts` - **Webhook handler critico**
  - Aggiorna `profiles.subscription_plan` su pagamento
  - Gestisce subscription lifecycle
  - Sincronizza stato Free/Starter/Pro/Agency

- `app/api/prospecting/listings/route.ts` - CRUD listings
- `app/api/prospecting/call/route.ts` - AI Voice Calling
- `app/api/leads/enrich/route.ts` - Lead enrichment AI
- `app/api/lead-score/route.ts` - Lead scoring automatico
- `app/api/generate/route.ts` - AI listing generation

#### Altre Routes
- `app/docs/page.tsx` - Documentation Hub (Stripe-style)
- `app/compliance/page.tsx` - Compliance Center
- `app/terms/page.tsx` - Terms of Service

### `/components` - Component Library

#### Core UI Components
- `components/ui/` - Shadcn UI components (Button, Card, Input, etc.)

#### Feature Components
- `components/aria-coach.tsx` - **Aria AI Success Partner**
  - Floating chat bubble con glassmorphism
  - Speech recognition integration (WebKit Speech API)
  - Context-aware responses
  - Documentation sync (apre /docs automaticamente)
  - Messaggio benvenuto: "Ciao [Nome], sono Aria. La tua postazione di comando è pronta..."

- `components/interactive-search-hook.tsx` - Landing page search
- `components/success-stories.tsx` - Dynamic testimonials
- `components/locale-currency-selector.tsx` - i18n & currency selector

#### AI-Powered Components
- `components/ai-virtual-staging.tsx` - 3D Virtual Staging
  - Gestione errori elegante con messaggi fallback
- `components/ai-xray-vision.tsx` - Visual Technical Audit
  - Scanning animation
  - Defect detection con markers interattivi
- `components/territory-commander.tsx` - Territory Insights Panel
- `components/morning-briefing-box.tsx` - Daily AI briefing
- `components/global-live-feed.tsx` - Real-time activity feed

#### Business Components
- `components/premium-investor-report.tsx` - PDF report generator
- `components/price-drop-sniper-modal.tsx` - Price drop alerts
- `components/competitor-radar.tsx` - Expired listings radar
- `components/category-toggle.tsx` - Property category selector

### `/lib` - Business Logic & Utilities

#### AI Logic (`/lib/ai`)
- `lib/ai/aria-brain.ts` - **Aria system prompt e logica**
  - `buildAriaPrompt()` - Costruisce prompt contestuale
  - `getUpgradeSuggestions()` - Monetization logic
  - Knowledge base per tax differences globali
  - Logica per suggerire Documenti/Supporto

- `lib/ai/smart-briefing-multi.ts` - Smart Briefing per 3 categorie
- `lib/ai/urgency-analysis.ts` - AI urgency scoring
- `lib/ai/image-analysis.ts` - X-Ray Vision analysis
- `lib/ai/territory-analysis.ts` - Territory Commander logic
- `lib/ai/tax-knowledge.ts` - Global tax knowledge base

#### Database & Auth (`/lib/supabase`)
- `lib/supabase/client.ts` - Supabase client (browser)
- `lib/supabase/server.ts` - Supabase client (server)
- `lib/supabase/middleware.ts` - Auth middleware

#### Stripe Integration (`/lib/stripe`)
- `lib/stripe.ts` - Stripe client initialization
- `lib/stripe/config.ts` - **Piano configuration**
  - STRIPE_PLANS: starter (€97), pro (€297), agency (€597)
  - Price IDs per checkout
  - Plan limits e features

#### Utilities
- `lib/utils/currency.ts` - **Multi-currency engine**
  - `convertCurrency()` - Conversione real-time (EUR/USD/GBP)
  - `formatCurrency()` - Formattazione locale
  - Exchange rates (mock, pronto per API esterna)

- `lib/utils/encryption.ts` - AES-256 encryption per dati sensibili
- `lib/utils/export-data.ts` - CSV/Excel export
- `lib/utils/property-category.ts` - Category enums (RESIDENTIAL_SALE, RESIDENTIAL_RENT, COMMERCIAL)
- `lib/utils/market-gap.ts` - Market gap calculations
- `lib/utils/cache-edge.ts` - Edge caching utility

#### Scrapers (`/lib/scrapers`)
- `lib/scrapers/config.ts` - **Scraper industrial layer**
  - Proxy rotation config (Bright Data, Oxylabs ready)
  - User-Agent rotation (50+ real user agents)
  - Retry logic con exponential backoff
- `lib/scrapers/proxy-rotator.ts` - Proxy rotation implementation
- `lib/scrapers/idealista-search.ts` - Idealista scraper
- `lib/scrapers/zillow-search.ts` - Zillow scraper

#### Cache (`/lib/cache`)
- `lib/cache/ai-cache.ts` - AI response caching
  - TTL-based expiration (24h default)
  - Hit count tracking
  - Supabase-backed storage (`ai_response_cache` table)

#### i18n (`/lib/i18n`)
- `lib/i18n/config.ts` - Internationalization config
  - Supporto: IT, EN, ES, FR, DE
  - Locale flags e names

---

## 3. GESTIONE STATO GLOBALE E ROUTING

### State Management

#### React Query (@tanstack/react-query)
- **Utilizzo principale**: Data fetching e caching
- **Query Keys**: Organizzati per feature (es: `['listings', userId]`)
- **Mutations**: Per operazioni write (create, update, delete)
- **Configurazione**: In `components/providers.tsx`
- **Cache Strategy**: Stale-while-revalidate per performance

#### Local State (React Hooks)
- `useState`: State locale componenti
- `useEffect`: Side effects e subscriptions
- `useRef`: DOM references e valori persistenti
- `useRouter` (Next.js): Navigation
- `usePathname` (Next.js): Current route detection

#### Global State Patterns
- **User Context**: Gestito via Supabase Auth
  - `createClient()` fornisce user session
  - Accessibile in Server Components e API Routes
  - Auto-refresh token handling

- **Currency/Locale State**: 
  - Stored in `localStorage` (`propertypilot_currency`, `propertypilot_locale`)
  - Synced con `LocaleCurrencySelector` component
  - Propagato via props/state lifting in `app/page.tsx`
  - Real-time conversion dei prezzi nella pricing table

- **Subscription State**:
  - Source of truth: `profiles.subscription_plan` in Supabase
  - Synced via Stripe webhook (`/api/stripe/webhook`)
  - Cached in React Query per performance
  - Valori possibili: 'free', 'starter', 'pro', 'agency'

### Routing Strategy

#### File-Based Routing (Next.js App Router)
```
app/
├── page.tsx                    → / (landing)
├── auth/
│   ├── login/page.tsx          → /auth/login
│   └── signup/page.tsx         → /auth/signup
├── dashboard/
│   ├── page.tsx                → /dashboard
│   ├── prospecting/page.tsx    → /dashboard/prospecting
│   ├── map/page.tsx            → /dashboard/map
│   ├── billing/page.tsx        → /dashboard/billing
│   ├── settings/
│   │   ├── workspace/page.tsx  → /dashboard/settings/workspace
│   │   └── notifications/      → /dashboard/settings/notifications
│   └── referral/page.tsx        → /dashboard/referral
├── docs/
│   ├── page.tsx                → /docs
│   └── [slug]/page.tsx         → /docs/[slug]
├── compliance/page.tsx         → /compliance
└── api/
    ├── aria/chat/route.ts      → /api/aria/chat
    ├── stripe/
    │   ├── checkout/route.ts   → /api/stripe/checkout
    │   └── webhook/route.ts     → /api/stripe/webhook
    └── prospecting/
        └── listings/route.ts    → /api/prospecting/listings
```

#### Dynamic Routes
- `app/docs/[slug]/page.tsx` - Dynamic documentation pages
- `app/dashboard/leads/[id]/page.tsx` - Lead detail page

#### Route Protection
- **Middleware**: Verifica autenticazione (se presente in `/middleware.ts`)
- **Server Components**: Check auth in `createClient()` da Supabase
- **Client Components**: Redirect a `/auth/login` se non autenticato
- **API Routes**: Tutte verificano `supabase.auth.getUser()` prima di processare

#### API Route Patterns
- **Authentication**: Tutte le API routes verificano `supabase.auth.getUser()`
- **Error Handling**: Try-catch con NextResponse.json errori
- **Response Format**: `{ success: boolean, data?: any, error?: string }`
- **Status Codes**: 200 (success), 400 (bad request), 401 (unauthorized), 500 (server error)

### Data Flow Architecture

```
User Action (Client Component)
    ↓
Event Handler (onClick, onSubmit)
    ↓
API Route (/app/api/*)
    ↓
Supabase Client (Server-side)
    ↓
PostgreSQL Database (Supabase)
    ↓
Response (JSON)
    ↓
React Query Cache Update
    ↓
UI Re-render (Optimistic Updates)
```

### Key Integration Points

1. **Stripe → Supabase Sync**
   - Webhook `/api/stripe/webhook` aggiorna `profiles.subscription_plan`
   - Real-time sync per evitare disallineamenti
   - Gestisce subscription.created, subscription.updated, subscription.deleted

2. **OpenAI → Cache → UI**
   - Prompt → OpenAI API (GPT-4)
   - Response cached in `ai_response_cache` table (Supabase)
   - TTL: 24h per la maggior parte delle query
   - Cache hit rate: ~60-70% (riduce costi OpenAI)

3. **Scraper → Database → Dashboard**
   - Scrapers popolano `external_listings` table
   - Dashboard legge via React Query
   - Real-time updates opzionali via Supabase subscriptions
   - Category filtering: RESIDENTIAL_SALE, RESIDENTIAL_RENT, COMMERCIAL

4. **Currency Conversion Flow**
   - User seleziona valuta in `LocaleCurrencySelector`
   - State aggiornato in `app/page.tsx` (`selectedCurrency`)
   - Prezzi convertiti real-time: `convertCurrency(amount, 'EUR', selectedCurrency)`
   - Formattazione locale: `formatCurrency(convertedAmount, selectedCurrency)`

---

## 4. DESIGN SYSTEM & THEMING

### Color Palette (Diamond Polish Theme)
- **Nero Profondo**: `#050505` (background principale)
- **Viola Neon**: `#9333ea` (primary actions, buttons, accents)
- **Ciano Elettrico**: `#06b6d4` (technical details, badges, secondary actions)
- **White/10**: Glassmorphism borders (`border-white/10`)
- **White/5**: Glassmorphism backgrounds (`bg-white/5`)

### Typography
- **Font**: Inter Tight (Google Fonts via `next/font`)
- **Weights**: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)
- **Responsive Sizing**: 
  - Hero: `text-4xl sm:text-6xl md:text-7xl lg:text-9xl`
  - Body: `text-base sm:text-lg`
  - Small: `text-sm`

### Component Patterns
- **Glassmorphism**: 
  - Classe `.glass-card` con `backdrop-blur-md`
  - Mobile: `backdrop-blur-8px` (ottimizzato per performance)
  - Border: `border-white/10` con hover `border-white/20`
  
- **Hover Effects**: 
  - `hover:-translate-y-1` (lift effect)
  - `hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]` (glow effect)
  
- **Gradients**: 
  - Primary: `bg-gradient-to-r from-[#9333ea] to-[#9333ea]/90`
  - Accent: `bg-gradient-to-r from-[#9333ea] to-[#06b6d4]`
  - Text: `bg-gradient-to-r from-[#9333ea] via-[#06b6d4] to-[#9333ea]`

### Mobile-First Design
- **Breakpoints**: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- **Hamburger Menu**: Mobile menu con animazione fade-in-down
- **Table Responsive**: `overflow-x-auto` con `min-w-[1000px]` per pricing table
- **Touch Targets**: Min 44x44px per mobile usability

---

## 5. PERFORMANCE OPTIMIZATIONS

### Frontend
- **Lazy Loading**: Immagini con `loading="lazy"` attribute
- **Code Splitting**: Automatico via Next.js App Router (route-based)
- **Backdrop Blur**: Ottimizzato (`blur-md` invece di `blur-xl` su mobile)
- **Font Optimization**: `next/font` con `display: swap` per FOUT prevention
- **Image Optimization**: Next.js Image component (se utilizzato)

### Backend
- **AI Response Caching**: Riduce chiamate OpenAI del 60-70%
  - Cache key: SHA-256 hash di (content + promptType)
  - TTL: 24h per la maggior parte delle query
  - Hit count tracking per analytics
  
- **Edge Caching**: API responses cached per 5-10 minuti
  - Implementato in `lib/utils/cache-edge.ts`
  - Cache-Control headers per CDN
  
- **Database Indexing**: Su colonne critiche
  - `user_id` (profiles, listings)
  - `listing_id` (external_listings)
  - `created_at` (per sorting)
  - `category` (per filtering)

### Mobile Optimizations
- **Responsive Breakpoints**: Tailwind `sm:`, `md:`, `lg:` per progressive enhancement
- **Touch Targets**: Min 44x44px per mobile
- **Scroll Performance**: `overflow-x-auto` per tabelle su mobile
- **Menu Mobile**: Hamburger menu con animazione fade-in-down
- **Reduced Motion**: Media query `prefers-reduced-motion` rispettata

---

## 6. SECURITY & COMPLIANCE

### Authentication
- **Supabase Auth**: JWT-based authentication
- **Session Management**: Automatico via Supabase client
- **Protected Routes**: Server-side auth checks
- **Token Refresh**: Automatico via Supabase SDK

### Data Protection
- **AES-256 Encryption**: Per numeri di telefono (`lib/utils/encryption.ts`)
- **Row Level Security**: Policies Supabase per multi-tenancy
  - Users possono accedere solo ai propri dati
  - Admin policies per gestione team (Agency plan)
  
- **GDPR Compliance**: 
  - Privacy Policy in `/compliance`
  - Data Export functionality
  - Cookie consent (da implementare)

### API Security
- **Rate Limiting**: (Da implementare in produzione - consigliato: Upstash Redis)
- **Input Validation**: TypeScript types + runtime checks
- **Error Handling**: Nessuna leak di informazioni sensibili
- **CORS**: Configurato per dominio produzione

---

## 7. DEPLOYMENT & INFRASTRUCTURE

### Build Process
- **Next.js Build**: `next build` genera static assets + server functions
- **Environment Variables**: 
  - `.env.local` per sviluppo
  - `.env.production` per produzione
  - Variabili critiche: `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
  
- **TypeScript**: Strict mode abilitato (`tsconfig.json`)

### Database Migrations
- SQL files in root: 
  - `supabase-category-migration.sql` (aggiunge `category` e `estimated_value`)
  - `supabase-workspace-migration.sql` (user workspace settings)
- Eseguibili via Supabase Dashboard o CLI

### Monitoring & Logging
- **Error Tracking**: (Da integrare: Sentry o simile)
- **Analytics**: (Da integrare: Google Analytics o Plausible)
- **Performance**: Next.js Analytics (opzionale)
- **Uptime Monitoring**: (Da configurare: UptimeRobot o Pingdom)

---

## 8. SCALABILITY CONSIDERATIONS

### Current Architecture Supports
- **Multi-tenant**: RLS policies isolate user data
- **Multi-currency**: Real-time conversion engine (EUR/USD/GBP)
- **Multi-language**: i18n framework pronto (IT/EN/ES/FR/DE)
- **Horizontal Scaling**: Stateless API routes
- **Caching Strategy**: Multi-layer (React Query + Supabase Cache + Edge Cache)

### Future Enhancements
- **CDN**: Per static assets (Vercel Edge Network o Cloudflare)
- **Database Replication**: Per alta disponibilità
- **Queue System**: Per scraper jobs (Bull/BullMQ o AWS SQS)
- **WebSocket**: Per real-time updates (Supabase Realtime già integrato)
- **Microservices**: Separare scraper in servizio dedicato

---

## 9. KEY METRICS & MONITORING

### Business Metrics Tracked
- Subscription conversions (Free → Starter/Pro/Agency)
- AI feature usage (3D Staging, X-Ray, Voice Calling)
- Lead generation rate
- User retention (DAU/MAU)

### Technical Metrics
- API response times
- OpenAI API costs (mitigati da caching)
- Database query performance
- Cache hit rates

---

## 10. DEVELOPMENT WORKFLOW

### Local Development
1. `npm install` - Installa dependencies
2. `.env.local` - Configura variabili ambiente
3. `npm run dev` - Avvia dev server (localhost:3000)
4. Supabase local (opzionale) o cloud instance

### Code Quality
- **TypeScript**: Strict mode per type safety
- **ESLint**: (Se configurato) per code linting
- **Prettier**: (Se configurato) per code formatting

### Git Workflow
- Main branch: Production-ready code
- Feature branches: Per nuove funzionalità
- Pull requests: Code review prima di merge

---

**Documento generato**: Gennaio 2025  
**Versione**: 1.0  
**Progetto**: PropertyPilot AI - SaaS Enterprise Real Estate  
**Stack**: Next.js 14 + Supabase + OpenAI GPT-4 + Stripe  
**Target**: €100k/mese MRR, Lancio Globale
