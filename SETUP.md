# PropertyCopy Pro - Setup Guide

This is the complete setup guide for the migrated Next.js + Supabase + Stripe application.

## Prerequisites

1. **Node.js 18+** installed
2. **Supabase Account**: Create account at [supabase.com](https://supabase.com)
3. **Stripe Account**: Create account at [stripe.com](https://stripe.com)
4. **OpenAI API Key**: Get from [platform.openai.com](https://platform.openai.com)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose a name, database password, and region
4. Wait for project to be created

### 1.2 Create Database Tables

Go to SQL Editor in Supabase Dashboard and run this SQL:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  company text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Subscriptions table
create table public.subscriptions (
  id text primary key,
  user_id uuid references public.profiles(id) not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  price_id text,
  status text not null default 'free',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Saved listings table
create table public.saved_listings (
  id serial primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  property_data jsonb not null,
  generated_content jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.saved_listings enable row level security;

create policy "Users can view own listings"
  on public.saved_listings for select
  using (auth.uid() = user_id);

create policy "Users can insert own listings"
  on public.saved_listings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own listings"
  on public.saved_listings for update
  using (auth.uid() = user_id);

create policy "Users can delete own listings"
  on public.saved_listings for delete
  using (auth.uid() = user_id);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  
  insert into public.subscriptions (id, user_id, status)
  values (gen_random_uuid()::text, new.id, 'free');
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signups
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 1.2b Production Updates (REQUIRED for Production)

⚠️ **CRITICAL**: Run this migration SQL BEFORE activating Stripe LIVE mode.

Go to SQL Editor in Supabase Dashboard and run the `supabase-migrations.sql` file content:

**What this migration adds:**
- **Rate limiting**: `generation_logs` table to track AI generations per user/IP
- **Generation tracking**: `generations_count` field to subscriptions table
- **Performance**: Indexes for fast rate limit lookups
- **Cleanup function**: Remove logs older than 24 hours

After running this migration, verify:
1. `generation_logs` table exists
2. `subscriptions.generations_count` column exists (default: 0)
3. Both indexes are created

### 1.3 Get Supabase Credentials

1. Go to Project Settings → API
2. Copy the **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
3. Copy the **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
4. Copy the **service_role** key (SUPABASE_SERVICE_ROLE_KEY)
   - ⚠️ **Important**: This key bypasses Row Level Security and should never be exposed to the client
   - Required for webhook processing to securely update subscription data

## Step 2: Stripe Setup

### 2.1 Create Products and Prices

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Create four products:

**Starter Plan:**
- Name: PropertyPilot AI - Starter
- Price: €97.00 EUR
- Billing period: Monthly
- Copy the Price ID → `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`

**Pro Plan (Recommended):**
- Name: PropertyPilot AI - Pro
- Price: €297.00 EUR
- Billing period: Monthly
- Copy the Price ID → `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`

**Agency Plan:**
- Name: PropertyPilot AI - Agency
- Price: €497.00 EUR
- Billing period: Monthly
- Copy the Price ID → `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID`

**Agency Boost (One-Time):**
- Name: PropertyPilot AI - Agency Boost
- Price: €2,497.00 EUR
- Payment type: One-time
- Copy the Price ID → `NEXT_PUBLIC_STRIPE_BOOST_PRICE_ID`

### 2.2 Get Stripe API Keys

1. Go to [Developers → API Keys](https://dashboard.stripe.com/test/apikeys)
2. Copy **Publishable key** (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
3. Copy **Secret key** (STRIPE_SECRET_KEY)

### 2.3 Set Up Webhook (After Deployment)

1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the signing secret (STRIPE_WEBHOOK_SECRET)

## Step 3: Environment Variables

### 3.1 Local Development

1. Copy `.env.local.example` to `.env.local`
2. Fill in all the values from Steps 1 and 2
3. Add your OpenAI API key

### 3.2 Replit Secrets

In Replit, go to Tools → Secrets and add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Required for webhook processing)
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` (€97/mese)
- `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` (€297/mese)
- `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID` (€497/mese)
- `NEXT_PUBLIC_STRIPE_BOOST_PRICE_ID` (€2.497 una tantum)
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Step 6: Deploy to Vercel

### 6.1 Connect to Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 6.2 Add Environment Variables
Add all variables from `.env.local` to Vercel:
- Settings → Environment Variables
- Add each variable

### 6.3 Deploy
- Vercel will automatically deploy
- Get your production URL

### 6.4 Update Stripe Webhook
- Update webhook endpoint URL to your Vercel domain
- Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables

## Testing

### Test Signup Flow
1. Go to `/auth/signup`
2. Create an account
3. Check Supabase Dashboard → Authentication to see new user
4. Check Database → profiles table

### Test Stripe Checkout
1. Login to your account
2. Go to Dashboard
3. Click "Upgrade to Pro"
4. Use test card: `4242 4242 4242 4242`
5. Check Stripe Dashboard for subscription

## Troubleshooting

### Supabase Connection Issues
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Check if tables were created in SQL Editor
- Verify RLS policies are enabled

### Stripe Issues
- Ensure you're using test mode keys for development
- Verify webhook endpoint URL is correct
- Check Stripe Dashboard → Developers → Webhooks for delivery attempts

### Build Errors
- Run `npm run build` locally to catch errors before deploying
- Check Next.js version compatibility
- Verify all environment variables are set

## Next Steps

After setup:
1. Implement AI content generation (already have OpenAI integration)
2. Create dashboard pages for content generation
3. Add saved listings management
4. Customize pricing tiers and limits
5. Add email templates for transactional emails

## Support

For issues:
- Check [Next.js Docs](https://nextjs.org/docs)
- Check [Supabase Docs](https://supabase.com/docs)
- Check [Stripe Docs](https://stripe.com/docs)
