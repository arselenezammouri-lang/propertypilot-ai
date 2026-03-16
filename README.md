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

# Run development server
npm run dev
```

Apri http://localhost:3000

Per setup completo, vedi [docs/SETUP.md](./docs/SETUP.md)

---

## 📚 Documentazione

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
