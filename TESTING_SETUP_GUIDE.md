# 🧪 TESTING SETUP GUIDE - PropertyPilot AI

**Status:** ✅ Configurazione pronta | ⏳ Test da scrivere

---

## 📋 COSA È STATO FATTO

### ✅ **1. Configurazione Jest**
- ✅ `jest.config.js` - Configurazione completa
- ✅ `jest.setup.js` - Setup con mocks (Next.js router, Supabase)
- ✅ Scripts in `package.json`:
  - `npm test` - Run tests
  - `npm test:watch` - Watch mode
  - `npm test:coverage` - Coverage report

### ✅ **2. Test Esempio**
- ✅ `__tests__/lib/utils/retry.test.ts` - Test retry utility
- ✅ `__tests__/lib/utils/safe-logger.test.ts` - Test logger
- ✅ `__tests__/components/ui/button.test.tsx` - Test componente

---

## 🚀 INSTALLAZIONE (5 minuti)

### **STEP 1: Install Dependencies**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

### **STEP 2: Verifica Setup**
```bash
npm test
```

Dovresti vedere i test eseguirsi con successo.

---

## 📝 **TEST DA SCRIVERE** (Priorità)

### **🔴 CRITICI (Settimana 1)**

#### **1. API Routes**
- [ ] `app/api/stripe/checkout/route.ts` - Checkout flow
- [ ] `app/api/stripe/webhook/route.ts` - Webhook handling
- [ ] `app/api/auth/setup-user/route.ts` - User setup
- [ ] `app/api/aria/chat/route.ts` - Chat validation

#### **2. Utility Functions**
- [ ] `lib/utils/retry.ts` - ✅ Già fatto
- [ ] `lib/utils/safe-logger.ts` - ✅ Già fatto
- [ ] `lib/utils/subscription-check.ts` - Subscription logic
- [ ] `lib/utils/rate-limit.ts` - Rate limiting

#### **3. Components Critici**
- [ ] `components/ui/button.tsx` - ✅ Già fatto
- [ ] `components/error-boundary.tsx` - Error handling
- [ ] `components/aria-coach.tsx` - Chat functionality
- [ ] `components/usage-indicator.tsx` - Usage display

---

### **🟡 IMPORTANTI (Settimana 2)**

#### **4. Business Logic**
- [ ] `lib/stripe/config.ts` - Plan configuration
- [ ] `lib/ai/aria-brain.ts` - AI prompt building
- [ ] `lib/utils/validate.ts` - Input validation

#### **5. Hooks**
- [ ] `hooks/use-usage-limits.ts` - Usage tracking
- [ ] `lib/hooks/use-retry-fetch.ts` - Retry fetch

---

### **🟢 NICE TO HAVE (Settimana 3)**

#### **6. E2E Tests (Playwright)**
- [ ] Signup flow completo
- [ ] Checkout flow completo
- [ ] Onboarding flow

---

## 📊 **COVERAGE TARGET**

### **Minimo (MVP)**
- **Utility functions:** 80%+
- **API routes critici:** 70%+
- **Components critici:** 60%+

### **Ideale (Production)**
- **Tutto il codice:** 80%+
- **Business logic:** 90%+
- **API routes:** 85%+

---

## 🎯 **TEST PATTERNS**

### **API Route Test**
```typescript
import { POST } from '@/app/api/test/route';
import { NextRequest } from 'next/server';

describe('POST /api/test', () => {
  it('should return 200 on success', async () => {
    const request = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    });
    
    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

### **Component Test**
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## ✅ **CI/CD INTEGRATION**

### **GitHub Actions Example**
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

---

## ✅ **CONCLUSIONE**

**Setup:** ✅ COMPLETO  
**Installazione:** ⏳ Richiede npm install  
**Test da scrivere:** ~20-30 test critici

**Una volta installato, avrai:**
- ✅ Confidence nel deploy
- ✅ Prevenzione regressioni
- ✅ Documentazione vivente
- ✅ Velocità sviluppo

**Il SaaS sarà TESTATO e BLINDATO!** 🛡️
