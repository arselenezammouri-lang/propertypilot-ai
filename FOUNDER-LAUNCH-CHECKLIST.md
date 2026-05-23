# FOUNDER LAUNCH CHECKLIST — PropertyPilot AI

## ⚡ CRITICAL (must do before first customer)

### 1. Supabase
- [x] Run all 16 SQL migrations (15 original + 20260523_supplementary_tables.sql)
- [ ] Verify tables exist: `SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';` → should be 55+
- Env vars:
  - `NEXT_PUBLIC_SUPABASE_URL` — Project URL (Critical)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key (Critical)
  - `SUPABASE_SERVICE_ROLE_KEY` — Service role key, server-only (Critical)

### 2. Stripe (LIVE mode)
- [ ] Switch to live keys in Stripe Dashboard → Developers → API keys
- [ ] Create webhook endpoint:
  - **URL:** `https://propertypilot-ai.vercel.app/api/stripe/webhook`
  - **Events:** checkout.session.completed, customer.subscription.created, customer.subscription.updated, customer.subscription.deleted, invoice.paid, invoice.payment_failed, invoice.upcoming
- [ ] Enable Stripe Tax → Settings → Tax → Add Italy registration
- [ ] Register for EU OSS at agenziaentrate.gov.it
- Env vars:
  - `STRIPE_SECRET_KEY` — sk_live_... (Critical)
  - `STRIPE_WEBHOOK_SECRET` — whsec_... (Critical)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — pk_live_... (Critical)
  - `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` — price_1StsWIA1is7KNmaevO6UdO0Z
  - `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` — price_1StsZEA1is7KNmae5XkGgEr4
  - `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID` — price_1StsbAA1is7KNmae4taYsNtk
- **Verify:** Create test checkout → payment succeeds → webhook updates subscription → user sees Pro plan in /dashboard/billing

### 3. OpenAI
- [ ] Get API key from https://platform.openai.com/api-keys
- Env var: `OPENAI_API_KEY` (Critical)
- **Verify:** Go to /dashboard/ai-listings → generate a listing → text returned in <30s

### 4. Resend (Email)
- [ ] Create account at https://resend.com
- [ ] Verify sending domain (add DNS records)
- Env var: `RESEND_API_KEY` (Critical)
- **Verify:** Sign up as new user → welcome email received

## 🔶 IMPORTANT (needed for full feature set)

### 5. Replicate (Visual AI)
- [ ] Get API token from https://replicate.com/account/api-tokens
- Env var: `REPLICATE_API_TOKEN` (Important)
- **Verify:** /dashboard/visual-ai → upload photo → staging job created

### 6. Google Maps
- [ ] Create API key at https://console.cloud.google.com
- [ ] Enable: Maps JavaScript API, Places API, Geocoding API
- [ ] Restrict to referrer: `propertypilot-ai.vercel.app/*`
- Env var: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Important)
- **Verify:** /dashboard/ai-listings → type address → map shows with pin

### 7. Vercel Cron Secret
- [ ] Generate random string: `openssl rand -hex 32`
- Env var: `CRON_SECRET` (Important)
- **Verify:** Cron jobs run on schedule in Vercel → Functions tab

## 🔷 OPTIONAL (enable per feature)

### 8. Meta WhatsApp Business
- [ ] Create app at https://business.facebook.com
- [ ] Get WhatsApp Business token
- [ ] Register webhook:
  - **URL:** `https://propertypilot-ai.vercel.app/api/whatsapp/webhook`
  - **Verify token:** `propertypilot-wa-verify-2026`
  - **Subscribe:** messages, message_deliveries
- [ ] Submit message templates for approval (1-3 days)
- Env vars:
  - `WHATSAPP_BUSINESS_TOKEN` (Optional)
  - `WHATSAPP_PHONE_ID` (Optional)
  - `WHATSAPP_BUSINESS_ACCOUNT_ID` (Optional)
  - `WHATSAPP_VERIFY_TOKEN` — default: propertypilot-wa-verify-2026
