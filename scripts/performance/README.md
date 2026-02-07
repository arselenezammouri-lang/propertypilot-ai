# Performance Testing Scripts

Scripts per testare le performance di PropertyPilot AI.

## Scripts Disponibili

### 1. `api-benchmark.js`
Testa i tempi di risposta delle API critiche.

```bash
npm run perf:api
# oppure
node scripts/performance/api-benchmark.js
```

### 2. `load-test.js`
Test di carico con K6.

```bash
npm run perf:load
# oppure
k6 run scripts/performance/load-test.js
```

### 3. `bundle-analysis.js`
Analizza le dimensioni del bundle.

```bash
npm run analyze
npm run build
node scripts/performance/bundle-analysis.js
```

### 4. `web-vitals-check.js`
Verifica che i Web Vitals siano tracciati.

```bash
node scripts/performance/web-vitals-check.js
```

## Requisiti

- Node.js 18+
- Server dev in esecuzione (per alcuni test)
- K6 installato (per load testing): `npm install -g k6`

## Note

- Alcuni test richiedono che il server sia in esecuzione
- I test di API possono fallire senza autenticazione (normale)
- I risultati vengono salvati in file JSON per analisi successive
