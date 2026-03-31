# PropertyPilot AI

AI-powered SaaS for real estate agencies. Generate professional property listings, manage leads, automate prospecting — all powered by AI.

## Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Auth & Database:** Supabase (PostgreSQL + Auth + RLS)
- **Payments:** Stripe (subscriptions + one-time)
- **AI:** OpenAI (GPT-4o-mini)
- **Email:** Resend
- **Voice:** Bland AI
- **Hosting:** Vercel

## Setup

### 1. Database

Run `supabase/schema.sql` in your Supabase SQL Editor. This creates all 24 tables with RLS policies.

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys. Set the same vars on Vercel.

### 3. Stripe Webhook

Add a webhook endpoint in Stripe Dashboard:
- URL: `https://your-domain.vercel.app/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

### 4. Run

```bash
npm install
npm run dev
```

## Plans

| Plan | Price | Generations/month |
|------|-------|-------------------|
| Free | €0 | 5 |
| Starter | €197 | 50 |
| Pro | €497 | 200 |
| Agency | €897 | Unlimited |

## Project Structure

```
app/
  api/          # API routes (auth, stripe, AI, CRM)
  auth/         # Login, signup, password reset
  dashboard/    # All dashboard pages (35+)
  (marketing)/  # Landing page
  pricing/      # Pricing page
components/     # React components (82)
lib/
  supabase/     # Client, server, service, middleware
  stripe/       # Config, price mapping
  i18n/         # Translations (IT, EN, FR, ES, DE, AR)
  cache/        # AI response caching
  utils/        # Rate limiting, logging, helpers
supabase/
  schema.sql    # Complete database schema
```
