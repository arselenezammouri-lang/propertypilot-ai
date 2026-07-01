# FOUNDER LAUNCH CHECKLIST — PropertyPilot AI

## ✅ Pre-Launch: Environment Variables (Vercel)

### 🔴 Priority 1 — REQUIRED FOR LAUNCH
| Variable | Source | Status |
|----------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | [supabase.com](https://supabase.com) → Project Settings → API | ☐ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as above | ☐ |
| `SUPABASE_SERVICE_ROLE_KEY` | Same (server-only, never expose) | ☐ |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/api-keys) | ☐ |
| `STRIPE_SECRET_KEY` | [stripe.com](https://dashboard.stripe.com/apikeys) (sk_live_...) | ☐ |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks | ☐ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same (pk_live_...) | ☐ |
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | `price_1StsWIA1is7KNmaevO6UdO0Z` | ☐ |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | `price_1StsZEA1is7KNmae5XkGgEr4` | ☐ |
| `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID` | `price_1StsbAA1is7KNmae4taYsNtk` | ☐ |
| `RESEND_API_KEY` | [resend.com](https://resend.com/api-keys) | ☐ |

### 🟡 Priority 2 — FIRST WEEK
| Variable | Source | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com) | Maps on listings |
| `REPLICATE_API_TOKEN` | [replicate.com](https://replicate.com/account/api-tokens) | Visual AI |
| `NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID` | `price_1TSGiwA1is7KNmaeuwZyZCrj` | Annual pricing |
| `NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID` | `price_1TSGiyA1is7KNmaeloBvSJTW` | Annual pricing |
| `NEXT_PUBLIC_STRIPE_AGENCY_YEARLY_PRICE_ID` | `price_1TSGj1A1is7KNmaeg9Uf6I0U` | Annual pricing |

### 🟢 Priority 3 — WHEN READY
| Variable | Source | Purpose |
|----------|--------|---------|
| `ELEVENLABS_API_KEY` | [elevenlabs.io](https://elevenlabs.io) | Voice tours + cloning |
| `BLAND_AI_API_KEY` | [bland.ai](https://bland.ai) | Voice agent calls |
| `TWILIO_ACCOUNT_SID` | [twilio.com](https://www.twilio.com/console) | SMS + phone numbers |
| `TWILIO_AUTH_TOKEN` | Same | Auth |
| `META_APP_ID` | [developers.facebook.com](https://developers.facebook.com) | Social publishing |
| `SENTRY_DSN` | [sentry.io](https://sentry.io) | Error monitoring |
| `UPSTASH_REDIS_REST_URL` | [upstash.com](https://upstash.com) | Caching |

---

## ✅ SQL Migrations (Run in Order on Supabase)

Go to: **supabase.com → Your Project → SQL Editor → New Query**

Run each file in exact order:

| # | File | Tables Created |
|---|------|---------------|
| 1 | `add_agency_profile_columns.sql` | Profile columns |
| 2 | `20260503_voice_agent_tables.sql` | phone_numbers, voice_clones, calls |
| 3 | `20260503_whatsapp_tables.sql` | whatsapp_conversations, messages |
| 4 | `20260503_cma_tables.sql` | cma_reports, listings_history |
| 5 | `20260503_eu_tax_compliance.sql` | Tax fields |
| 6 | `20260518_visual_ai.sql` | visual_ai_jobs |
| 7 | `20260518_compliance.sql` | compliance_reports |
| 8 | `20260518_documents.sql` | extracted_documents |
| 9 | `20260518_automations.sql` | automation_configs, runs |
| 10 | `20260518_white_label.sql` | agency_branding, clients |
| 11 | `20260518_marketplace.sql` | marketplace_listings, matches |
| 12 | `20260518_predictive_leads.sql` | predictive features |
| 13 | `20260518_market_reports.sql` | market_reports |
| 14 | `20260518_gdpr.sql` | gdpr_consents, dsar_requests |
| 15 | `20260518_chatbot_gdpr.sql` | chatbot_conversations |
| 16 | `20260523_supplementary_tables.sql` | activities, brand_voice, calls |
| 17 | `20260630_virtual_tours_3d.sql` | virtual_tours, analytics, hotspots |
| 18 | `20260701_social_publishing.sql` | social_accounts, posts, results |
| 19 | `20260701_security_compliance.sql` | 2FA, sessions, audit, trials, referrals |

---

## ✅ Stripe Webhook

1. Go to: **stripe.com → Developers → Webhooks → Add endpoint**
2. URL: `https://propertypilot-ai.vercel.app/api/stripe/webhook`
3. Events to subscribe:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy webhook signing secret → set as `STRIPE_WEBHOOK_SECRET`

---

## ✅ Portal Partner Applications

### Self-Service (Immediate Access)
| Portal | Country | URL |
|--------|---------|-----|
| Immobiliare.it | 🇮🇹 IT | Agency backoffice — XML feed setup |
| Casa.it | 🇮🇹 IT | Agency backoffice — XML feed setup |
| Idealista | 🇮🇹🇪🇸🇵🇹 | [developers.idealista.com](https://developers.idealista.com) |
| EstateSync | 🇩🇪 DE | [estatesync.com](https://www.estatesync.com) — €50/month, all DE portals |
| OnTheMarket | 🇬🇧 UK | [onthemarket.com](https://www.onthemarket.com) |

### Partner Application (2-4 weeks)
| Portal | Country | URL | Timeline |
|--------|---------|-----|----------|
| ImmoScout24 | 🇩🇪 DE | Via EstateSync | 2-4 weeks |
| Bien'ici | 🇫🇷 FR | [poliris.com](https://www.poliris.com) | 2-4 weeks |
| Imovirtual | 🇵🇹 PT | [olxgroup.com](https://www.olxgroup.com) | 2-4 weeks |

### Long Approval (4-8 weeks)
| Portal | Country | URL | Timeline |
|--------|---------|-----|----------|
| Rightmove | 🇬🇧 UK | [rightmove.co.uk/developer](https://www.rightmove.co.uk/developer/) | 4-8 weeks |
| SeLoger | 🇫🇷 FR | [avivgroup.com/partners](https://www.avivgroup.com/partners) | 4-8 weeks |
| LeBonCoin | 🇫🇷 FR | [adevinta.com/partners](https://adevinta.com/partners) | 4-8 weeks |
| Fotocasa | 🇪🇸 ES | Same Adevinta application | 4-8 weeks |

---

## ✅ Italian Founder Legal Requirements

| Action | Where | Cost | Priority |
|--------|-------|------|----------|
| Open Partita IVA | [agenziaentrate.gov.it](https://www.agenziaentrate.gov.it) | Free | Before €5k revenue |
| Camera di Commercio | Local CCIAA | €88.50/year | With P.IVA |
| PEC (Certified Email) | Aruba, Poste | ~€5-10/year | With P.IVA |
| Firma Digitale | Aruba, Poste | ~€60/year | With P.IVA |
| Commercialista | [Fiscozen.it](https://fiscozen.it) | €420-840/year | Recommended |
| EU OSS Registration | Agenzia Entrate | Free | For cross-border VAT |
| OSS Quarterly Filing | agenziaentrate.gov.it | N/A | Apr 20, Jul 20, Oct 20, Jan 20 |

**Alternative before P.IVA:** Use Prestazione Occasionale (up to €5,000/year) with Stripe in test mode for demos.

---

## ✅ Launch Day Checklist

| Step | Action | Status |
|------|--------|--------|
| 1 | All env vars set on Vercel | ☐ |
| 2 | All SQL migrations run on Supabase | ☐ |
| 3 | Stripe webhook configured | ☐ |
| 4 | Test signup → login → dashboard | ☐ |
| 5 | Test AI listing generation | ☐ |
| 6 | Test Stripe checkout (live mode) | ☐ |
| 7 | Test /tools/instant-valuation (public) | ☐ |
| 8 | Test /help (help center) | ☐ |
| 9 | Test language switching (6 languages) | ☐ |
| 10 | Post on LinkedIn + Twitter | ☐ |
| 11 | Submit to Product Hunt | ☐ |
| 12 | Email first 50 Italian agencies | ☐ |
