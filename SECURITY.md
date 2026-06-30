# Security Policy — PropertyPilot AI

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Email:** security@propertypilotai.com  
**Response Time:** Within 48 hours  
**Do NOT** create a public GitHub issue for security vulnerabilities.

## What We Protect

- User credentials (Supabase Auth with bcrypt hashing)
- Payment data (Stripe PCI-DSS Level 1 — we never touch card numbers)
- Personal data (GDPR-compliant, EU-hosted)
- API keys and tokens (server-side only, never exposed to client)
- Session data (httpOnly cookies, SameSite=Strict)

## Infrastructure Security

| Layer | Provider | Certification |
|-------|----------|---------------|
| Hosting | Vercel | SOC 2 Type II |
| Database | Supabase | SOC 2 Type II, ISO 27001 |
| Payments | Stripe | PCI-DSS Level 1 |
| Email | Resend | SOC 2 Type II |
| AI | OpenAI | SOC 2 Type II |
| CDN | Vercel Edge Network | Global, encrypted |

## Security Headers

All responses include:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(self), geolocation=(self)`

## Data Encryption

- **In transit:** TLS 1.3 (Vercel edge)
- **At rest:** AES-256 (Supabase/AWS)
- **Sensitive fields:** Encrypted with AES-256-GCM (API keys, tokens)

## Authentication

- Supabase Auth (email/password, magic link)
- Session tokens via httpOnly cookies
- Rate limiting on auth endpoints (5 attempts/min)
- CSRF protection via SameSite cookies

## Database Security

- Row-Level Security (RLS) on ALL tables
- Service role key used only server-side
- Parameterized queries (no SQL injection)
- Connection pooling via Supabase

## GDPR Compliance

- Data Processing Agreement available (Agency tier)
- Right to erasure: `/api/gdpr` endpoint
- Data export: Full user data export
- Consent tracking: Granular cookie consent
- Data minimization: Only necessary data collected
- EU-hosted infrastructure (Vercel EU, Supabase EU)

## Subprocessors

| Service | Purpose | Data Location | Certifications |
|---------|---------|---------------|----------------|
| Vercel | Hosting, CDN | Global (EU primary) | SOC 2 |
| Supabase | Auth, Database | EU (Ireland) | SOC 2, ISO 27001 |
| Stripe | Payments | EU | PCI-DSS L1 |
| OpenAI | AI Generation | US | SOC 2 |
| Resend | Email | US | SOC 2 |
| Replicate | Visual AI | US | — |
| Bland AI | Voice Agent | US | — |
| Twilio | Phone Numbers | Global | SOC 2 |
| Sentry | Error Tracking | US | SOC 2 |

## Responsible Disclosure

We appreciate security researchers who help keep PropertyPilot AI safe.
Please allow 90 days for us to address reported vulnerabilities before public disclosure.

## Bug Bounty

We currently offer recognition and thanks to researchers who report valid vulnerabilities.
A formal bug bounty program is planned for 2027.
