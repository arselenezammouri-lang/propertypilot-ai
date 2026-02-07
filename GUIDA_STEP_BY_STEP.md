# 🎯 Guida Step-by-Step - Test Manuali

**Seguiamo il piano operativo fase per fase**

---

## 🚀 STEP 0: Avvio Server

✅ **Server avviato in background**

**Verifica:**
1. Apri browser: http://localhost:3000
2. Se vedi la homepage → ✅ Server OK
3. Se vedi errore → Attendi 10-15 secondi e ricarica

---

## 📋 FASE 1: Test Design System (30 min)

### ✅ STEP 1.1: Homepage (`/`)

**Apri:** http://localhost:3000

**Checklist:**
- [ ] **Logo:** Visibile in alto? Dimensioni corrette?
- [ ] **Background:** Nero assoluto? (F12 → Elements → body → background-color deve essere `rgb(0, 0, 0)`)
- [ ] **Font:** Inter/Geist? (F12 → Elements → body → font-family deve contenere "Inter" o "Geist")
- [ ] **Bordi:** Cards/inputs hanno bordi 1px?
- [ ] **Badge:** 💎 SOLDI e 🔥 TOP DEAL visibili? (se presenti nella pagina)
- [ ] **Spacing:** Elementi ben spaziati?
- [ ] **Buttons:** Stile corretto, hover funziona?

**Come verificare background:**
1. F12 (apri DevTools)
2. Tab "Elements"
3. Clicca su `<body>`
4. Nel pannello "Styles", cerca `background-color`
5. Deve essere `rgb(0, 0, 0)` o `#000000`

**Come verificare font:**
1. F12 → Elements → `<body>`
2. Nel pannello "Styles", cerca `font-family`
3. Deve contenere "Inter" o "Geist"

**Screenshot:** Salva `screenshot-homepage.png` (opzionale)

---

### ✅ STEP 1.2: Dashboard (`/dashboard`)

**Apri:** http://localhost:3000/dashboard  
*(Se richiede login, fai login prima)*

**Checklist:**
- [ ] **Logo:** Visibile nella sidebar/header?
- [ ] **Background:** Nero assoluto? (verifica con F12)
- [ ] **Font:** Inter/Geist? (verifica con F12)
- [ ] **Badge:** 💎 SOLDI e 🔥 TOP DEAL su leads/deals? (se presenti)
- [ ] **Cards:** Bordi 1px, spacing consistente?
- [ ] **Navigation:** Sidebar funziona? Active state corretto?

**Screenshot:** Salva `screenshot-dashboard.png` (opzionale)

---

### ✅ STEP 1.3: Pricing (`/pricing`)

**Apri:** http://localhost:3000/pricing

**Checklist:**
- [ ] **Logo:** Visibile?
- [ ] **Background:** Nero assoluto?
- [ ] **Font:** Inter/Geist?
- [ ] **Cards Pricing:** Allineate, bordi 1px?
- [ ] **Buttons:** "Get Started" funziona? (non cliccare ancora, solo verificare che esista)

**Screenshot:** Salva `screenshot-pricing.png` (opzionale)

---

### ✅ STEP 1.4: Pagine Dashboard (Verifica Rapida)

**Per ogni pagina, verifica:**
- [ ] Background nero
- [ ] Font Inter
- [ ] Logo visibile
- [ ] Design consistente

**Pagine da verificare (apri una per una):**
1. [ ] `/dashboard/listings`
2. [ ] `/dashboard/leads` (verificare badge 💎 SOLDI e 🔥 TOP DEAL)
3. [ ] `/dashboard/prospecting` (verificare badge)
4. [ ] `/dashboard/generate-comprehensive`
5. [ ] `/dashboard/perfect-copy`
6. [ ] `/dashboard/analyze`
7. [ ] `/dashboard/scraper`
8. [ ] `/dashboard/emotional-listing`
9. [ ] `/dashboard/social-posts`
10. [ ] `/dashboard/agent-bio`

**Tempo stimato:** 30 minuti totali

---

## 🔍 COME SEGNALARE PROBLEMI

Se trovi un problema:

1. **Screenshot:** Fai screenshot del problema
2. **Descrizione:** Descrivi cosa non va
3. **Pagina:** Indica quale pagina
4. **Dettagli:** Se possibile, indica cosa dovrebbe essere vs cosa vedi

**Esempio:**
```
PROBLEMA TROVATO:
- Pagina: /dashboard/leads
- Problema: Background non è nero, è grigio scuro
- Dovrebbe essere: #000000
- È: #1a1a1a
```

---

## ✅ DOPO FASE 1

Quando hai completato la Fase 1:

1. **Segnala:** Dimmi se hai trovato problemi o se tutto è OK
2. **Procediamo:** Passiamo alla Fase 2 (Navigation)

---

## 📝 NOTE

- **Non avere fretta:** Prenditi il tempo necessario
- **Verifica tutto:** Meglio controllare due volte che saltare qualcosa
- **Screenshot utili:** Se possibile, fai screenshot delle pagine principali

---

**🚀 Inizia ora con STEP 1.1: Homepage!**

Apri http://localhost:3000 e inizia a verificare! 🎯
