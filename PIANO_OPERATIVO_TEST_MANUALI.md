# 🚀 Piano Operativo - Test Manuali Pre-Launch

**PropertyPilot AI - Test Completo Prima del Lancio Live**  
**Data:** ${new Date().toLocaleDateString('it-IT')}  
**Obiettivo:** Verificare che TUTTO funzioni perfettamente prima del lancio

---

## ⏱️ Tempo Stimato: 2-3 ore

---

## 📋 FASE 1: Test Design System (30 min)

### 1.1 Homepage (`/`)
- [ ] **Logo:** Visibile, dimensioni corrette, non pixelato
- [ ] **Background:** Nero assoluto (#000000) - verificare con DevTools (F12 → Elements → body → background-color)
- [ ] **Font:** Inter/Geist - verificare con DevTools (F12 → Elements → body → font-family)
- [ ] **Bordi:** 1px su cards, inputs, buttons
- [ ] **Badge:** 💎 SOLDI e 🔥 TOP DEAL visibili (se presenti)
- [ ] **Spacing:** Consistente tra elementi
- [ ] **Buttons:** Stile allineato, hover funziona
- [ ] **Screenshot:** Salvare `screenshot-homepage.png`

**Come verificare:**
1. Apri http://localhost:3000
2. F12 → Elements → Seleziona `<body>`
3. Verifica `background-color: rgb(0, 0, 0)` o `#000000`
4. Verifica `font-family: Inter` o `Geist`

### 1.2 Dashboard (`/dashboard`)
- [ ] **Logo:** Visibile nella sidebar/header
- [ ] **Background:** Nero assoluto
- [ ] **Font:** Inter/Geist
- [ ] **Badge:** 💎 SOLDI e 🔥 TOP DEAL su leads/deals
- [ ] **Cards:** Bordi 1px, spacing consistente
- [ ] **Navigation:** Sidebar funziona, active state corretto
- [ ] **Screenshot:** Salvare `screenshot-dashboard.png`

**Come verificare:**
1. Login (se necessario)
2. Naviga a `/dashboard`
3. Verifica tutti gli elementi sopra

### 1.3 Pricing (`/pricing`)
- [ ] **Logo:** Visibile
- [ ] **Background:** Nero assoluto
- [ ] **Font:** Inter/Geist
- [ ] **Cards Pricing:** Allineate, bordi 1px
- [ ] **Buttons:** "Get Started" funziona
- [ ] **Screenshot:** Salvare `screenshot-pricing.png`

### 1.4 Pagine Dashboard (Verifica Rapida)
Per ogni pagina dashboard, verificare:
- [ ] Background nero
- [ ] Font Inter
- [ ] Logo visibile
- [ ] Design consistente

**Pagine da verificare:**
- [ ] `/dashboard/listings`
- [ ] `/dashboard/leads` (verificare badge 💎 SOLDI e 🔥 TOP DEAL)
- [ ] `/dashboard/prospecting` (verificare badge)
- [ ] `/dashboard/generate-comprehensive`
- [ ] `/dashboard/perfect-copy`
- [ ] `/dashboard/analyze`
- [ ] `/dashboard/scraper`
- [ ] `/dashboard/emotional-listing`
- [ ] `/dashboard/social-posts`
- [ ] `/dashboard/agent-bio`

**Tempo stimato:** 30 minuti

---

## 📋 FASE 2: Test Navigation (20 min)

### 2.1 Navigation Principale
- [ ] **Homepage → Dashboard:** Link funziona
- [ ] **Homepage → Pricing:** Link funziona
- [ ] **Homepage → Login:** Link funziona
- [ ] **Homepage → Signup:** Link funziona
- [ ] **Pricing → Get Started:** Link funziona
- [ ] **Login → Signup:** Link funziona
- [ ] **Signup → Login:** Link funziona

### 2.2 Navigation Dashboard
- [ ] **Sidebar Links:** Tutti funzionano
  - [ ] Dashboard
  - [ ] Listings
  - [ ] Leads
  - [ ] Prospecting
  - [ ] Generate Comprehensive
  - [ ] Perfect Copy
  - [ ] Analyze
  - [ ] Scraper
  - [ ] Emotional Listing
  - [ ] Social Posts
  - [ ] Agent Bio
  - [ ] Agency Assistant
  - [ ] Billing
  - [ ] Settings
- [ ] **Active State:** Pagina corrente evidenziata
- [ ] **Nessun 404:** Tutti i link portano a pagine esistenti

**Come verificare:**
1. Cliccare ogni link nella sidebar
2. Verificare che la pagina carichi (no 404)
3. Verificare che l'active state sia corretto

**Tempo stimato:** 20 minuti

---

## 📋 FASE 3: Test Funzionalità Core (45 min)

### 3.1 Authentication
- [ ] **Signup:**
  - [ ] Form funziona
  - [ ] Validazione email
  - [ ] Validazione password
  - [ ] Redirect dopo signup
  - [ ] Email di conferma (se configurata)
- [ ] **Login:**
  - [ ] Form funziona
  - [ ] Error handling (credenziali sbagliate)
  - [ ] Redirect dopo login
  - [ ] Session persistente (refresh page)
- [ ] **Logout:**
  - [ ] Logout funziona
  - [ ] Redirect a homepage
  - [ ] Session cancellata

### 3.2 Dashboard Features
- [ ] **Dashboard Stats:** Numeri corretti
- [ ] **Quick Actions:** Bottoni funzionano
- [ ] **Recent Activity:** Lista visibile
- [ ] **Notifications:** Se presenti, funzionano

### 3.3 Listings Management
- [ ] **Create Listing:** Form funziona
- [ ] **View Listings:** Lista carica correttamente
- [ ] **Edit Listing:** Modifica funziona
- [ ] **Delete Listing:** Eliminazione funziona
- [ ] **Search/Filter:** Se presente, funziona

### 3.4 Leads Management
- [ ] **View Leads:** Lista carica
- [ ] **Add Lead:** Form funziona
- [ ] **Lead Details:** Dettagli visibili
- [ ] **Badge 💎 SOLDI:** Visibile su lead con budget alto
- [ ] **Badge 🔥 TOP DEAL:** Visibile su deal prioritari
- [ ] **Pipeline View:** Se presente, funziona
- [ ] **Lead Enrichment:** Se presente, funziona

### 3.5 AI Generation Features
- [ ] **Generate Comprehensive:**
  - [ ] Form funziona
  - [ ] Generazione completa
  - [ ] Risultati visibili
  - [ ] Copy funziona
- [ ] **Perfect Copy:**
  - [ ] Form funziona
  - [ ] Generazione completa
  - [ ] Varianti visibili
- [ ] **Analyze Listing:**
  - [ ] URL input funziona
  - [ ] Analisi completa
  - [ ] Report visibile
- [ ] **Scraper:**
  - [ ] URL input funziona
  - [ ] Scraping completo
  - [ ] Dati estratti corretti

**Tempo stimato:** 45 minuti

---

## 📋 FASE 4: Test Stripe (30 min) ⚠️ CRITICO

### 4.1 Checkout Subscription
- [ ] **Pricing Page:**
  - [ ] Prezzi visibili e corretti
  - [ ] Button "Get Started" funziona
  - [ ] Redirect a Stripe checkout
- [ ] **Stripe Checkout:**
  - [ ] Pagina Stripe carica
  - [ ] Prezzo corretto
  - [ ] Test card funziona: `4242 4242 4242 4242`
  - [ ] Expiry: qualsiasi data futura
  - [ ] CVC: qualsiasi 3 cifre
  - [ ] ZIP: qualsiasi
  - [ ] Pagamento completato
  - [ ] Redirect a success page
- [ ] **After Payment:**
  - [ ] Subscription attiva nel dashboard
  - [ ] Features PRO sbloccate
  - [ ] Billing page mostra subscription

### 4.2 Checkout One-Time (Agency Boost)
- [ ] **Agency Boost Package:**
  - [ ] Button "Buy Now" funziona
  - [ ] Redirect a Stripe checkout
  - [ ] Prezzo corretto (€497)
  - [ ] Test card funziona
  - [ ] Pagamento completato
  - [ ] Redirect a success page
  - [ ] Package attivato

### 4.3 Webhook Test (IMPORTANTE)
- [ ] **Stripe Dashboard:**
  - [ ] Webhook endpoint configurato: `https://your-domain.com/api/stripe/webhook`
  - [ ] Eventi selezionati:
    - `checkout.session.completed`
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
- [ ] **Test Webhook:**
  - [ ] Usa Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
  - [ ] Trigger test event: `stripe trigger checkout.session.completed`
  - [ ] Verifica che webhook riceva evento
  - [ ] Verifica che DB sia aggiornato

**Come testare webhook:**
```bash
# Installa Stripe CLI se non presente
# Poi:
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In un altro terminale:
stripe trigger checkout.session.completed
```

**Tempo stimato:** 30 minuti

---

## 📋 FASE 5: Test i18n (20 min)

### 5.1 Language Switcher
- [ ] **Homepage:**
  - [ ] Language switcher visibile
  - [ ] Cambio lingua funziona
  - [ ] Contenuto cambia lingua
- [ ] **Dashboard:**
  - [ ] Language switcher funziona
  - [ ] Menu items cambiano lingua
  - [ ] Labels cambiano lingua

### 5.2 Aria Coach
- [ ] **Aria Coach:**
  - [ ] Apri Aria Coach
  - [ ] Cambia lingua browser (Chrome: Settings → Languages)
  - [ ] Verifica che Aria Coach cambi lingua
  - [ ] Test con lingue:
    - [ ] Italiano (IT)
    - [ ] Inglese (EN)
    - [ ] Spagnolo (ES)
    - [ ] Francese (FR)
    - [ ] Tedesco (DE)
    - [ ] Arabo (AR)

### 5.3 Contenuti Multi-Lingua
- [ ] **Homepage:**
  - [ ] Testo cambia con lingua
  - [ ] CTA cambiano lingua
- [ ] **Dashboard:**
  - [ ] Labels cambiano lingua
  - [ ] Messaggi cambiano lingua
- [ ] **Forms:**
  - [ ] Placeholder cambiano lingua
  - [ ] Error messages cambiano lingua

**Tempo stimato:** 20 minuti

---

## 📋 FASE 6: Test Responsive (15 min)

### 6.1 Mobile (375px - iPhone)
- [ ] **Homepage:** Layout corretto
- [ ] **Dashboard:** Sidebar collassa, menu hamburger funziona
- [ ] **Forms:** Inputs leggibili, buttons cliccabili
- [ ] **Navigation:** Menu mobile funziona

### 6.2 Tablet (768px - iPad)
- [ ] **Homepage:** Layout corretto
- [ ] **Dashboard:** Layout adattato
- [ ] **Forms:** Tutto leggibile

### 6.3 Desktop (1920px)
- [ ] **Homepage:** Layout corretto, niente elementi troppo larghi
- [ ] **Dashboard:** Layout ottimizzato
- [ ] **Forms:** Tutto centrato e leggibile

**Come testare:**
1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Seleziona device (iPhone, iPad, Desktop)
3. Verifica ogni pagina

**Tempo stimato:** 15 minuti

---

## 📋 FASE 7: Test Performance (10 min)

### 7.1 Lighthouse Audit
- [ ] **Homepage:**
  - [ ] Performance: > 80
  - [ ] Accessibility: > 90
  - [ ] Best Practices: > 90
  - [ ] SEO: > 80
- [ ] **Dashboard:**
  - [ ] Performance: > 70
  - [ ] Accessibility: > 90

**Come testare:**
1. F12 → Lighthouse tab
2. Seleziona "Performance", "Accessibility", "Best Practices", "SEO"
3. Click "Analyze page load"
4. Verifica score

**Tempo stimato:** 10 minuti

---

## 📋 FASE 8: Test Error Handling (15 min)

### 8.1 Error Pages
- [ ] **404 Page:**
  - [ ] Naviga a `/pagina-inesistente`
  - [ ] 404 page visibile
  - [ ] Design system rispettato
  - [ ] Link "Back to Home" funziona
- [ ] **500 Error:**
  - [ ] Simula errore (se possibile)
  - [ ] Error page visibile
  - [ ] Design system rispettato

### 8.2 Form Validation
- [ ] **Required Fields:** Error messages visibili
- [ ] **Email Validation:** Error se email non valida
- [ ] **Password Validation:** Error se password debole
- [ ] **Error Messages:** In lingua corretta

### 8.3 API Errors
- [ ] **Network Error:** Messaggio user-friendly
- [ ] **Rate Limit:** Messaggio chiaro
- [ ] **Subscription Required:** Messaggio chiaro

**Tempo stimato:** 15 minuti

---

## 📋 FASE 9: Checklist Finale Pre-Launch (10 min)

### 9.1 Environment Variables
- [ ] **Stripe:**
  - [ ] `STRIPE_SECRET_KEY` configurato (LIVE)
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` configurato (LIVE)
  - [ ] `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` configurato
  - [ ] `NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID` configurato
- [ ] **Supabase:**
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` configurato
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurato
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` configurato
- [ ] **OpenAI:**
  - [ ] `OPENAI_API_KEY` configurato
- [ ] **App URL:**
  - [ ] `NEXT_PUBLIC_APP_URL` configurato (URL produzione)

### 9.2 Database
- [ ] **RLS Policies:** Configurate correttamente
- [ ] **Tables:** Tutte create
- [ ] **Indexes:** Ottimizzati

### 9.3 Stripe Webhook
- [ ] **Endpoint:** Configurato in Stripe Dashboard
- [ ] **Events:** Tutti selezionati
- [ ] **Secret:** Configurato in `.env.local`

### 9.4 Monitoring
- [ ] **Sentry:** DSN configurato (opzionale ma raccomandato)
- [ ] **Analytics:** Configurato (se presente)

### 9.5 Build Production
- [ ] **Build:** `npm run build` funziona senza errori
- [ ] **Start:** `npm start` funziona
- [ ] **No Console Errors:** Nessun errore in console

**Tempo stimato:** 10 minuti

---

## 📊 RIEPILOGO TEMPI

| Fase | Tempo |
|------|-------|
| 1. Design System | 30 min |
| 2. Navigation | 20 min |
| 3. Funzionalità Core | 45 min |
| 4. Stripe | 30 min |
| 5. i18n | 20 min |
| 6. Responsive | 15 min |
| 7. Performance | 10 min |
| 8. Error Handling | 15 min |
| 9. Checklist Finale | 10 min |
| **TOTALE** | **~3 ore** |

---

## ✅ CRITERI DI SUCCESSO

Prima di andare live, TUTTI questi criteri devono essere ✅:

- [ ] ✅ Design system perfetto su tutte le pagine
- [ ] ✅ Nessun 404
- [ ] ✅ Tutte le funzionalità core funzionano
- [ ] ✅ Stripe checkout funziona (test + live)
- [ ] ✅ Webhook Stripe configurato e testato
- [ ] ✅ i18n funziona correttamente
- [ ] ✅ Responsive su mobile/tablet/desktop
- [ ] ✅ Performance > 70
- [ ] ✅ Error handling corretto
- [ ] ✅ Build production senza errori
- [ ] ✅ Environment variables configurate

---

## 🚀 DOPO I TEST

Se tutti i test sono ✅:

1. **Build Production:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Push su repository
   - Deploy su piattaforma (Vercel/Replit/etc.)

3. **Test Live:**
   - Verifica homepage live
   - Test checkout live (con carta test)
   - Verifica webhook live

4. **Monitor:**
   - Monitora Sentry per errori
   - Monitora Stripe per pagamenti
   - Monitora analytics

---

## 📝 NOTE IMPORTANTI

- ⚠️ **Stripe:** Usa sempre carte TEST prima di testare con carte reali
- ⚠️ **Webhook:** Configura webhook LIVE in Stripe Dashboard prima del lancio
- ⚠️ **Environment:** Verifica che tutte le variabili siano LIVE (non test)
- ⚠️ **Database:** Backup database prima del lancio
- ⚠️ **Monitoring:** Configura Sentry per monitorare errori live

---

**Buona fortuna con il lancio! 🚀**
