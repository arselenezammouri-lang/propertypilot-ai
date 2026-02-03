# PROTOCOLLO TEST MANUALE - FOUNDER VERIFICATION
## PropertyPilot AI - Pre-Launch Checklist

**Data:** _______________  
**Tester:** _______________  
**Risultato Finale:** ⬜ PASS | ⬜ FAIL

---

## ISTRUZIONI
Per ogni passaggio, segna ✅ se funziona o ❌ se trovi un problema.
Annota eventuali bug nella colonna "Note".

---

## CHECKLIST 10 PASSAGGI CHIAVE

### 1. REGISTRAZIONE UTENTE
| Test | Risultato | Note |
|------|-----------|------|
| Vai su `/auth/register` | ⬜ | |
| Inserisci email + password | ⬜ | |
| Clicca "Crea Account" | ⬜ | |
| Ricevi email di conferma (opzionale) | ⬜ | |
| Sei reindirizzato alla Dashboard | ⬜ | |

**Cosa verificare:** La registrazione deve completarsi in <5 secondi senza errori rossi.

---

### 2. ONBOARDING WIZARD
| Test | Risultato | Note |
|------|-----------|------|
| Compare il wizard di benvenuto | ⬜ | |
| Selezioni il tuo tipo di agenzia | ⬜ | |
| Inserisci nome agenzia | ⬜ | |
| Il wizard si chiude e salva | ⬜ | |

**Cosa verificare:** Il wizard deve apparire solo al primo accesso e salvare le preferenze.

---

### 3. GENERAZIONE ANNUNCIO AI
| Test | Risultato | Note |
|------|-----------|------|
| Vai su `/dashboard/strumenti/genera-annuncio` | ⬜ | |
| Seleziona tipo transazione (Vendita/Affitto/Affitto Breve) | ⬜ | |
| Compila i campi obbligatori | ⬜ | |
| Clicca "Genera Annuncio" | ⬜ | |
| L'AI genera un testo professionale in <10 secondi | ⬜ | |
| Il testo riflette il tipo di transazione scelto | ⬜ | |

**Cosa verificare:** 
- **Vendita** → parole come "investimento", "patrimonio", "acquista"
- **Affitto** → parole come "canone", "contratto", "garanzie"
- **Affitto Breve** → parole come "vacanza", "soggiorno", "experience"

---

### 4. ARIA COACH (CHATBOT AI)
| Test | Risultato | Note |
|------|-----------|------|
| Individua il pulsante viola in basso a destra | ⬜ | |
| Vedi il badge con i minuti rimanenti (es. "60m") | ⬜ | |
| Clicca sul pulsante | ⬜ | |
| Si apre la chat con Aria | ⬜ | |
| Scrivi una domanda (es. "Come scrivo un annuncio?") | ⬜ | |
| Aria risponde in modo utile | ⬜ | |

**Cosa verificare:** Il pulsante deve essere sempre visibile, il badge mostra i minuti giornalieri.

---

### 5. AUDIT ANNUNCIO AI EXPERT
| Test | Risultato | Note |
|------|-----------|------|
| Vai su `/dashboard/strumenti/audit-annuncio` | ⬜ | |
| Incolla un annuncio esistente | ⬜ | |
| Clicca "Analizza Annuncio" | ⬜ | |
| Ricevi un punteggio da 0 a 100 | ⬜ | |
| Vedi i breakdown per: Struttura, SEO, Emozione, Persuasività | ⬜ | |
| Ricevi suggerimenti specifici per migliorare | ⬜ | |

**Cosa verificare:** Il punteggio deve essere realistico e i suggerimenti actionable.

---

### 6. PDF GENERATOR
| Test | Risultato | Note |
|------|-----------|------|
| Vai su `/dashboard/strumenti/pdf-generator` | ⬜ | |
| Inserisci i dati dell'immobile | ⬜ | |
| Carica almeno un'immagine | ⬜ | |
| Clicca "Genera PDF" | ⬜ | |
| Il PDF si scarica correttamente | ⬜ | |
| Il PDF ha layout professionale con logo agenzia | ⬜ | |

