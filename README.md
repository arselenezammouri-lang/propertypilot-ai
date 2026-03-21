# 🏠 PropertyPilot AI

**SaaS Enterprise per il mercato immobiliare globale**

PropertyPilot AI è una piattaforma completa per agenti immobiliari che automatizza la generazione di contenuti, gestione lead, e prospecting immobiliare usando AI.

---

## ✨ Features

- 🤖 **AI Content Generation** - Genera listing, social posts, e copy perfetto
- 📊 **Lead Management** - CRM integrato con AI lead scoring
- 🔍 **Property Prospecting** - Automazione ricerca proprietà
- 💬 **AI Voice Calling** - Chiamate automatiche con Bland AI
- 🌍 **Multi-lingua** - Supporto IT, EN, ES, FR, DE, AR
- 💳 **Stripe Integration** - Pagamenti e subscription
- 📈 **Analytics** - Tracking performance e Web Vitals

---

## 🚀 Quick Start

### Prerequisiti

- Node.js 18+
- Account Supabase
- Account Stripe
- Account OpenAI

### Installazione

```bash
# Clone repository
git clone https://github.com/your-org/propilot-ai.git
cd propilot-ai

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server (consigliato su Windows se le porte sono occupate)
npm run dev:clean

# In alternativa
npm run dev
```

Apri **solo** http://localhost:3000 (stessa porta del terminale).

**Problemi con «Sei Offline», 404 o porte 3001/3002?** → [AVVIO_LOCAL_WINDOWS.md](./AVVIO_LOCAL_WINDOWS.md)

Per setup completo, vedi [docs/SETUP.md](./docs/SETUP.md)

---

## 📚 Documentazione

- [Design & UX (locale, benchmark internazionali)](./DESIGN_UX_LOCALE.md) - Principi enterprise, checklist per feature, allineamento al design system
- [Security hardening](./docs/SECURITY_HARDENING.md) - Middleware anti-abuso, header, limiti e cosa demandare a WAF / Cloudflare
- [Checklist deploy Vercel](./docs/VERCEL_DEPLOY_CHECKLIST.md) - Variabili ambiente, Origin, Turnstile, verifiche post-deploy
- [Operations & security](./docs/OPERATIONS_SECURITY.md) - WAF Vercel, log `security_audit`, Dependabot, rotazione segreti
- [Piano UX & struttura enterprise](./docs/PLAN_SAAS_UX_ENTERPRISE.md) - Roadmap design moderno, shell dashboard, verticali per area
- [Inventario route dashboard (Fase 0)](./docs/DASHBOARD_ROUTE_INVENTORY.md) - URL, JTBD, piano, gate UI, priorità B1–B6
- [Audit componenti condivisi (Fase 0)](./docs/SHARED_COMPONENTS_AUDIT.md) - Card, Button, modali, header/sidebar, drift vs design system
- [API Documentation](./docs/API.md) - Documentazione completa API
- [Architecture](./docs/ARCHITECTURE.md) - Architettura sistema
- [Setup Guide](./docs/SETUP.md) - Guida setup e deployment
- [Go-To-Market Plan](./docs/GO_TO_MARKET_EXECUTION_PLAN.md) - Piano marketing e vendita operativo

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Next.js API Routes, Supabase
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **AI:** OpenAI GPT-4
- **Voice:** Bland AI
- **Monitoring:** Sentry

---

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Performance tests
npm run perf:all
```

---

## 📦 Scripts Disponibili

```bash
# Development
npm run dev          # Start dev server
npm run dev:clean    # Libera 3000–3002 e avvia su porta 3000 (Windows / porte occupate)
npm run dev:free-port # Solo kill porte 3000–3002
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run unit tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
npm run test:e2e     # E2E tests

# Performance
npm run perf:lighthouse # Lighthouse CI
npm run perf:api       # API benchmark
npm run perf:load      # Load testing
npm run analyze        # Bundle analysis
```

---

## 🔒 Sicurezza

- ✅ Input validation (Zod)
- ✅ SQL injection protection (Supabase)
- ✅ XSS protection
- ✅ Rate limiting
- ✅ Security headers
- ✅ Secure logging

---

## 📈 Performance

- ✅ Lazy loading
- ✅ Code splitting
- ✅ Image optimization (AVIF, WebP)
- ✅ Bundle optimization
- ✅ Core Web Vitals tracking

---

## 🌍 Internationalization

Supporto per:
- 🇮🇹 Italiano
- 🇬🇧 English
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇸🇦 العربية

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

---

## 📞 Support

- Email: support@propilot.ai
- GitHub Issues: https://github.com/your-org/propilot-ai/issues

---

**Made with ❤️ by PropertyPilot AI Team**
