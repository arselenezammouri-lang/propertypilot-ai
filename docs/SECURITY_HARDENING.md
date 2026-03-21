# Security hardening (PropertyPilot AI)

This document describes **what is implemented in code** and what still belongs at the **platform / ops** layer. No single application change can replace WAF, bot management, or secrets hygiene.

## In-app protections (current)

| Layer | Mechanism | Notes |
|-------|-----------|--------|
| **Edge middleware** | Per-IP fixed-window rate limit on `/api/*` | In-memory per server instance. **Skips** `/api/stripe/webhook`, `/api/prospecting/call/webhook`, `/api/health`, and `/api/dev/*` in development. Enable/disable and tune via env (see `.env.example`). |
| **Edge middleware** | User-Agent heuristics | Optional block of empty UA and known scanner/tool patterns. Tuned for noise reduction; false positives possible for custom integrations — use env to relax. |
| **HTTP headers** | `Permissions-Policy`, `X-Permitted-Cross-Domain-Policies` | Reduces risky browser feature exposure; complements existing headers in `next.config.mjs`. |
| **API routes** | User + IP limits via `generation_logs` / memory limiters | Already present on many AI endpoints; complements edge limits. |
| **Auth** | Supabase session refresh in middleware | Dashboard routes require a valid session. |
| **Billing** | Stripe webhook signature verification | Do not expose `STRIPE_WEBHOOK_SECRET`; webhook paths are excluded from generic API throttling. |

## Recommended platform additions (not optional at scale)

1. **Vercel Firewall / WAF** — fleet-wide rate limits, geo rules, managed rulesets.
2. **Cloudflare (or similar)** — DDoS, Bot Fight Mode / Bot Management, Turnstile in front of auth.
3. **Turnstile / hCaptcha** — human attestation on signup, login, or “high cost” forms (optional keys in `.env.example`; UI wiring is a separate task).
4. **Supabase** — RLS policies, leaked password protection, MFA for admin accounts.
5. **Secrets** — rotate any key ever pasted in chat; use Vercel env only in production; never commit `.env.local`.

## Environment variables

See `.env.example` section **EDGE / ANTI-ABUSE** and **Turnstile**.

## Limitations (honest)

- **Edge in-memory rate limits** reset per instance and are approximate under many replicas; use WAF for authoritative throttling.
- **User-Agent blocking** is heuristic; sophisticated bots mimic real browsers.
- **Strict Content-Security-Policy** with nonces is desirable but requires careful Next.js integration; consider a follow-up with `report-only` first.

## Suggested implementation backlog (autonomous next steps)

1. **Cloudflare Turnstile on `/auth/login` and `/auth/signup`** — verify `TURNSTILE_SECRET_KEY` server-side before calling Supabase; keep keys in env only.
2. **Stricter CSP** — start with `Content-Security-Policy-Report-Only`, collect violations, then enforce with nonces for inline scripts Next needs.
3. **Central API wrapper** — optional `withApiSecurity(handler)` that applies consistent JSON body size limits, origin checks for state-changing routes, and structured audit logging.
4. **Redis / Upstash rate limit** — replace or augment edge in-memory limits for accurate counts across all instances (especially for AI-heavy routes).
5. **Security headers on API responses** — for sensitive JSON routes, mirror `no-store` and minimal `Cache-Control` (some already set per-route).
6. **Dependency & secret scanning** — CI job (`npm audit`, GitHub Dependabot, or similar) and periodic key rotation policy.
