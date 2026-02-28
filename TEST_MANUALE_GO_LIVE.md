# 🧪 Test manuale go-live – PropertyPilot AI

Segui questa checklist **nell’ordine indicato** mentre il deploy su Vercel è in corso o appena finito.

**URL di test:** `https://propertypilot-ai.vercel.app`

---

## Prima di iniziare

- [ ] Deploy Vercel è **Ready** (cerchio verde)
- [ ] `NEXT_PUBLIC_APP_URL` impostato su `https://propertypilot-ai.vercel.app`
- [ ] Browser: Chrome o Edge (meglio evitare Safari per il primo test)
- [ ] Modalità incognito/privata se vuoi simulare un utente nuovo

---

## Fase 1: Landing page (≈5 min)

| # | Azione | Controllo | OK? |
|---|--------|-----------|-----|
| 1 | Apri `https://propertypilot-ai.vercel.app` | La pagina carica senza errori bianchi | ⬜ |
| 2 | Controlla il logo | Logo PropertyPilot visibile nell’header | ⬜ |
| 3 | Scorri la pagina | Nessun testo tagliato o fuori schermo | ⬜ |
| 4 | Clicca "Features" / "Pricing" | Scroll corretto alle sezioni | ⬜ |
| 5 | Cambia lingua (header) | Tutto il testo cambia (IT → EN → ES) | ⬜ |
| 6 | Cambia tema (toggle chiaro/scuro) | Il tema cambia correttamente | ⬜ |
| 7 | Clicca "Accedi" / "Login" | Vai a `/auth/login` | ⬜ |
| 8 | Torna indietro, clicca "Registrati" | Vai a `/auth/signup` | ⬜ |

---

## Fase 2: Registrazione (≈3 min)

| # | Azione | Controllo | OK? |
|---|--------|-----------|-----|
| 9 | Compila email (usa un indirizzo nuovo) | Il campo accetta l’input | ⬜ |
| 10 | Compila password (min 6 caratteri) | Il campo accetta l’input | ⬜ |
| 11 | Clicca "Registrati" | Nessun errore, redirect o messaggio corretto | ⬜ |
| 12 | Controlla email / Supabase | Se c’è magic link o conferma, funziona | ⬜ |
| 13 | Completa il login (se necessario) | Arrivi in dashboard | ⬜ |

---

## Fase 3: Dashboard base (≈5 min)

| # | Azione | Controllo | OK? |
|---|--------|-----------|-----|
| 14 | Verifica header dashboard | Logo + "PropertyPilot AI" visibili | ⬜ |
| 15 | Controlla presenza Aria Coach | Icona/pulsante Aria visibile | ⬜ |
| 16 | Clicca su Aria | Si apre il pannello chat | ⬜ |
| 17 | Leggi messaggio di benvenuto | Es. "L'armata è pronta, Capo" o equivalente | ⬜ |
| 18 | Cambia lingua (header dashboard) | Testo dashboard + Aria cambia lingua | ⬜ |
| 19 | Clicca "Dashboard" / "Home" | La pagina principale della dashboard si carica | ⬜ |

---

## Fase 4: Elite Deals (War Room)

| # | Azione | Controllo | OK? |
|---|--------|-----------|-----|
| 20 | Vai alla sezione deal / War Room | Pagina o sezione visibile | ⬜ |
| 21 | Cerca Miami | Deal Miami visibile | ⬜ |
| 22 | Cerca Milano | Deal Milano visibile | ⬜ |
| 23 | Controlla badge | Badge "SOLDI" o simile visibile e ben leggibile | ⬜ |

---

## Fase 5: Funzionalità core (≈10 min)

| # | Azione | Controllo | OK? |
|---|--------|-----------|-----|
| 24 | Vai a "Genera annuncio" / Listings | Pagina si carica | ⬜ |
| 25 | Prova a creare un annuncio (anche minimo) | Nessun crash, messaggio o redirect | ⬜ |
| 26 | Vai a Pricing / Piani | Piani visibili con prezzi corretti | ⬜ |
| 27 | Clicca "Inizia prova" o "Scegli piano" | Redirect a signup o Stripe | ⬜ |
| 28 | Vai a Billing | Pagina carica | ⬜ |
| 29 | Clicca "Manage subscription" (se esiste) | Si apre Stripe Customer Portal | ⬜ |

---

## Fase 6: Stripe checkout (test)

| # | Azione | Controllo | OK? |
|---|--------|-----------|-----|
| 30 | Avvia un checkout (piano Starter o Pro) | Pagina Stripe si apre | ⬜ |
| 31 | Usa carta test: `4242 4242 4242 4242` | Pagamento accettato | ⬜ |
| 32 | Completa pagamento | Redirect a dashboard con `?success=true` | ⬜ |
| 33 | Controlla piano in dashboard | Piano aggiornato correttamente | ⬜ |

---

## Fase 7: Mobile e margini

| # | Azione | Controllo | OK? |
|---|--------|-----------|-----|
| 34 | Riduci finestra (mobile) o usa DevTools | Menu mobile funziona | ⬜ |
| 35 | Cambia lingua su mobile | Cambio lingua funziona | ⬜ |
| 36 | Controlla footer landing | Link funzionanti (Privacy, Terms, ecc.) | ⬜ |

---

## Errori da annotare

Se qualcosa non va, segna qui:

| Pagina / Azione | Errore osservato |
|-----------------|------------------|
| | |
| | |
| | |

---

## Esito

- [ ] Test superato senza blocchi
- [ ] Test superato con piccoli problemi (da fixare)
- [ ] Test fallito (blocchi o crash da sistemare prima del go-live)
