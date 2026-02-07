# 🎨 Step 2: Test Manuale Design - PropertyPilot AI

**Status:** 🟡 **IN PROGRESS**  
**Obiettivo:** Verificare che design system sia perfetto e allineato su TUTTE le pagine

---

## 📋 Checklist Design System

### Logo & Branding
- [ ] Logo presente su homepage (`/`)
- [ ] Logo presente su dashboard (`/dashboard`)
- [ ] Logo presente su pricing (`/pricing`)
- [ ] Logo presente su login (`/auth/login`)
- [ ] Logo presente su signup (`/auth/signup`)
- [ ] Logo presente su tutte le pagine dashboard
- [ ] Logo dimensioni corrette (non pixelato, non distorto)
- [ ] Favicon visibile nel browser
- [ ] Logo SVG funziona correttamente

### Background & Colors
- [ ] Background nero assoluto (#000000) su homepage
- [ ] Background nero assoluto (#000000) su dashboard
- [ ] Background nero assoluto (#000000) su pricing
- [ ] Background nero assoluto (#000000) su tutte le pagine
- [ ] Nessun grigio scuro come background
- [ ] Colori brand consistenti (viola, ciano, oro)

### Typography
- [ ] Font Inter/Geist su homepage
- [ ] Font Inter/Geist su dashboard
- [ ] Font Inter/Geist su tutte le pagine
- [ ] Nessun font system default visibile
- [ ] Text rendering smooth (antialiased)

### Borders & Spacing
- [ ] Bordi 1px consistenti su cards
- [ ] Bordi 1px consistenti su inputs
- [ ] Bordi 1px consistenti su buttons
- [ ] Spacing consistente tra elementi
- [ ] Padding consistente

### Badges & Special Elements
- [ ] Badge 💎 SOLDI visibile e corretto
- [ ] Badge 🔥 TOP DEAL visibile e corretto
- [ ] Badge animazioni funzionano
- [ ] Gradient text funziona
- [ ] Glow effects funzionano

### Components Consistency
- [ ] Button styles allineati ovunque
- [ ] Input styles allineati ovunque
- [ ] Card styles allineati ovunque
- [ ] Modal/Dialog styles allineati
- [ ] Toast/Notification styles allineati
- [ ] Loading states (skeleton) consistenti
- [ ] Error states consistenti
- [ ] Empty states consistenti

---

## 🔍 Pagine da Verificare

### Pubbliche
1. **Homepage** (`/`)
   - Logo, background, font, badges
   
2. **Pricing** (`/pricing`)
   - Logo, background, font, cards, buttons
   
3. **Login** (`/auth/login`)
   - Logo, background, font, form
   
4. **Signup** (`/auth/signup`)
   - Logo, background, font, form

### Dashboard (Richiede Login)
5. **Dashboard Main** (`/dashboard`)
   - Logo, background, font, cards, badges
   
6. **Listings** (`/dashboard/listings`)
   - Logo, background, font, table/cards
   
7. **Leads** (`/dashboard/leads`)
   - Logo, background, font, badges 💎 SOLDI e 🔥 TOP DEAL
   
8. **Prospecting** (`/dashboard/prospecting`)
   - Logo, background, font, badges
   
9. **Generate Comprehensive** (`/dashboard/generate-comprehensive`)
   - Logo, background, font, form
   
10. **Perfect Copy** (`/dashboard/perfect-copy`)
    - Logo, background, font, form

---

## 📸 Screenshot Checklist

Per ogni pagina, fare screenshot e verificare:
- [ ] Logo visibile e corretto
- [ ] Background nero (#000000)
- [ ] Font Inter/Geist
- [ ] Bordi 1px
- [ ] Badges visibili (se presenti)
- [ ] Design system rispettato

---

## 🐛 Problemi Comuni da Cercare

1. **Background grigio invece di nero**
   - Cercare: `bg-gray-900`, `bg-slate-900`, `bg-zinc-900`
   - Dovrebbe essere: `bg-black` o `diamond-force-black`

2. **Font system default**
   - Cercare: `font-sans` senza Inter/Geist
   - Dovrebbe essere: `font-inter` o `font-geist`

3. **Bordi spessi**
   - Cercare: `border-2`, `border-4`
   - Dovrebbe essere: `border` (1px) o `diamond-border`

4. **Logo mancante o distorto**
   - Verificare path `/logo.png`
   - Verificare dimensioni corrette

5. **Badge mancanti**
   - Verificare che 💎 SOLDI e 🔥 TOP DEAL siano visibili
   - Verificare animazioni

---

## ✅ Verifica Rapida

### Comando per verificare design system importato:
```bash
# Verificare che design-system.css sia importato
grep -r "design-system.css" app/
```

### Comando per verificare background nero:
```bash
# Cercare pagine senza bg-black
grep -r "bg-gray\|bg-slate\|bg-zinc" app/ --exclude-dir=node_modules
```

### Comando per verificare font:
```bash
# Verificare che Inter sia usato
grep -r "font-inter\|font-geist\|Inter" app/layout.tsx
```

---

## 📝 Note

- Alcune pagine potrebbero avere navigation inline (normale)
- Verificare anche su mobile (responsive)
- Verificare anche su tablet
- Verificare dark mode (se presente)

---

**Status:** ⏳ **DA FARE**

**Prossimo:** Eseguire test manuale pagina per pagina.
