# Test manuale umano – PropertyPilot AI

> Da fare a mano (click, login, form) per trovare bug e errori prima del lancio.  
> Base URL: **https://propertypilot-ai.vercel.app**

---

## Prima di iniziare

- **Chrome-headless-shell**: quando lanci gli script (`stripe-smoke-test.mjs` o `run-all-smoke-tests.mjs`) parte un browser in background. Se vedi "crashed" o "Timeout", **non aspettare**: lo script è già finito. Puoi chiudere il terminale e rilanciare (abbiamo aumentato i timeout). Non serve aspettare processi.
- **Stripe diagnose**: se lo script Stripe mostra ancora issue dopo il sync, incolla qui l’output (issue + raccomandazioni) e le sistemiamo una per una.

---

## Checklist test manuale (da spuntare)

### 1. Auth
- [ ] **Signup** – Vai a `/auth/signup`, compila e invia. Verifica redirect a `/dashboard` e nessun errore a schermo.
- [ ] **Login** – Logout, poi login da `/auth/login`. Verifica redirect a dashboard.
- [ ] **Forgot password** – Link “Password dimenticata”, inserisci email, verifica che non dia errore di rete.

### 2. Billing e Stripe
- [ ] **Billing** – `/dashboard/billing`: la pagina carica e mostra il piano corrente (Free/Starter/Pro/Agency).
- [ ] **Avvio checkout** – Clic su “Passa a Starter” (o Pro/Agency): si apre Stripe Checkout (puoi annullare senza pagare).
- [ ] **Nessun “Profile not found”** – Durante il flusso billing/checkout non deve comparire questo messaggio.

### 3. Dashboard e piani
- [ ] **Agency (se hai il piano)** – Badge “Agency”, Map sbloccata, CRM visibile, Prospecting con Voice AI disponibile.
- [ ] **Starter/Pro** – Map con messaggio di upgrade; CRM/Prospecting come da piano.

### 4. Tool AI principali
- [ ] **Generazione annuncio** – Pagina listings o emotional-listing: compila campi minimi, genera. Verifica risposta 200 e testo in pagina (no toast errore).
- [ ] **Perfect Copy** – `/dashboard/perfect-copy`: inserisci dati, genera. Output visibile, nessun errore.
- [ ] **Follow-up email** – `/dashboard/followup-emails`: compila e genera. Output visibile, nessun errore.
- [ ] **Titles** – `/dashboard/titles`: genera titoli. Risposta corretta.

### 5. Navigazione e UI
- [ ] **Nessun 404** – Clic su link del menu (Dashboard, Leads, Billing, Settings, ecc.): nessuna pagina “Not found”.
- [ ] **Lingua** – Cambio lingua (IT/EN/altro): testi che cambiano, nessun crash.
- [ ] **Tema** – Toggle dark/light: layout coerente, nessun testo illeggibile.

### 6. Pagine pubbliche
- [ ] **Homepage** – Carica, CTA e sezioni visibili.
- [ ] **Pricing** – Tabella piani e pulsanti “Inizia” / checkout.
- [ ] **Blog** – Lista articoli e almeno un articolo che apre.
- [ ] **Contatti / Privacy / Terms** – Pagine si aprono senza errore.

---

## Dopo il test manuale

- **Bug trovati**: annota URL, azione fatta e messaggio di errore (o screenshot) e incollali in chat: li sistemiamo uno per uno.
- **TestSprite**: in una **nuova chat Agent** scrivi:  
  *“Testa tutto il SaaS PropertyPilot AI con TestSprite. Base URL: https://propertypilot-ai.vercel.app. Segui TEST_PLAN.md (auth, billing, founder Agency, AI tools, Voice AI). Esegui i test e riportami il report pass/fail.”*  
  Così l’Agent può usare TestSprite (se MCP è attivo) e darti un report da affiancare al test manuale.

Quando hai finito la checklist e/o l’output di TestSprite, incolla qui i punti falliti o i bug e procediamo con le fix.
