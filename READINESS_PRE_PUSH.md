# PropertyPilot AI – Ready per push e clienti

> Tutto in ordine prima del **push finale** e del **marketing** su https://propertypilot-ai.vercel.app

---

## Stato verificato (automatico)

| Check | Comando | Stato |
|-------|---------|--------|
| **Pre-launch audit** | `npm run pre-launch-audit` | ✅ 52 check passati, 0 issue |
| **Lint** | `npm run lint` | ✅ Eseguire prima del push |
| **Smoke test** | `npm run test:smoke` | ⏳ Eseguire con `.env.test` compilato |

---

## Cosa fare dalla terminale (in ordine)

### 1. Test automatici (0 fail)

Assicurati che `.env.test` contenga `TEST_EMAIL` e `TEST_PASSWORD` (utente reale su propertypilot-ai.vercel.app), poi:

```powershell
npm run test:smoke
```

Attendi **"TUTTI I TEST AUTOMATICI SUPERATI"**. Se qualcosa fallisce, correggi l’errore indicato e rilancia.

### 2. Lint

```powershell
npm run lint
```

Correggi eventuali errori prima del push.

### 3. Build (opzionale ma consigliato)

```powershell
npm run build
```

Se la build fallisce, risolvi gli errori prima di fare deploy.

---

## Checklist pre-marketing (sintesi)

- [ ] **Smoke test** – `npm run test:smoke` → tutti OK
- [ ] **Lint** – `npm run lint` → nessun errore
- [ ] **Build** – `npm run build` → successo
- [ ] **Test manuale** – almeno una passata su [MANUAL_TEST_CHECKLIST.md](MANUAL_TEST_CHECKLIST.md) (auth, billing, dashboard, tool AI, pagine pubbliche)
- [ ] **Stripe / Vercel** – variabili LIVE su Vercel, webhook configurato (vedi [FINAL_PUSH_AND_MARKETING_READINESS.md](FINAL_PUSH_AND_MARKETING_READINESS.md))

---

## Riferimenti

| File | Uso |
|------|-----|
| **COMANDI_TEST_TERMINALE.md** | Comandi test (smoke, TestSprite) |
| **FINAL_PUSH_AND_MARKETING_READINESS.md** | Checklist completa Stripe LIVE e marketing |
| **MANUAL_TEST_CHECKLIST.md** | Test manuale (click, login, form) |
| **TEST_PLAN.md** | Scenari per TestSprite / e2e |

Quando i punti sopra sono OK, il sito è **pronto per i clienti** e puoi avviare il marketing.
