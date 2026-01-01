# PropertyPilot AI - Next.js Premium Platform

**Canonical Project Name:** `propertypilot-ai`  
**Platforms:** Replit (origin) → GitHub → Cursor (development)

## Overview

PropertyPilot AI is an AI-powered platform for Italian real estate professionals, designed to automate property listing creation, title generation, multilingual translations, and marketing. It aims to elevate real estate agencies using AI, integrating with Next.js 14, Supabase for authentication and database, Stripe for billing, and advanced AI for content generation, auditing, and web scraping across major Italian and US real estate portals.

## User Preferences

Preferred communication style: Italian language, simple and everyday language

## System Architecture

**Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui.
**Authentication**: Supabase Auth.
**Database**: Supabase PostgreSQL.
**Payments**: Stripe Billing.
**AI Integration**: OpenAI GPT API.
**Hosting**: Optimized for Vercel.

**UI/UX Decisions**: Futuristic color palette (Luxury Indigo, Royal Purple, Electric Blue, Neon Aqua, Sunset Gold), custom gradients, enhanced UI elements, glassmorphism cards, neon buttons, and animations. Intuitive dashboards with organized results and visual cues.

**Key Features**:
- **AI Content Generation**: Creates professional listings, titles, and translations.
- **Subscription Tiers**: Four premium plans:
  - **Starter** (€97/mese): Titoli A/B AI, Descrizioni AI, Analisi Annuncio AI, Hashtag AI, PDF professionali, Chatbot AI assistente. Esclusioni: No CRM, No pipeline, No automazioni, No SMS/WhatsApp
  - **Pro** (€297/mese, Consigliato): Tutto di Starter + CRM completo, Pipeline Kanban, Lead Scoring AI, Lead Enrichment AI, Communication Hub (Email/SMS/WhatsApp), 20 automazioni AI, Smart Lead Capture Forms, White-label PDF, Agency Assistant AI
  - **Agency** (€497/mese): Tutto di Pro + 10 utenti inclusi, Ruoli (Admin/Agent), Distribuzione lead automatica, Report attività team, Integrazione multi-sede, Supporto prioritario dedicato
  - **Agency Boost** (€2.497 una tantum): Pacchetto "Scala in 7 giorni" - Setup completo CRM + automazioni, 10 moduli acquisizione lead, 3 script follow-up personalizzati, 1 ora formazione video, Implementazione personalizzata, Consulenza 1:1, Branding e processi custom
- **User Management**: Profiles, subscriptions, and saved listings.
- **Web Scraping**: Imports listings from major Italian and US real estate portals using a modular `BaseScraper` and `Factory Pattern`.
- **Lead Scoring AI**: Analyzes leads with a 0-100 score, categorizes them (Hot/Warm/Cold), provides a 5-factor breakdown, suggests prioritized actions, offers response templates, and follow-up strategies.
- **CRM 4.0**:
    - **Communication Hub**: Unified messaging (Email, WhatsApp, SMS) with AI-powered message generation, tone selection, and template system.
    - **Automation Center**: Rules-based engine with triggers, conditions, and actions for lead management (e.g., update status, send messages).
    - **AI Lead Enrichment**: Provides psychographic profiles, closing probability, budget analysis, property recommendations, probable objections, and buyer persona insights.
    - **Smart Lead Capture**: Generates user-level API keys for external form submissions, with optional auto-scoring and embeddable HTML/JS forms.
    - **Pipeline Kanban View**: Drag-and-drop interface for managing leads across stages (New, Contacted, Follow-up, Closed, Lost) with automatic status updates and automation rule execution.
- **Real Estate Audit AI Expert**: Audits listings with a Quality Score (0-100) across structure, SEO, emotion, and persuasiveness, offering critical fixes, strategic suggestions, and optimized copy.
- **Advanced AI Tools**: Includes "Analisi Automatica da Link" (multi-portal scraping and AI analysis), "Generatore Schede Immobili in PDF", "Generatore Post Social AI", "Generatore Titoli A/B ad Alto CTR", "Traduttore Multilingua AI", "Perfect Real Estate Copy 2.0", "Agent BIO AI Creator", "Follow-Up Email AI Generator", "Video Script AI Generator", "Hashtag AI Generator", "Emotional Listing AI", "Perfect Again AI" refinement engine, "Agency Assistant AI" chatbot, and "Automazioni AI" workflow engine.

**System Design Choices**:
- Unified Next.js App Router architecture.
- Custom error handling with user-friendly Italian messages.
- Rate limiting for scraping and AI generation.
- One-shot Stripe payments with webhook handling.
- 24-hour AI Cache with `AICacheService` for cost optimization.
- OpenAI retry logic with exponential backoff.
- Database indexing on critical tables.
- Health endpoint (`/api/health`) for system checks with DB/OpenAI/Stripe monitoring.

**Security Architecture**:
- Server-side authentication: All API routes verify user via `supabase.auth.getUser()` before data access.
- Data isolation: Queries filter by `user_id` at application level.
- RLS Status: Not enabled - security handled via server-side auth checks (acceptable for server-only data access pattern).
- Secrets management: All API keys stored as Replit Secrets, never exposed to client.

**Database Architecture**:
- **Supabase Auth**: Manages user authentication (auth.users schema - external service).
- **Neon PostgreSQL**: Stores application data (profiles, subscriptions, leads, etc.).
- **User Setup Flow**: After signup/login, `/api/auth/setup-user` creates profile and subscription records if they don't exist.
- **Tables**: profiles (user_id as UUID), subscriptions (status: free/starter/pro/agency), generation_logs, leads, automation_rules, etc.

## External Dependencies

- **Supabase**: Authentication and PostgreSQL database.
- **Stripe**: Subscription billing and payment processing.
- **OpenAI**: AI content generation and auditing via GPT API.
- **Vercel**: Deployment platform.
- **Real Estate Portals**: Immobiliare.it, Idealista.it, Casa.it, Subito.it, Zillow.com (for web scraping).