- **Verify:** Send test message → received in /dashboard/whatsapp

### 9. Bland AI (Voice Agent)
- [ ] Get API key from https://bland.ai
- [ ] Register webhook:
  - **URL:** `https://propertypilot-ai.vercel.app/api/voice/webhook`
  - **Events:** call_ended
- Env var: `BLAND_AI_API_KEY` (Optional)
- **Verify:** /dashboard/voice-campaigns → initiate test call

### 10. Twilio (EU Phone Numbers)
- [ ] Create account at https://www.twilio.com
- [ ] Buy Italian phone number (+39)
- Env vars:
  - `TWILIO_ACCOUNT_SID` (Optional)
  - `TWILIO_AUTH_TOKEN` (Optional)

### 11. ElevenLabs (Voice Cloning, Agency tier)
- [ ] Create account at https://elevenlabs.io
- Env var: `ELEVENLABS_API_KEY` (Optional)

### 12. CubiCasa (Floor Plans)
- [ ] Apply at https://www.cubicasa.com/api
- Env var: `CUBICASA_API_KEY` (Optional, future)

### 13. Casafari (Predictive Leads Data)
- [ ] Apply for partnership at https://casafari.com
- Data partnership, no env var needed initially

### 14. Cal.com (Calendar Booking)
- [ ] Create account at https://cal.com
- Env var: `CAL_COM_API_KEY` (Optional)

## 📡 WEBHOOK REGISTRY

| Service | Webhook URL | Events | Secret Env Var |
|---------|-------------|--------|----------------|
| Stripe | /api/stripe/webhook | checkout, subscription, invoice | STRIPE_WEBHOOK_SECRET |
| Meta WhatsApp | /api/whatsapp/webhook | messages, deliveries | WHATSAPP_VERIFY_TOKEN |
| Bland AI | /api/voice/webhook | call_ended | — |
| Replicate | /api/visual-ai/webhook | completed | — |
| Twilio | /api/voice/inbound | voice incoming | — |
| Vercel Cron | /api/cron/* | scheduled | CRON_SECRET |

## 🌍 PORTAL PARTNERSHIPS (apply now, takes weeks)

| Portal | Country | Apply At | Timeline |
|--------|---------|----------|----------|
| EstateSync | DE (3 portals) | https://www.estatesync.com | 1-2 weeks |
| Idealista API | IT/ES/PT | https://developers.idealista.com | 2-4 weeks |
| Rightmove RTDF | UK | https://www.rightmove.co.uk/developer/ | 4-8 weeks |
| SeLoger | FR | https://www.avivgroup.com/partners | 4-6 weeks |
| LeBonCoin | FR | https://adevinta.com/partners | 4-6 weeks |
| Fotocasa | ES | Same as LeBonCoin (Adevinta) | 4-6 weeks |
| Bien'ici | FR | https://www.poliris.com | 4-6 weeks |
| Imovirtual | PT | https://www.olxgroup.com | 4-6 weeks |

Self-service portals (no application needed):
- Immobiliare.it — XML feed setup in agency backoffice
- Casa.it — XML feed setup
- Zoopla — Developer portal
- OnTheMarket — Feed setup in backoffice

## ✅ POST-LAUNCH VERIFICATION

After all env vars set:
1. [ ] Signup as new user → email received → login works
2. [ ] Generate AI listing → text returned
3. [ ] Upload to Visual AI → job created (with REPLICATE_API_TOKEN)
4. [ ] Run compliance check → score returned
5. [ ] Open CMA → generate report
6. [ ] Go to /pricing → click "Go Pro" → Stripe checkout opens → complete → subscription active
7. [ ] Open /dashboard/billing → "Manage subscription" → Stripe portal opens
8. [ ] Ctrl+K → click any item → navigates correctly
9. [ ] All sidebar items load without errors
10. [ ] Mobile responsive: test on phone browser
