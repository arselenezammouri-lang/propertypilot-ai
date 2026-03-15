# AGENTS.md

## Cursor Cloud specific instructions

**PropertyPilot AI** is a single Next.js 14 App Router application (not a monorepo) for real-estate agents. All backend logic lives in Next.js API routes; data/auth are handled by Supabase (cloud); payments by Stripe (cloud); AI by OpenAI (cloud).

### Running the application

- **Dev server:** `npm run dev` (port 3000). Standard commands are documented in `README.md` and `package.json` scripts.
- **Environment:** Copy `.env.example` to `.env.local` before first run. The `.env.example` contains Supabase credentials needed to boot. Stripe/OpenAI keys are required only for billing and AI features.

### Lint / Test / Build

| Task | Command | Notes |
|------|---------|-------|
| Lint | `npm run lint` | ESLint via `next lint`. Warnings only (no errors). |
| Unit tests | `npm test` | Jest + Testing Library. Only `__tests__/` files are true unit tests. |
| E2E tests | `npm run test:e2e` | Playwright. Requires dev server running and Playwright browsers installed (`npx playwright install`). |
| Build | `npm run build` | Requires all env vars set; uses `cross-env NODE_OPTIONS=--max-old-space-size=8192`. |

### Gotchas

- **Jest picks up Playwright files:** The Jest `testMatch` glob (`**/?(*.)+(spec|test).[jt]s?(x)`) also matches `e2e/*.spec.ts`. These fail in Jest because they import `@playwright/test`. To run only unit tests: `npx jest --testPathPatterns='__tests__'`.
- **No Docker/DB setup required:** All data backends are cloud-managed (Supabase, Stripe, OpenAI). No local databases or containers needed.
- **Node.js version:** Requires Node 18+. The environment ships with Node 22 which works fine.
- **AI features need a real OpenAI API key:** The `.env.example` has placeholder `sk-proj_YOUR_KEY`. Without a valid key, `/api/generate` returns 503. The app boots and all non-AI pages work fine.
- **Supabase profiles table:** The `onboarding_completed` column may not exist; the onboarding wizard uses localStorage as fallback.
- **Agency branding:** Uses Neon `DATABASE_URL` directly; returns null gracefully if the DB is unreachable.
- **Stripe keys required for billing flows:** Checkout, upgrade, cancel, and webhook endpoints require valid Stripe test/live keys. The billing page loads fine on Free plan without keys.
