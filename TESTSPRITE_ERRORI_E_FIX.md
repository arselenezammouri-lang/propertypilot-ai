# TestSprite – Perché falliscono i test e come sistemarli

Dai tuoi screenshot risultano **molti test rossi** (Login, Logout, Login incorrect password, Switch to Starter/Pro/Agency, Abort payment, ecc.). Qui sotto: **perché** succede e **cosa fare**, uno per uno.

---

## Causa principale: TestSprite sta facendo “Backend API” su un’app **frontend**

PropertyPilot AI è un’app **Next.js** con:

- **Login/Signup**: pagine **HTML** (`/auth/login`, `/auth/signup`). Il login vero lo fa il **browser** con Supabase (JavaScript), non un POST a un’API che ritorna JSON.
- **Billing**: il redirect a Stripe parte da **dashboard** (utente loggato) con `POST /api/stripe/checkout` che richiede **cookie di sessione**.

I test generati da TestSprite sono **test da API** (Python `requests.post(url, json=...)`). Quando chiamano:

- `POST https://propertypilot-ai.vercel.app/auth/login` → il server risponde con **HTML** (200), non JSON.
- Il test fa `response.json()` → **"Expecting value: line 1 column 1 (char 0)"** perché sta parsando HTML come JSON.

Quindi **molti errori non sono bug dell’app**, ma test pensati per API REST mentre le nostre route di auth sono pagine web.

---

## Riepilogo errori e tipo di fix

| Test | Errore | Causa | Dove si fixa |
|------|--------|--------|----------------|
| Login with correct credentials | Expecting value (JSON) | POST /auth/login ritorna HTML | TestSprite: non usare .json() su /auth/login |
| Logout functionality | Expecting value (JSON) | Stesso motivo (pagina HTML) | TestSprite |
| Login with incorrect password | Expected 401, got 200 | /auth/login è una pagina, non un’API; ritorna sempre 200 (HTML) | TestSprite: non aspettarsi 401 da quella URL |
| Signup with existing email | Pass ma 200+HTML | Test potrebbe essere troppo permissivo | Opzionale: rivedere assert |
| Switch to Starter / Pro / Agency | Expecting value o Expected 302 got 200 | Checkout richiede **sessione**; test senza cookie o su URL sbagliato | TestSprite: usare sessione dopo login |
| Abort payment (Starter) | Expecting value | Stesso: risposta HTML o manca sessione | TestSprite |

---

## Cosa fare “uno per uno”

### 1. Login with correct credentials (e Logout)

- **Problema:** Il test fa `POST /auth/login` e poi `response.json()`.
- **Fix lato TestSprite:**  
  Non trattare `/auth/login` come API JSON.  
  - Opzione A: usare **browser/frontend** TestSprite (se disponibile) per fare login reale e poi verificare redirect a `/dashboard`.  
  - Opzione B: nel test Python, **non** fare `response.json()` sulla risposta di `/auth/login`; controllare solo `status_code == 200` e che in un test successivo (es. GET `/dashboard` con gli stessi cookie) si ottenga 200 se il login ha impostato i cookie (se TestSprite invia i cookie tra le richieste).

**Cosa puoi incollare nella chat di TestSprite per questo test:**

```
The app's /auth/login is an HTML page, not a JSON API. Do not call response.json() on it. 
Either: (1) only assert status 200 and that subsequent request to /dashboard with same session returns 200, 
or (2) use browser/frontend flow to submit the form and check redirect to /dashboard.
```

---

### 2. Login with incorrect password (Expected 401 but got 200)

- **Problema:** Il test si aspetta 401 da `POST /auth/login` con password sbagliata, ma quella URL è una **pagina** che ritorna sempre 200 (HTML).
- **Fix:** Solo lato TestSprite. Non aspettarsi 401 dalla URL `/auth/login`; l’errore “credenziali non valide” è gestito nel **frontend** (toast), non come status HTTP da un’API.

**Cosa incollare nella chat TestSprite:**

```
/auth/login is an HTML page. Invalid credentials are shown in the page (toast), not as HTTP 401. 
Change the test: either remove this API-style check, or check for 200 and assert that the response body (HTML) contains text indicating error (e.g. "invalid" or "incorrect" or the translated error message), instead of expecting status 401.
```

---

### 3. Switch to Starter / Pro / Agency (Expecting value / Expected 302 got 200)

