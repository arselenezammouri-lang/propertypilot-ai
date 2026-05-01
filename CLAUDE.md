# CLAUDE.md — PropertyPilot AI Context File

## Project
PropertyPilot AI — AI Operating System for European Real Estate Agencies
Live: https://propertypilot-ai.vercel.app
Repo: github.com/arselenezammouri-lang/propertypilot-ai

## Stack
- Next.js 14 App Router, TypeScript 5.6 strict, Tailwind CSS
- Supabase (auth + Postgres + RLS), project: mbykkvyqhfqkcxplzhnz
- Stripe (subscriptions), account: acct_1SBxaeA1is7KNmae
- OpenAI / Claude (AI generation)
- Resend (email), Bland AI (voice)
- Vercel (hosting, auto-deploy from main)
- shadcn/ui + Radix (components), Framer Motion (animations)

## Architecture
```
/app            — Pages + API routes (69+ routes)
/app/api        — REST endpoints (60+)
/app/dashboard  — 35+ dashboard pages
/components     — 90+ React components
/lib            — Core modules (ai, portals, stripe, supabase, i18n, cache)
/lib/portals    — Portal adapter system (types, rules, adapters/)
/types          — TypeScript types
```

## Stripe Plans (DO NOT CHANGE PRICES)
- Free €0 — 5 properties, 10 AI descriptions/mo
- Starter €197/mo — price_1StsWIA1is7KNmaevO6UdO0Z
- Pro €497/mo — price_1StsZEA1is7KNmae5XkGgEr4
- Agency €897/mo — price_1StsbAA1is7KNmae4taYsNtk
- Agency Boost €2,497 (one-time) — price_1SvkovA1is7KNmaebfhoJ3lK

## ⚠️ FOUNDER ACTION REQUIRED — Before accepting real payments:
1. Set STRIPE_SECRET_KEY (live key, starts with sk_live_) in Vercel env vars
2. Set STRIPE_WEBHOOK_SECRET (live webhook secret, starts with whsec_) in Vercel env vars
3. Create a Stripe webhook endpoint pointing to:
   https://propertypilot-ai.vercel.app/api/stripe/webhook
   Events to listen for:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.paid
   - invoice.payment_failed
4. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (live key, starts with pk_live_)
5. Optionally enable Stripe Tax for automatic EU VAT collection

## Portal Adapters (lib/portals/adapters/)
- EstateSync: ImmoScout24 + Immowelt (Germany) — OAuth REST API
- Immobiliare.it: XML feed at /api/feeds/immobiliare/[userId].xml
- Idealista: Spain + Italy + Portugal — OAuth REST API
- Portal rules for 11 EU portals in lib/portals/rules.ts

## Design System
- Dark theme default (v23+)
- Primary: indigo-violet gradient (hsl 245)
- Glassmorphism: pp-glass-card, backdrop-blur-xl
- Buttons: btn-primary-gradient, btn-glass
- Animations: Framer Motion fadeUp, stagger, whileInView
- Typography: Geist Sans/Mono, pp-heading-xl/lg/md, text-gradient

## Coding Standards
- NEVER use `any` or `@ts-ignore`
- Always run `npx tsc --noEmit` before pushing
- Semantic color tokens only (text-foreground, text-muted-foreground, NOT text-black/text-white)
- Zod validation on all API inputs
- Conventional commits (v1, v2, ... vN: description)
