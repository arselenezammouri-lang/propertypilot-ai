# 🚀 Performance Testing Guide - PropertyPilot AI

**Data:** ${new Date().toLocaleDateString('it-IT')}

---

## 📋 Overview

Guida completa per testare le performance dell'applicazione PropertyPilot AI.

---

## 🛠️ Strumenti Configurati

### 1. Lighthouse CI
- **Scopo:** Test performance frontend (Core Web Vitals)
- **Installato:** ✅ `@lhci/cli`
- **Config:** `lighthouserc.js`

### 2. K6 Load Testing
- **Scopo:** Test di carico e scalabilità
- **Installato:** ✅ `k6`
- **Script:** `scripts/performance/load-test.js`

### 3. API Benchmark
- **Scopo:** Test tempi di risposta API
- **Script:** `scripts/performance/api-benchmark.js`

### 4. Bundle Analysis
- **Scopo:** Analisi dimensioni bundle
- **Script:** `scripts/performance/bundle-analysis.js`
- **Tool:** `@next/bundle-analyzer` (già configurato)

### 5. Web Vitals Check
- **Scopo:** Verifica tracking Core Web Vitals
- **Script:** `scripts/performance/web-vitals-check.js`

---

## 🚀 Come Eseguire i Test

### 1. Lighthouse CI (Frontend Performance)

```bash
# Esegue test su tutte le pagine configurate
npm run perf:lighthouse
```

**Cosa testa:**
- Core Web Vitals (LCP, FID, CLS)
- Performance Score
- Accessibility
- Best Practices
- SEO

**Thresholds configurati:**
- Performance: ≥ 70
- Accessibility: ≥ 90
- Best Practices: ≥ 80
- SEO: ≥ 80
- LCP: < 2.5s
- FCP: < 2s
- CLS: < 0.1
- TBT: < 300ms

---

### 2. API Benchmark

```bash
# Testa tempi di risposta API
npm run perf:api
```

**Cosa testa:**
- Tempo di risposta per endpoint critici
- P50, P95, P99 percentili
- Success rate
- Dimensione risposta

**Endpoint testati:**
- `/api/health` - Health check
- `/api/generate-comprehensive` - Generazione AI (richiede auth)

**Metriche target:**
- P50: < 200ms (endpoint semplici)
- P95: < 500ms (endpoint normali)
- P99: < 1000ms (endpoint critici)
- Success rate: 100%

---

### 3. Load Testing (K6)

```bash
# Test di carico
npm run perf:load

# Con URL personalizzato
BASE_URL=https://your-domain.com k6 run scripts/performance/load-test.js
```

**Scenario di test:**
1. Ramp up: 0 → 10 utenti (30s)
2. Stabile: 10 utenti (1m)
3. Ramp up: 10 → 20 utenti (30s)
4. Stabile: 20 utenti (1m)
5. Ramp down: 20 → 0 utenti (30s)

**Thresholds:**
- P95 response time: < 500ms
- P99 response time: < 1000ms
- Error rate: < 1%

**Endpoint testati:**
- `/api/health`
- `/` (homepage)
- `/pricing`

---

### 4. Bundle Analysis

```bash
# 1. Build con analisi
npm run analyze

# 2. Build normale
npm run build

# 3. Analizza risultati
node scripts/performance/bundle-analysis.js
```

**Cosa analizza:**
- Dimensione totale bundle
- Top 10 chunk più grandi
- Top 10 dipendenze più grandi
- Opportunità di ottimizzazione

**Target:**
- Total bundle: < 5MB
- Gzipped bundle: < 2MB
- Singoli chunk: < 500KB

---

### 5. Web Vitals Check

```bash
# Verifica che i Web Vitals siano tracciati
node scripts/performance/web-vitals-check.js
```

**Cosa verifica:**
- Endpoint `/api/analytics/web-vitals` funzionante
- Endpoint `/api/analytics/track` funzionante

---

## 📊 Risultati Attesi

### Frontend (Lighthouse)

| Metric | Target | Good | Needs Improvement |
|--------|--------|------|-------------------|
| Performance Score | ≥ 70 | ≥ 90 | < 70 |
| LCP | < 2.5s | < 2.0s | > 2.5s |
| FCP | < 2.0s | < 1.5s | > 2.0s |
| CLS | < 0.1 | < 0.05 | > 0.1 |
| TBT | < 300ms | < 200ms | > 300ms |

### API Response Times

| Endpoint Type | P50 | P95 | P99 |
|---------------|-----|-----|-----|
| Simple (Health) | < 100ms | < 200ms | < 500ms |
| Normal (API) | < 200ms | < 500ms | < 1000ms |
| Complex (AI) | < 2000ms | < 5000ms | < 10000ms |

### Load Testing

| Metric | Target |
|--------|--------|
| P95 Response Time | < 500ms |
| P99 Response Time | < 1000ms |
| Error Rate | < 1% |
| Throughput | > 10 req/s |

---

## 🔍 Analisi e Ottimizzazioni

### Se Performance Score < 70

1. **Ottimizzare immagini:**
   - Usare formato WebP/AVIF
   - Lazy loading
   - Responsive images

2. **Code splitting:**
   - Lazy load routes
   - Dynamic imports per componenti pesanti

3. **Bundle size:**
   - Rimuovere dipendenze non usate
   - Tree shaking
   - Minificazione

### Se API Response Time > Target

1. **Database:**
   - Verificare query lente
   - Aggiungere indici
   - Query optimization

2. **Caching:**
   - Implementare caching per dati statici
   - Redis per sessioni
   - CDN per assets statici

3. **External APIs:**
   - Verificare tempi OpenAI
   - Implementare retry logic
   - Timeout appropriati

### Se Load Test Fallisce

1. **Scalabilità:**
   - Verificare limiti database
   - Considerare connection pooling
   - Horizontal scaling

2. **Rate Limiting:**
   - Verificare che funzioni
   - Aggiustare limiti se necessario

---

## 📈 Monitoring Continuo

### In Produzione

1. **Sentry Performance:**
   - Transaction monitoring
   - Slow query detection
   - Error tracking

2. **Web Vitals API:**
   - Tracking automatico Core Web Vitals
   - Dashboard analytics

3. **Custom Metrics:**
   - API response times
   - Database query times
   - External API calls

---

## 🎯 Checklist Pre-Launch

- [ ] Lighthouse score ≥ 70 su tutte le pagine principali
- [ ] API P95 < 500ms per endpoint critici
- [ ] Load test passa con 20 utenti simultanei
- [ ] Bundle size < 5MB (uncompressed)
- [ ] Bundle size < 2MB (gzipped)
- [ ] Web Vitals tracking funzionante
- [ ] Performance monitoring configurato in Sentry

---

## 📝 Report Template

Dopo ogni test, documentare:

```markdown
## Performance Test - [Data]

### Lighthouse Results
- Homepage: [score]
- Dashboard: [score]
- Pricing: [score]

### API Benchmark
- Health: P95=[time]ms
- Generate: P95=[time]ms

### Load Test
- Max users: [number]
- P95: [time]ms
- Error rate: [percentage]

### Bundle Size
- Total: [size]
- Gzipped: [size]
- Largest chunk: [name] ([size])
```

---

**Status:** ✅ **Configurato e Pronto**

**Prossimo Step:** Eseguire i test e analizzare i risultati.
