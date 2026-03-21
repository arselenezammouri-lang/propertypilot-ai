# Security hardening (PropertyPilot AI)

This document describes **what is implemented in code** and what still belongs at the **platform / ops** layer. No single application change can replace WAF, bot management, or secrets hygiene.

## In-app protections (current)

| Layer | Mechanism | Notes |
|-------|-----------|--------|
| **Edge middleware** | Per-IP + per-user AI limits on costly POSTs | **Upstash**: `pp:mw:api` (globale), `pp:mw:ai` (IP AI), `pp:mw:aiu` (utente Supabase su sessione). Memory fallback per istanza se Redis assente. **Skips** webhooks, health, Turnstile verify, dev routes. |
| **Edge middleware** | User-Agent heuristics | Optional block of empty UA and known scanner/tool patterns. Tuned for noise reduction; false positives possible for custom integrations — use env to relax. |
| **HTTP headers** | `Permissions-Policy`, `X-Permitted-Cross-Domain-Policies` | Reduces risky browser feature exposure; complements other headers in `next.config.mjs`. |
| **HTTP headers** | `Content-Security-Policy-Report-Only` | **Production by default** (see `.env.example`). Policy built in `lib/security/content-security-policy.cjs`. Collects violations without blocking; tune `connect-src` / `frame-src` if you add new third-party scripts. |
| **API routes** | User + IP limits via `generation_logs` / memory limiters | Already present on many AI endpoints; complements edge limits. |
| **Auth** | Supabase session refresh in middleware | Dashboard routes require a valid session. |
| **Auth** | Cloudflare Turnstile (login + signup) | When **both** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set, widget + `/api/auth/verify-turnstile` run **before** Supabase. Site key only → **503** (misconfiguration). |
| **API** | `withApiSecurity` + `assertRequestBodyWithinLimit` | Public routes use `withApiSecurity` (method gate, body preflight, **Origin** checks, **Cache-Control: no-store** on responses). `apiWrapper` runs body preflight + **trusted Origin** on mutating requests when `API_STRICT_BROWSER_ORIGIN=true` (production). Tune with `API_MAX_BODY_BYTES`, `API_ALLOWED_ORIGINS`, `API_EMBED_ALLOWED_ORIGINS`. |
| **Billing** | Stripe webhook signature verification | Do not expose `STRIPE_WEBHOOK_SECRET`; webhook paths are excluded from generic API throttling. |

## Recommended platform additions (not optional at scale)

1. **Vercel Firewall / WAF** — fleet-wide rate limits, geo rules, managed rulesets.
2. **Cloudflare (or similar)** — DDoS, Bot Fight Mode / Bot Management; Turnstile keys are already wired in-app for auth.
3. **hCaptcha / extra friction** — optional second layer on “high cost” forms only if needed.
4. **Supabase** — RLS policies, leaked password protection, MFA for admin accounts.
5. **Secrets** — rotate any key ever pasted in chat; use Vercel env only in production; never commit `.env.local`.

## Environment variables

See `.env.example` section **EDGE / ANTI-ABUSE** and **Turnstile**.

## Limitations (honest)

- **Edge in-memory rate limits** reset per instance and are approximate under many replicas; use WAF for authoritative throttling.
- **User-Agent blocking** is heuristic; sophisticated bots mimic real browsers.
- **Strict Content-Security-Policy** with nonces is desirable but requires careful Next.js integration; consider a follow-up with `report-only` first.

## Suggested implementation backlog (autonomous next steps)

1. ~~**Cloudflare Turnstile on `/auth/login` and `/auth/signup`**~~ — **Done** in-app; add keys on Vercel + Cloudflare dashboard.
2. **Stricter CSP** — Report-Only is **on in production** via `next.config.mjs`. Next: set `CSP_REPORT_URI` / `report-to`, review violations, then enforce with nonces where possible.
3. **Central API wrapper** — `withApiSecurity` + body preflight + Origin + `no-store` in `apiWrapper` (**done**).
4. **Security audit JSON lines** — `lib/security/security-audit-log.ts`: in production, eventi `edge_bot_block`, `edge_rate_limit`, `origin_rejected_*`, `payload_too_large`, `method_not_allowed` (vedi `SECURITY_AUDIT_*` in `.env.example`). Opzionale: drain log Vercel → SIEM.
5. **Redis / Upstash rate limit** — global + AI IP + **AI per-user** (`EDGE_AI_USER_RATE_LIMIT_*`) (**done**). Next: WAF / anomaly detection.
6. **Security headers on API responses** — largely covered by `mergeNoStoreHeaders` / `apiWrapper`; review any raw `NextResponse.json` routes.
7. **Dependency & secret scanning** — Dependabot + CI `npm audit --audit-level=critical` + advisory high in log (**done**). Debito: [OPERATIONS_SECURITY.md](./OPERATIONS_SECURITY.md).
