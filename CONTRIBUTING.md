# Contributing to PropertyPilot AI

Thank you for your interest in contributing!

## Development Setup

```bash
git clone https://github.com/arselenezammouri-lang/propertypilot-ai.git
cd propertypilot-ai
npm install
cp .env.example .env.local
npm run dev
```

## Code Standards

- **TypeScript:** Strict mode. Never use `any` or `@ts-ignore`.
- **Commits:** Conventional commits: `feat(scope):`, `fix(scope):`, `docs:`, `refactor:`.
- **Validation:** All API inputs validated with Zod.
- **Colors:** Semantic tokens only (`text-foreground`, not `text-black`).
- **i18n:** All user-facing strings via the i18n system. 6 languages: IT, EN, FR, ES, DE, PT.

## Before Submitting

1. `npx tsc --noEmit` — zero errors
2. `npm run build` — must pass
3. `npm run lint` — no new warnings
4. Test your changes manually

## Pull Request Process

1. Create a feature branch from `main`
2. Write descriptive commit messages
3. Update documentation if needed
4. Fill out the PR template
5. Request review

## Reporting Issues

Use GitHub Issues with the appropriate template:
- **Bug Report:** Include steps to reproduce, expected vs actual behavior
- **Feature Request:** Describe the use case and proposed solution
- **Security:** Email security@propertypilotai.com (do NOT create public issues)
