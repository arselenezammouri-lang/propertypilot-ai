# Cosa fare esattamente – Test TestSprite e readiness

Istruzioni passo-passo, in ordine.

---

## Parte 1: Configurare TestSprite (per il test “tutto il SaaS”)

### 1.1 Aprire il file mcp.json

- Apri **Esplora file** (Windows).
- Vai in: **`C:\Users\utente\.cursor`** (cartella nascosta `.cursor` nel tuo utente).
- Trova il file **`mcp.json`** e aprilo con **Blocco note** (o con Cursor: File → Apri file → `C:\Users\utente\.cursor\mcp.json`).

### 1.2 Contenuto corretto del file

Il file deve avere **questa struttura**. Se hai già `runtimes` o altro, **aggiungi** il blocco `mcpServers` (o sostituisci la parte “servers” con questa):

```json
{
  "mcpServers": {
    "testsprite": {
      "command": "npx",
      "args": ["-y", "@testsprite/testsprite-mcp@latest"],
      "env": {
        "API_KEY": "LA_TUA_CHIAVE_TESTSPRITE_QUI"
      }
    }
  }
}
```

**Cosa sostituire:**

- Al posto di **`LA_TUA_CHIAVE_TESTSPRITE_QUI`** metti la tua **API key di TestSprite** (quella che inizia tipo con `sk-user-...` che hai già usato).
- Se in altri esempi vedi **`TESTSPRITE_API_KEY`** invece di **`API_KEY`**, puoi provare prima con `API_KEY`; se TestSprite non parte, usa:
  ```json
  "env": {
    "TESTSPRITE_API_KEY": "LA_TUA_CHIAVE_QUI"
  }
  ```

**Errore da evitare:**

- **Non** usare `"command": "testsprite-"` e **non** lasciare `"args": []`. Il comando giusto è **`npx`** e gli argomenti **`["-y", "@testsprite/testsprite-mcp@latest"]`**.

### 1.3 Salvare e chiudere

- Salva **`mcp.json`** (Ctrl+S) e chiudi il file.

### 1.4 Riavviare Cursor

- Chiudi **completamente** Cursor (anche dalla barra delle applicazioni).
- Riapri Cursor e apri il progetto **propilot-ai**.

### 1.5 Verificare che TestSprite sia attivo

- Vai in **Impostazioni** (icona ingranaggio o Ctrl+,).
- Cerca **“MCP”** nella barra di ricerca.
- Nella sezione MCP dovresti vedere il server **testsprite** (o **TestSprite**) elencato. Se non lo vedi, rileggi il passo 1.2 e controlla che il JSON sia valido (virgole, parentesi).

---

## Parte 2: Lanciare il test “tutto il SaaS” con TestSprite

### 2.1 Nuova chat Agent

- In Cursor apri il pannello **Agent** (chat).
- Clic su **“New Agent”** (o “Nuova chat Agent”) per iniziare una **nuova** conversazione.

### 2.2 Incollare il messaggio esatto

- Copia e incolla **tutto** questo blocco nella nuova chat:

```
Testa tutto il SaaS PropertyPilot AI con TestSprite. Base URL: https://propertypilot-ai.vercel.app. Segui TEST_PLAN.md (auth, billing, founder Agency, AI tools, Voice AI). Esegui i test e riportami il report pass/fail.
```

- Invia il messaggio.

### 2.3 Cosa aspettarti

- Se TestSprite MCP è attivo, l’Agent userà i tool TestSprite, lancerà i test sul sito e ti risponderà con un **report** (PASS/FAIL, URL, eventuali screenshot o log).
- Se l’Agent risponde che **non ha i tool TestSprite**, torna alla **Parte 1** e controlla di nuovo `mcp.json` e riavvio di Cursor.

---

## Parte 3: Test automatici da terminale (opzionale ma utile)

Questi non usano TestSprite; servono per avere un report veloce (pagine + Stripe).

### 3.1 Aprire PowerShell nel progetto

- In Cursor apri il **terminale** (Terminal → New Terminal).
- Assicurati di essere nella cartella del progetto (es. `C:\Users\utente\propilot-ai`). Se no: `cd C:\Users\utente\propilot-ai`.

### 3.2 Impostare email e password di test

- Sostituisci con la **tua** email e password (quelle con cui fai login su propertypilot-ai.vercel.app):

```powershell
$env:TEST_EMAIL="arselenezammouri@gmail.com"; $env:TEST_PASSWORD="arselene200710"
```

### 3.3 Eseguire la suite completa

```powershell
node scripts/run-all-smoke-tests.mjs
```

- Attendi la fine (può richiedere alcuni minuti).
- In console vedrai: **System smoke test** (pagine + login + dashboard + AI) e **Stripe smoke test** (diagnose + checkout).  
- Se tutto ok: **“TUTTI I TEST AUTOMATICI SUPERATI”**.

### 3.4 Se il login fallisce

- Lo script riprova il login una volta. Se fallisce ancora, può essere un problema di rete o di tempo (Vercel lento). Riprova più tardi o verifica che email/password siano corrette nel browser su https://propertypilot-ai.vercel.app/auth/login.

---

## Parte 4: Quando fare il push finale e il marketing

- Segui la checklist nel file **`FINAL_PUSH_AND_MARKETING_READINESS.md`** (Stripe LIVE, webhook, variabili, test, pagamento di prova).
- Quando la checklist è soddisfatta:
  - puoi passare a **Stripe LIVE** e considerare fatto il “push finale” sui pagamenti;
  - puoi **iniziare il marketing** quando ti senti pronto su messaggio, pricing e supporto.

---

## Riepilogo veloce

| Cosa | Dove / Come |
|------|-------------|
| **1. mcp.json** | `C:\Users\utente\.cursor\mcp.json` → struttura con `mcpServers` → `testsprite` → `command`: `npx`, `args`: `["-y", "@testsprite/testsprite-mcp@latest"]`, `env.API_KEY`: tua chiave. |
| **2. Riavvio** | Chiudi e riapri Cursor. |
| **3. Test TestSprite** | Nuova chat Agent → incolla il messaggio della Parte 2.2 → attendi report PASS/FAIL. |
| **4. Test da terminale** | PowerShell: imposta TEST_EMAIL e TEST_PASSWORD, poi `node scripts/run-all-smoke-tests.mjs`. |
| **5. Push / marketing** | Checklist in `FINAL_PUSH_AND_MARKETING_READINESS.md`. |

Se un passo non funziona (es. “TestSprite non compare in MCP” o “Login fallito” nello script), annota il messaggio di errore o lo screenshot e chiedi il passo successivo indicando il numero della parte (1, 2, 3 o 4).
