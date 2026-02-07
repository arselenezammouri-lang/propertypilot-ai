# 🔧 Fix Console.log - PropertyPilot AI

**Priorità:** ALTA  
**Tempo stimato:** 30-45 minuti  
**Files da fixare:** 17

---

## 📋 Files da Fixare

1. `app/api/agency-chatbot/route.ts`
2. `app/api/analyze-link/route.ts`
3. `app/api/audit-listing/route.ts`
4. `app/api/communications/send-email/route.ts`
5. `app/api/contact/route.ts`
6. `app/api/generate-pdf/route.ts`
7. `app/api/generate-perfect-copy/route.ts`
8. `app/api/generate-social-post/route.ts`
9. `app/api/generate-titles/route.ts`
10. `app/api/leads/enrich/route.ts`
11. `app/api/notifications/test/route.ts`
12. `app/api/scrape-listing/route.ts`
13. `app/api/stripe/checkout-oneshot/route.ts`
14. `app/api/stripe/sync/route.ts`
15. `app/api/stripe/upgrade/route.ts`
16. `app/api/user/subscription/route.ts`

---

## 🔄 Sostituzioni da Fare

### Pattern 1: console.log → logger.debug
```typescript
// PRIMA
console.log('Message', data);

// DOPO
import { logger } from '@/lib/utils/safe-logger';
logger.debug('Message', { data });
```

### Pattern 2: console.error → logger.error
```typescript
// PRIMA
console.error('Error', error);

// DOPO
import { logger } from '@/lib/utils/safe-logger';
logger.error('Error', error, { context });
```

### Pattern 3: console.warn → logger.warn
```typescript
// PRIMA
console.warn('Warning', data);

// DOPO
import { logger } from '@/lib/utils/safe-logger';
logger.warn('Warning', { data });
```

---

## ✅ Checklist

- [ ] File 1: agency-chatbot
- [ ] File 2: analyze-link
- [ ] File 3: audit-listing
- [ ] File 4: send-email
- [ ] File 5: contact
- [ ] File 6: generate-pdf
- [ ] File 7: generate-perfect-copy
- [ ] File 8: generate-social-post
- [ ] File 9: generate-titles
- [ ] File 10: leads/enrich
- [ ] File 11: notifications/test
- [ ] File 12: scrape-listing
- [ ] File 13: stripe/checkout-oneshot
- [ ] File 14: stripe/sync
- [ ] File 15: stripe/upgrade
- [ ] File 16: user/subscription

---

## 🧪 Test Dopo Fix

```bash
# Ri-eseguire audit
npm run audit:prelaunch

# Verificare che non ci siano più console.log
grep -r "console.log" app/api --exclude-dir=node_modules
```

---

**Status:** ⏳ **DA FARE**