**Cosa verificare:** Il PDF deve aprirsi e mostrare tutti i dati inseriti.

---

### 7. PRICING E UPGRADE
| Test | Risultato | Note |
|------|-----------|------|
| Vai su `/pricing` | ⬜ | |
| Vedi 4 piani: Starter (€197), Pro (€497), Agency (€897), Agency Boost (€2497) | ⬜ | |
| Il piano Pro ha badge "Consigliato" | ⬜ | |
| Clicca "Inizia Ora" su un piano | ⬜ | |
| Sei reindirizzato al checkout Stripe | ⬜ | |

**Cosa verificare:** I prezzi devono essere corretti e il checkout Stripe deve aprirsi.

---

### 8. CRM E LEAD MANAGEMENT
| Test | Risultato | Note |
|------|-----------|------|
| Vai su `/dashboard/crm` | ⬜ | |
| Vedi la pipeline Kanban con colonne | ⬜ | |
| Crea un nuovo lead manualmente | ⬜ | |
| Trascina il lead tra le colonne | ⬜ | |
| Il lead si aggiorna correttamente | ⬜ | |

**Cosa verificare:** Il drag-and-drop deve essere fluido, i dati devono salvarsi.

---

### 9. MOBILE/PWA
| Test | Risultato | Note |
|------|-----------|------|
| Apri l'app su smartphone | ⬜ | |
| Compare il prompt "Installa PropertyPilot" | ⬜ | |
| Il layout è responsive e leggibile | ⬜ | |
| I pulsanti sono cliccabili senza zoom | ⬜ | |
| L'app funziona offline (dopo installazione) | ⬜ | |

**Cosa verificare:** L'esperienza mobile deve essere fluida come desktop.

---

### 10. REFERRAL SYSTEM
| Test | Risultato | Note |
|------|-----------|------|
| Vai su `/dashboard` e trova la sezione Referral | ⬜ | |
| Vedi il tuo link di referral unico | ⬜ | |
| Clicca "Copia Link" | ⬜ | |
| Il link è copiato negli appunti | ⬜ | |
| Condividi su WhatsApp/Email funziona | ⬜ | |

**Cosa verificare:** Il link di referral deve essere unico per utente.

---

## TIER PREVIEW TOGGLE (SIMULATORE PIANI)

**Come usarlo:**
1. Vai sulla Dashboard (`/dashboard`)
2. Cerca in alto a destra il widget "Preview Tier" 
3. Clicca su uno dei bottoni: FREE / STARTER / PRO / AGENCY
4. L'interfaccia cambierà per mostrare cosa vede un utente di quel piano
5. Le funzioni "bloccate" avranno un lucchetto 🔒
6. Per tornare alla tua vista reale, clicca "REAL"

**Test consigliato:**
- Seleziona "FREE" → verifica che molte funzioni siano bloccate
- Seleziona "AGENCY" → verifica che tutto sia sbloccato
- Torna a "REAL" → conferma che torni al tuo piano effettivo

---

## RISULTATO FINALE

| Categoria | Passati | Falliti |
|-----------|---------|---------|
| Registrazione | __/5 | __/5 |
| Onboarding | __/4 | __/4 |
| Generazione AI | __/6 | __/6 |
| Aria Coach | __/6 | __/6 |
| Audit AI | __/6 | __/6 |
| PDF | __/6 | __/6 |
| Pricing | __/5 | __/5 |
| CRM | __/5 | __/5 |
| Mobile/PWA | __/5 | __/5 |
| Referral | __/5 | __/5 |

**TOTALE:** __/53 test passati

---

## NOTE AGGIUNTIVE

_Scrivi qui eventuali bug, suggerimenti o osservazioni:_

```
1. 

2. 

3. 

4. 

5. 
```

---

**FIRMA FOUNDER:** _______________  
**DATA APPROVAZIONE:** _______________

✅ **PRONTO PER MARKETING** | ❌ **RICHIEDE FIX**