- **Problema:**  
  - L’app espone **POST /api/stripe/checkout** con body `{ "planType": "starter" }` (o "pro" / "agency").  
  - Questa API richiede **utente loggato** (cookie di sessione). Senza cookie risponde **401** (JSON).  
  - Il test probabilmente: (a) chiama una URL sbagliata (es. GET alla pagina billing) e riceve HTML (200), poi fa .json() → "Expecting value"; oppure (b) si aspetta 302 ma riceve 200 perché sta chiamando una pagina invece dell’API.
- **Fix:**  
  - **Step 1:** Fare login (con **browser/frontend** o con un flusso che imposti i cookie di sessione).  
  - **Step 2:** Fare **POST** a `https://propertypilot-ai.vercel.app/api/stripe/checkout` con  
    - Header: `Content-Type: application/json`  
    - Body: `{"planType": "starter"}` (o "pro" / "agency")  
    - **Stessi cookie della sessione** del login.  
  - **Step 3:** Assert: `response.status_code == 200` e `response.json()` contiene `"url"` (link a Stripe). Non aspettarsi 302 dall’API (l’API ritorna JSON con `url`; il redirect lo fa il frontend).

**Cosa incollare nella chat TestSprite (per Switch to Starter/Pro/Agency):**

```
For "Switch to Starter/Pro/Agency": do not call the billing page URL. Use POST https://propertypilot-ai.vercel.app/api/stripe/checkout with body {"planType": "starter"} (or "pro"/"agency"). This endpoint requires session cookies from a previous login. So: (1) first perform login (browser or session that sets cookies), (2) then POST to /api/stripe/checkout with the same session/cookies and Content-Type: application/json. Assert status 200 and that the JSON response has a "url" field (Stripe checkout URL). Do not expect 302 from this API.
```

---

### 4. Abort payment (Starter / Pro)

- **Problema:** Stesso tipo: risposta HTML o uso di URL/API sbagliate, oppure `response.json()` su risposta non JSON.
- **Fix:** Allineare il test al flusso reale: dopo aver ottenuto l’URL di checkout (POST /api/stripe/checkout), il “abort” è **non** completare il pagamento su Stripe e tornare alla dashboard. Quindi il test può: (1) login, (2) POST checkout per avere `url`, (3) opzionalmente GET quella URL e poi simulare “back” / cancel, (4) GET dashboard e verificare che non compaia “Profile not found”. Evitare di fare `.json()` su risposte che sono HTML.

**Cosa incollare nella chat TestSprite:**

```
Abort payment: after getting Stripe checkout URL from POST /api/stripe/checkout, do not parse HTML as JSON. To test "abort", either don't follow the Stripe URL or simulate cancel; then request /dashboard and assert no "Profile not found" in the response. Do not call response.json() on HTML pages.
```

---

## Cosa abbiamo noi (API che ritornano JSON)

Queste sono le route che **ritornano JSON** e possono essere testate come “backend API” (con sessione dove serve):

- **POST /api/stripe/checkout** – Body: `{ "planType": "starter" | "pro" | "agency" }`. Richiede cookie di sessione. Risposta: `{ "url": "https://checkout.stripe.com/..." }`.
- **GET /api/user/subscription** – Richiede sessione. Risposta: `{ "success": true, "data": { "status": "free" | "starter" | "pro" | "agency", ... } }`.
- **POST /api/auth/setup-user** – Richiede sessione (dopo login). Non restituisce dati essenziali per questi test.

**Non** sono API JSON (sono pagine HTML): `/auth/login`, `/auth/signup`, `/dashboard`, `/dashboard/billing` (la pagina).

---

## Ordine consigliato per sistemarli “uno per uno”

1. **Login with correct credentials** – Applica il fix “non usare .json() su /auth/login” e usa sessione/cookie per i test successivi.
2. **Login with incorrect password** – Cambia assert: niente 401 da `/auth/login`, controllare contenuto HTML o rimuovere il check.
3. **Logout** – Stesso concetto: non parsare HTML come JSON; verificare che dopo logout una richiesta a `/dashboard` dia redirect o 302/401.
4. **Switch to Starter / Pro / Agency** – Usare POST /api/stripe/checkout con sessione e assert su `url` in JSON.
5. **Abort payment** – Allineare a flusso reale e non fare .json() su HTML.

Quando hai applicato le modifiche in TestSprite (o incollato i testi in chat), riesegui i test. Se un test specifico continua a fallire, incolla qui **nome del test + messaggio di errore + (se possibile) snippet del codice del test** e possiamo fare il fix puntuale per quello.
