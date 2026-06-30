# Changelog

All notable changes to PropertyPilot AI are documented here.

## [v84] — 2026-06-30
### Changed
- Remove all fake social proof (500+ agencies, fake testimonials)
- Replace with honest credibility: real feature showcases, real positioning
- GitHub infrastructure: issue templates, PR template, Dependabot

## [v83] — 2026-06-30
### Added
- AI Transparency Disclosure page (/ai-disclosure) — EU AI Act compliance
- .nvmrc (Node 20) and .dockerignore for repo hygiene

## [v82] — 2026-06-30
### Added
- Help Center (/help) — 31 searchable articles across 12 categories
- System Status page (/status) — 9 service monitors with uptime
- Security & Trust page (/security) — subprocessors, encryption, GDPR

## [v81] — 2026-06-30
### Added
- Central Plan Management (lib/plans/feature-gates.ts) — single source of truth
- Plan enforcement middleware (lib/plans/enforce.ts) — 403/429 with upgrade CTAs
- SECURITY.md — responsible disclosure, subprocessors, bug bounty
- CONTRIBUTING.md — development setup and code standards
- LICENSE (MIT)
- Complete README.md rewrite with competitive comparison table

## [v80] — 2026-06-30
### Changed
- Remove Arabic (ar) locale from all 25 files
- Fix English flag from 🇺🇸 to 🇬🇧
- Enforce 6 EU languages: IT, EN, FR, ES, DE, PT
- Remove RTL direction handling
- Add PT where missing in API locale checks

## [v79] — 2026-06-29
### Added
- FOUNDER-FINAL-AUDIT.md — complete production readiness assessment
- All 15 SQL migrations executed on Supabase production

## [v72-v78] — 2026-06-28
### Fixed
- Production readiness: all 44 dashboard pages tested
- 21 forms validated with Zod
- 8 dead buttons wired with onClick handlers
- Command palette rewritten with bulletproof Link navigation
- Auth callback flow fixed (code exchange)
- All loading/error states verified (45/45 each)

## [v64-v66] — 2026-06-25
### Fixed
- Crash-proofed ALL dashboard pages — optional chaining on API data
- Command palette navigation — dual onSelect + onMouseDown
- Google Maps + Photo Upload wired into ai-listings, cma, marketplace

## [v50-v60] — 2026-06-20
### Added
- GDPR DSAR automation + consent tracking
- Embeddable AI chatbot widget
- Free tools: mortgage calculator, ROI calculator, CMA tax calculator
- 16 portal adapters (IT, FR, ES, DE, UK, PT)
- Market reports with cron job
- Predictive seller leads model

## [v40-v49] — 2026-06-15
### Added
- Compliance Shield: 35+ rules across 6 EU countries
- Document AI: GPT-4o Vision extraction with 48 fields
- Lead Scoring v2: hybrid 5-category system
- Speed-to-Lead automation
- White-label client portal
- MCP Server (JSON-RPC 2.0)
- Cross-border marketplace

## [v30-v39] — 2026-06-10
### Added
- Visual AI Suite: virtual staging, photo enhancement, floor plans
- CMA/Valuation system with AVM
- Voice Agent v2: Bland AI + ElevenLabs + Twilio
- WhatsApp AI Agent: Meta Cloud API + intent classification
- EU Tax Compliance: Stripe Tax + VAT ID collection

## [v22-v29] — 2026-06-05
### Added
- Initial dashboard: 35+ pages with shadcn/ui
- AI Listing Engine: GPT-4o, 3 styles × 6 languages
- CRM with lead management
- Stripe subscriptions (4 tiers)
- Dark theme with glassmorphism design system
- 6-language i18n system
