# PropertyPilot AI

**The AI Operating System for European Real Estate Agencies**

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://propertypilot-ai.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> Generate AI listings in 8 seconds. Score leads automatically. Call prospects with Voice AI.
> Check compliance across 6 EU countries. All from one dashboard.

🌐 **Live:** [propertypilot-ai.vercel.app](https://propertypilot-ai.vercel.app)  
📧 **Contact:** support@propertypilotai.com  
🇮🇹 **Founded:** Milano, Italy

---

## Why PropertyPilot AI?

| Feature | Zoho CRM | HubSpot | Pipedrive | PropertyPilot AI |
|---------|----------|---------|-----------|-----------------|
| AI Listing Generation | ❌ | ❌ | ❌ | ✅ 3 styles × 6 langs |
| Voice Agent AI | ❌ | ❌ | ❌ | ✅ Bland AI + ElevenLabs |
| EU Portal Publishing | ❌ | ❌ | ❌ | ✅ 16 portals |
| GDPR Native | ⚠️ Add-on | ⚠️ Add-on | ⚠️ Add-on | ✅ Built-in |
| Compliance Shield | ❌ | ❌ | ❌ | ✅ 6 countries, 35+ rules |
| Real Estate CMA | ❌ | ❌ | ❌ | ✅ AI Valuation + PDF |
| Virtual Staging | ❌ | ❌ | ❌ | ✅ Replicate AI |
| WhatsApp AI Agent | ❌ | ⚠️ Add-on | ❌ | ✅ Meta Cloud API |
| Price (per month) | €14-65 | €45-1200 | €14-99 | **€0-897** |

**Built specifically for European real estate.** Not a generic CRM with a real estate label.

---

## Features

### 🏠 AI Listing Engine
Generate portal-ready property descriptions in 8 seconds. Three writing styles (Standard Pro, Luxury, Investment). Six languages. Optimized for Idealista, Immobiliare.it, Rightmove, SeLoger.

### 📊 CRM & Lead Management
Full pipeline with Kanban boards, lead scoring (0-100), automated follow-ups, and Speed-to-Lead automation. WhatsApp, email, and SMS from one dashboard.

### 🎨 Visual AI Suite
Virtual staging, photo enhancement (HDR, sky replacement, declutter), and AI floor plans powered by Replicate.

### 📞 Voice Agent AI
Automated outbound calls with Bland AI. Multilingual voice (ElevenLabs). Handles objections, books viewings, syncs to CRM.

### 💬 WhatsApp AI
Incoming message classification, AI auto-replies, carousel templates, viewing reminders. Meta Cloud API integration.

### ✅ Compliance Shield
35+ country-specific rules across Italy, France, Spain, Germany, UK, and Portugal. APE, DPE, EPC, GEG checks. Auto-fix suggestions.

### 📋 Document AI
Upload contracts, energy certificates, or mandates. GPT-4o Vision extracts 48 structured fields. Side-by-side verification.

### 🌍 16 Portal Connections
Publish to Idealista, Immobiliare.it, Casa.it, Rightmove, SeLoger, ImmoScout24, and 10 more. Country-specific adapters.

### 📈 Market Intelligence
CMA reports with comparable analysis, price trends (Recharts), confidence scoring. Automated valuation model (AVM).

### 🔮 Predictive Seller Leads
17-feature heuristic model identifies likely-to-list properties. ML-ready feature vectors.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript 5.6 |
| UI | shadcn/ui, Radix UI, Tailwind CSS, Framer Motion |
| Database | Supabase (PostgreSQL + RLS + Auth) |
| Payments | Stripe (Subscriptions + EU Tax + Webhooks) |
| AI | OpenAI (GPT-4o), Replicate (Visual AI) |
| Email | Resend (Transactional + Campaigns) |
| Voice | Bland AI (Calls), ElevenLabs (Cloning), Twilio (Numbers) |
| Messaging | Meta WhatsApp Cloud API |
| Hosting | Vercel (Auto-deploy, Edge, Crons) |
| Monitoring | Sentry (Errors + Performance) |

---

## Architecture

```
propertypilot-ai/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Landing page
│   ├── api/                # 100+ REST API routes
│   ├── auth/               # Login, Signup, Callback
│   ├── blog/               # Blog (MDX-ready)
│   ├── dashboard/          # 35+ dashboard pages
│   ├── [locale]/           # Country SEO pages (6 langs)
│   └── tools/              # Free public tools (SEO magnets)
├── components/             # 90+ React components
│   └── ui/                 # shadcn/ui primitives
├── lib/                    # Core business logic
│   ├── ai/                 # OpenAI clients, scoring, briefings
│   ├── compliance/         # 6-country rule engines
│   ├── i18n/               # 6 EU languages
│   ├── plans/              # Feature gating & usage limits
│   ├── portals/            # 16 portal adapters
│   ├── visual-ai/          # Replicate staging & enhancement
│   ├── voice/              # Bland AI, ElevenLabs, Twilio
│   └── whatsapp/           # Meta API, intent classification
├── supabase/               # SQL migrations (15 files)
├── types/                  # TypeScript type definitions
└── apps/mobile/            # React Native (Expo)
```

---

## Quick Start

```bash
# Clone
git clone https://github.com/arselenezammouri-lang/propertypilot-ai.git
cd propertypilot-ai

# Install
npm install

# Environment
cp .env.example .env.local
# Fill in required env vars (see Environment Variables section)

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### Required (Core)

| Variable | Description | Where to Get |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | [supabase.com](https://supabase.com) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API |
| `OPENAI_API_KEY` | OpenAI API key | [platform.openai.com](https://platform.openai.com) |
| `STRIPE_SECRET_KEY` | Stripe secret key | [stripe.com](https://stripe.com) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Stripe → Developers → Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Stripe Dashboard |

### Required (Features)

| Variable | Description | Where to Get |
|----------|-------------|-------------|
| `RESEND_API_KEY` | Email service | [resend.com](https://resend.com) |
| `REPLICATE_API_TOKEN` | Visual AI | [replicate.com](https://replicate.com) |
| `BLAND_AI_API_KEY` | Voice Agent | [bland.ai](https://bland.ai) |
| `WHATSAPP_BUSINESS_TOKEN` | WhatsApp API | [Meta Business](https://business.facebook.com) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Maps | [Google Cloud Console](https://console.cloud.google.com) |

See `.env.example` for the complete list.

---

## Pricing Plans

| | Free | Starter | Pro | Agency |
|---|:---:|:---:|:---:|:---:|
| **Price** | €0 | €197/mo | €497/mo | €897/mo |
| AI Listings | 5/mo | 50/mo | 200/mo | ∞ |
| Portal Connections | — | 1 | All 16 | All 16 |
| Visual AI Jobs | 2/mo | 10/mo | 50/mo | 500/mo |
| Voice Agent | — | — | 300 min/mo | 1500 min/mo |
| WhatsApp AI | — | 50 conv/mo | 500 conv/mo | 10,000 conv/mo |
| CRM & Pipeline | — | — | ✅ | ✅ |
| Compliance Shield | — | — | ✅ | ✅ |
| Team Users | 1 | 1 | 5 | 25 |
| White-Label | — | — | — | ✅ |
| API Access | — | — | — | ✅ |

Annual billing saves 20%.

---

## Markets

| Country | Portals | Compliance | Language |
|---------|---------|------------|----------|
| 🇮🇹 Italy | Immobiliare.it, Casa.it, Idealista | APE, Conformità | Italiano |
| 🇫🇷 France | SeLoger, LeBonCoin, Bien'ici | DPE, Loi Carrez, Loi ALUR | Français |
| 🇪🇸 Spain | Idealista, Fotocasa | CEE | Español |
| 🇩🇪 Germany | ImmoScout24, Immowelt | GEG Energieausweis | Deutsch |
| 🇬🇧 UK | Rightmove, Zoopla, OnTheMarket | EPC | English |
| 🇵🇹 Portugal | Idealista, Imovirtual | SCE | Português |

---

## Database Migrations

Run in order on Supabase SQL Editor:

```
supabase/migrations/
├── 01_add_agency_profile_columns.sql
├── 02_20260503_voice_agent_tables.sql
├── 03_20260503_whatsapp_tables.sql
├── 04_20260503_cma_tables.sql
├── 05_20260503_eu_tax_compliance.sql
├── 06_20260518_visual_ai.sql
├── 07_20260518_compliance.sql
├── 08_20260518_documents.sql
├── 09_20260518_automations.sql
├── 10_20260518_white_label.sql
├── 11_20260518_marketplace.sql
├── 12_20260518_predictive_leads.sql
├── 13_20260518_market_reports.sql
├── 14_20260518_gdpr.sql
├── 15_20260518_chatbot_gdpr.sql
└── 16_20260523_supplementary_tables.sql
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `feat(scope): description`
4. Run `npx tsc --noEmit` (zero errors required)
5. Run `npm run build` (must pass)
6. Open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Founder

**Arslene Zammouri** — Solo founder, Milano, Italy  
Building the future of European real estate technology.

---

<p align="center">
  <strong>PropertyPilot AI</strong> — Pilot Your Agency to the Next Level 🚀
</p>
