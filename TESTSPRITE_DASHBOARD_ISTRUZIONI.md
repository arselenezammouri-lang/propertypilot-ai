# TestSprite Dashboard – Compilazione al 100%

> Pagina **"Add Your APIs for Testing"** – come riempire tutto per test completi su PropertyPilot AI.

**Base URL:** `https://propertypilot-ai.vercel.app`

---

## 1. API name

Nel campo **"API name"** (al posto di "No Name") scrivi:

```
PropertyPilot AI Production
```

oppure:

```
PropertyPilot AI - Main SaaS
```

---

## 2. API endpoint / URL

Lascia così (già corretto):

```
https://propertypilot-ai.vercel.app
```

---

## 3. Authentication Type – dove mettere email e password

TestSprite mostra **un solo campo**: **"Credential / Key"** (placeholder "e.g. 1234abcd").

- Lascia **"Basic - Uses username & password"** nel menu a tendina.
- Nel campo **"Credential / Key"** inserisci **email e password in questo formato** (separati da due punti, senza spazi):
  ```text
  tua-email@esempio.com:tua-password
  ```
  Esempio reale (usa i tuoi dati da `.env.test`):
  - Se in `.env.test` hai `TEST_EMAIL=arselenezammouri@gmail.com` e `TEST_PASSWORD=xyz123`, nel campo scrivi:
  ```text
  arselenezammouri@gmail.com:xyz123
  ```

È il formato standard per Basic Auth (username:password). TestSprite userà queste credenziali per fare login sul sito durante i test (dashboard, billing, AI tools).

---

## 4. Extra testing information (Obbligatorio per il 100%)

Copia **tutto** il blocco qui sotto e incollalo nel campo **"Extra testing information (Optional)"**. Così l’AI di TestSprite sa esattamente quali scenari eseguire.

```
TARGET: https://propertypilot-ai.vercel.app (Next.js SaaS, Supabase auth, Stripe billing).

AUTH & PROFILE:
- Signup: go to /auth/signup, fill name + email + password, submit. Expect redirect to /dashboard. Call GET /api/user/subscription and verify success: true, data.status === "free". No error toast on dashboard.
- Login/Logout: logout via header, then login at /auth/login with same credentials. Expect redirect to /dashboard with no errors.

BILLING (Starter / Pro / Agency):
- From /dashboard/billing: click "Switch to Starter 197€" → expect redirect to Stripe checkout (product STARTER, 197€/mo). Abort payment; assert no "Profile not found" toast.
- Same for "Switch to Pro 497€" (PRO 497€/mo) and "Switch to Agency 897€" (AGENCY 897€/mo). Do not complete real payments; only verify redirect and no Profile not found.

FOUNDER AGENCY (if testing with Agency account):
- Login as founder. /dashboard must show "Agency" badge. /dashboard/map must be unlocked (no lock card). /dashboard/leads must show CRM table (no ProFeaturePaywall). /dashboard/prospecting must show Voice AI actions (AI Call button not disabled).

AI TOOLS (after login):
- Listing generation: open listings/emotional-listing tool, fill minimal fields, generate. Expect HTTP 200 and UI showing generated title + description.
- Perfect Copy: /dashboard/perfect-copy — fill essential data, generate. Verify output text and no error toast.
- Follow-up Emails: /dashboard/followup-emails — fill fields and generate. Verify output shown and no API errors.

VOICE AI (Pro/Agency):
- Pro: up to 30 calls from prospecting; 31st should return 403 (limit reached).
- Agency: no monthly limit error when placing calls.

EMPTY STATES:
- Visit /dashboard/listings, /dashboard/leads, /dashboard/prospecting. No 500/404; show "Nessun annuncio/lead trovato" (or similar) with CTA to create first.

REPORT: For each scenario report Status (PASS/FAIL), URLs, screenshot on failure, and key error message or status code.
```

---

## 5. Upload API Docs (Optional) – e il file .env / Vercel?

- **"Upload API Docs"** serve **solo** per documentazione API (OpenAPI/Swagger, es. `openapi.json`). **Non** per file `.env` o variabili d’ambiente.
- **Non devi caricare** il file delle environment variables (né quello di Vercel né il tuo `.env.local` / `.env.test`).  
  Il sito https://propertypilot-ai.vercel.app usa già le variabili configurate su Vercel; TestSprite deve solo fare login con **email e password** nel campo "Credential / Key" (vedi punto 3). Le chiavi API (Stripe, OpenAI, ecc.) restano sul server e non servono a TestSprite per i test.
- Se hai un file OpenAPI/Swagger puoi caricarlo; altrimenti lascia vuoto e usa le istruzioni del punto 4.

---

## 6. Clicca "Next →"

Dopo aver compilato:

1. **API name**  
2. **API endpoint** (già ok)  
3. **Authentication** (Basic + email e password di test)  
4. **Extra testing information** (testo incollato sopra)  
5. (Opzionale) upload doc  

clicca il pulsante verde **"Next →"** e completa i passi successivi della creazione test (step 3 e 4). Alla fine avvia il test e usa il report per vedere PASS/FAIL per ogni scenario.

---

## Riepilogo veloce

| Campo | Cosa mettere |
|-------|------------------|
| **API name** | `PropertyPilot AI Production` |
| **API endpoint / URL** | `https://propertypilot-ai.vercel.app` |
| **Credential / Key** | `email:password` (es. `tua@email.com:tuapassword`) – un solo campo |
| **Extra testing information** | Copia il blocco dalla sezione 4 di questo file |
| **Upload API Docs** | Opzionale (lascia vuoto se non hai OpenAPI) |

Poi **Next →** e completa il flusso TestSprite.
