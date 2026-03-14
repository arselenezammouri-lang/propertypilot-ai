# Comandi test dalla terminale – 0 fail

Tutto dalla **terminale di Cursor**, senza uscire dall’IDE.

---

## 1. Un solo setup (una volta)

Crea il file delle credenziali di test (email/password di un utente esistente su https://propertypilot-ai.vercel.app):

```powershell
copy .env.test.example .env.test
```

Apri `.env.test` e compila:

- `TEST_EMAIL` = 
- `TEST_PASSWORD` = password di quell’account

Salva il file.

---

## 2. Eseguire tutti i test automatizzabili (0 fail)

Dalla **root del progetto** in Cursor (Terminal → New Terminal):

```powershell
npm run test:smoke
```

Questo comando:

1. Legge `BASE_URL`, `TEST_EMAIL`, `TEST_PASSWORD` da `.env.test` (e poi da `.env.local` se esiste).
2. Esegue **system smoke test** (pagine pubbliche, auth, dashboard, API generate-titles).
3. Esegue **Stripe smoke test** (diagnose, checkout URL per Starter/Pro/Agency).

Se tutto va bene vedrai: **TUTTI I TEST AUTOMATICI SUPERATI** e exit code 0 → **0 fail**.

---

## 3. Se non hai ancora .env.test

Puoi passare le variabili a mano (stessa sessione PowerShell):

```powershell
$env:BASE_URL="https://propertypilot-ai.vercel.app"
$env:TEST_EMAIL="tua-email@esempio.com"
$env:TEST_PASSWORD="tua-password"
npm run test:smoke
```

Sostituisci con le tue credenziali di test.

---

## 4. TestSprite (MCP – non da terminale)

**TestSprite non si lancia da terminale.** È un server MCP che funziona solo nella **chat Agent** di Cursor:

1. Configura MCP: in `C:\Users\utente\.cursor\mcp.json` aggiungi il server `testsprite` (vedi `.cursor/mcp-testsprite-example.json`) con la tua `API_KEY`.
2. Riavvia Cursor.
3. In una **nuova chat Agent** scrivi:
   - *"Testa tutto il SaaS PropertyPilot AI con TestSprite. Base URL: https://propertypilot-ai.vercel.app. Segui TEST_PLAN.md (auth, billing, founder Agency, AI tools, Voice AI). Esegui i test e riportami il report pass/fail."*

L’Agent userà i tool TestSprite, eseguirà i test e ti darà il report (PASS/FAIL, screenshot, log). Se ci sono errori, puoi chiedere: *"Correggi il codice in base ai risultati dei test TestSprite"* e l’Agent può applicare le fix.

**Riassunto:** per **0 fail sui test da terminale** usa `npm run test:smoke` con `.env.test` compilato. Per test e2e completi (signup, billing UI, founder Agency, Voice AI) e correzione errori via bot usa **TestSprite nella chat Agent** (MCP attivo).

---

## 5. Push pre-finale (prima dei test su TestSprite dashboard)

Per avere il repo GitHub pulito e aggiornato prima di lanciare i test da [TestSprite dashboard](https://www.testsprite.com/dashboard):

1. **Dalla root del progetto** in PowerShell:
   ```powershell
   .\scripts\pre-final-push.ps1
   ```
   Lo script fa: `git fetch` → `git add -A` → `git commit` (se ci sono modifiche) → `git pull --rebase origin` → `git push origin`.

2. **Oppure a mano:**
   ```powershell
   git add -A
   git status
   git commit -m "chore: pre-final push - smoke tests, readiness docs"
   git pull --rebase origin main
   git push origin main
   ```
   (Sostituisci `main` con il tuo branch se diverso.)

Dopo il push, il codice su GitHub è allineato e puoi usare TestSprite (dashboard o MCP) contro **https://propertypilot-ai.vercel.app**.
