# 🔄 CI/CD Documentation - PropertyPilot AI

**Versione:** 1.0.0  
**Ultimo aggiornamento:** ${new Date().toISOString()}

---

## 📋 Overview

CI/CD pipeline automatizzata con GitHub Actions per:
- ✅ Lint e type checking
- ✅ Unit tests
- ✅ Build verification
- ✅ E2E tests (opzionale)
- ✅ Security audit
- ✅ Performance tests (scheduled)
- ✅ Auto-deploy (opzionale)

---

## 🔧 Setup GitHub Actions

### 1. Secrets Necessari

Vai a **Settings → Secrets and variables → Actions** e aggiungi:

#### Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

#### Optional (per E2E)
- `E2E_TEST_EMAIL` - Email utente test
- `E2E_TEST_PASSWORD` - Password utente test

#### Optional (per Deploy)
- `VERCEL_TOKEN` - Se usi Vercel
- `VERCEL_ORG_ID` - Vercel org ID
- `VERCEL_PROJECT_ID` - Vercel project ID

---

## 📁 Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Trigger:**
- Push su `main` o `master`
- Pull request su `main` o `master`

**Jobs:**

1. **Lint & Type Check**
   - ESLint
   - TypeScript type check

2. **Unit Tests**
   - Jest tests
   - Coverage upload (Codecov)

3. **Build Check**
   - Verifica che build funzioni
   - Usa secrets per env vars

4. **E2E Tests** (solo su PR)
   - Playwright tests
   - Upload test results

5. **Security Audit**
   - npm audit
   - Fail su vulnerabilità high

6. **Deploy** (solo su main/master)
   - Build production
   - Deploy (configurare in base a piattaforma)

---

### 2. Performance Tests (`.github/workflows/performance.yml`)

**Trigger:**
- Scheduled: Ogni domenica alle 2 AM UTC
- Manual: `workflow_dispatch`

**Jobs:**

1. **Lighthouse CI**
   - Build app
   - Run Lighthouse tests
   - Upload results

---

## 🚀 Come Funziona

### Su Pull Request

1. **Lint** → Verifica codice
2. **Tests** → Esegue unit tests
3. **Build** → Verifica build
4. **E2E** → Esegue E2E tests (opzionale)
5. **Security** → Audit dipendenze

Se tutto passa → PR può essere merged

### Su Merge in Main

1. Tutti i check sopra
2. **Deploy** → Deploy automatico (se configurato)

---

## 🔍 Status Badge

Aggiungi questo al tuo README:

```markdown
![CI](https://github.com/your-org/propilot-ai/workflows/CI/badge.svg)
```

---

## 🛠️ Customizzazione

### Aggiungere Deploy Step

Modifica `.github/workflows/ci.yml`:

```yaml
- name: Deploy to Your Platform
  uses: your-deploy-action
  with:
    token: ${{ secrets.DEPLOY_TOKEN }}
```

### Cambiare Schedule Performance

Modifica `.github/workflows/performance.yml`:

```yaml
schedule:
  - cron: '0 2 * * 0'  # Ogni domenica
  # Altri esempi:
  # - cron: '0 0 * * *'  # Ogni giorno
  # - cron: '0 0 * * 1'  # Ogni lunedì
```

---

## 📊 Monitoring

### GitHub Actions

- Vai a **Actions** tab
- Vedi status di tutti i workflow
- Click su run per dettagli

### Codecov (Coverage)

- Coverage report automatico
- Badge nel README
- Trend nel tempo

---

## ⚠️ Troubleshooting

### Build Fails

- Verifica che tutti i secrets siano settati
- Verifica che env vars siano corrette
- Controlla logs in Actions tab

### Tests Fail

- Verifica che test passino localmente
- Controlla che secrets E2E siano settati (se necessario)

### Deploy Fails

- Verifica deploy token/credentials
- Controlla che piattaforma di deploy sia accessibile

---

## 🎯 Best Practices

1. **Non committare secrets** - Usa sempre GitHub Secrets
2. **Fail fast** - Se lint fallisce, non eseguire tests
3. **Cache dependencies** - Usa `cache: 'npm'` per velocità
4. **Parallel jobs** - Esegui jobs in parallelo quando possibile
5. **Conditional deploy** - Deploy solo su main/master

---

## 📝 Checklist

- [ ] Secrets configurati in GitHub
- [ ] Workflow files committati
- [ ] Test workflow eseguito manualmente
- [ ] Deploy configurato (se necessario)
- [ ] Status badge aggiunto al README

---

**Status:** ✅ **Configurato e Pronto**

**Prossimo Step:** Testare workflow con un PR o push.
