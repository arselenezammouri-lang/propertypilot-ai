## PropertyPilot AI – TestSprite MCP Plan (Production)

> Target base URL: `https://propertypilot-ai.vercel.app`

### 0. Global Assumptions

- Use **fresh test users** created via signup flow (email/password).  
- Do NOT modify real founder/friend accounts.  
- All Stripe operations use test cards if account is in test mode; otherwise keep number of real payments minimal and clearly log them.

---

### A. Auth & Profile

1. **Signup Free user**
   - Go to `/auth/signup`.
   - Fill name + email + password and submit.
   - Expect redirect to `/dashboard`.
   - Call `/api/user/subscription` and verify:
     - `success: true`.
     - `data.status === "free"`.
   - Verify that no error toast appears on dashboard.

2. **Login / Logout**
   - Logout via header button.
   - Login again with same credentials from `/auth/login`.
   - Expect redirect to `/dashboard` with no errors.

---

### B. Billing – Starter / Pro / Agency

3. **Starter checkout**
   - From `/dashboard/billing`, click **Switch to Starter 197€**.
   - Expect redirect to Stripe checkout with product name “STARTER” and price 197€/mo.
   - Abort payment (no need to complete).
   - Assert: no “Profile not found” toast appears on billing page.

4. **Pro checkout**
   - From `/dashboard/billing`, click **Switch to Pro 497€**.
   - Same expectations as step 3 but for “PRO” 497€/mo.

5. **Agency checkout**
   - From `/dashboard/billing`, click **Switch to Agency 897€**.
   - Same expectations for “AGENCY” 897€/mo.

> NOTE: These 3 tests verificano SOLO che il redirect a Stripe funzioni e che non compaiano errori “Profile not found”. Non è obbligatorio completare il pagamento in automatico.

---

### C. Founder Account – Agency Plan

> Usa l’account founder **già con piano Agency** (email fornita manualmente, non crearla nel test).

6. **Agency access gates**
   - Login come founder.
   - Vai a `/dashboard`.
   - Verifica che il badge piano mostri “Agency”.
   - Vai a `/dashboard/map`:
     - Deve essere **sbloccata** (nessun lock card).
   - Vai a `/dashboard/leads`:
     - La tabella CRM deve essere visibile (non mostra paywall “ProFeaturePaywall”).
   - Vai a `/dashboard/prospecting`:
     - Azioni di Voice AI devono essere disponibili (pulsante AI Call non disabilitato).

---

### D. AI Tools – Basic Smoke

7. **AI Listing Generation (Founder / Agency)**
   - Dal dashboard, apri lo strumento principale di generazione annuncio (pagina listings tool).
   - Compila un set minimo di campi e genera un annuncio.
   - Attendi risposta:
     - Response HTTP 200.
     - UI mostra testo generato (titolo + descrizione).

8. **Perfect Copy**
   - Vai a `/dashboard/perfect-copy`.
   - Inserisci dati essenziali e genera copy.
   - Verifica presenza di testo di output e nessuna toast di errore.

9. **Follow-up Emails**
   - Vai a `/dashboard/followup-emails`.
   - Compila i campi base e genera una email.
   - Verifica che l’output venga mostrato e non ci siano errori API.

---

### E. Voice AI – Pro / Agency

> Per evitare telefonate reali, usare un numero di test o un listing di prova con numero “fittizio” configurato in ambiente di staging; se non possibile, limitare a un singolo caso manualmente.

10. **Voice AI limit – Pro**
    - (Opzionale, se esiste utente con piano Pro.)  
    - Eseguire chiamate fino a 30 dalla pagina `prospecting` e verificare:
      - Le prime chiamate vanno a buon fine.
      - Alla 31ª chiamata l’API risponde 403 con messaggio di limite raggiunto.

11. **Voice AI illimitata – Agency**
    - Con founder Agency, avviare alcune chiamate.
    - Verificare che non venga mai restituito errore di limite mensile.

---

### F. Zero-Data State

12. **Cleanup e Empty States**
    - (Solo in ambiente di test / staging!)  
    - Eseguire `node scripts/final-db-cleanup.mjs` contro un progetto Supabase di prova.
    - Visitare:
      - `/dashboard/listings`
      - `/dashboard/leads`
      - `/dashboard/prospecting`
    - In ciascuna pagina:
      - Nessun errore 500/404.
      - Vengono mostrati messaggi tipo “Nessun annuncio/lead trovato” con CTA per creare il primo.

---

### G. Report Atteso da TestSprite

Per ogni scenario sopra, il report deve includere:

- **Status**: PASS / FAIL.  
- **URL** coinvolte.  
- **Screenshot** in caso di errore.  
- **Log estratto**: testo toast di errore, status code, eventuale stack trace dal browser.

Alla fine, un riepilogo:

- Tabella: `Scenario | Risultato | Messaggio chiave`.  
- Lista compatta dei FAIL con priorità (Critico / Medio / Basso) e file sospetti (`app/...` o `app/api/...`).

