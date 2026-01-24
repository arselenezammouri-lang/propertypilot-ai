# Istruzioni per Eseguire lo Script di Seed

## Prerequisiti

1. **USER_ID da Supabase**: Devi avere l'ID dell'utente dal database
2. **Variabili d'Ambiente**: Assicurati che `.env.local` contenga:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Come Ottenere il USER_ID

### Opzione 1: Da Supabase Dashboard
1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il tuo progetto
3. Vai su **Authentication** → **Users**
4. Copia l'UUID dell'utente (es: `123e4567-e89b-12d3-a456-426614174000`)

### Opzione 2: Da Console Browser (se sei loggato)
1. Apri la console del browser (F12)
2. Esegui: `localStorage.getItem('supabase.auth.token')`
3. Cerca l'`user_id` nel token JWT decodificato

### Opzione 3: Da Database Supabase
```sql
SELECT id, email FROM auth.users LIMIT 1;
```

## Eseguire lo Script

### Windows PowerShell
```powershell
cd C:\Users\utente\propilot-ai
npx tsx scripts/seed-listings.ts <TUO_USER_ID>
```

**Esempio:**
```powershell
npx tsx scripts/seed-listings.ts 123e4567-e89b-12d3-a456-426614174000
```

### Windows CMD
```cmd
cd C:\Users\utente\propilot-ai
npx tsx scripts/seed-listings.ts <TUO_USER_ID>
```

### Linux/Mac
```bash
cd /path/to/propilot-ai
npx tsx scripts/seed-listings.ts <TUO_USER_ID>
```

## Cosa Fa lo Script

Lo script inserisce **5 annunci di test** nella tabella `external_listings`:
- 2 annunci con status "new" (pronti per essere chiamati)
- 1 annuncio con status "called"
- 1 annuncio con status "appointment_set" (con AI summary completo)
- 1 annuncio con status "rejected"

Gli annunci includono:
- Titoli realistici
- Prezzi variabili
- Località italiane (Milano, Roma, Firenze, Torino)
- Numeri di telefono di test
- Piattaforme diverse (Idealista, Immobiliare, Casa.it)

## Risultato Atteso

Dopo l'esecuzione, vedrai:
```
✅ Inserito: Villa moderna con piscina a Milano (new)
✅ Inserito: Appartamento bilocale zona Navigli (new)
✅ Inserito: Trilocale ristrutturato in centro (called)
✅ Inserito: Attico panoramico con terrazzo (appointment_set)
✅ Inserito: Casa indipendente con giardino (rejected)

📊 Riepilogo:
   ✅ Inseriti: 5
   ⏭️  Skipped: 0
   📝 Totali: 5

🎉 Seed completato! Vai su /dashboard/prospecting per vedere i dati.
```

## Verifica

1. Vai su `/dashboard/prospecting`
2. Dovresti vedere 5 annunci nella tabella
3. Gli annunci con status "new" dovrebbero avere il pulsante "Chiama Ora" visibile

## Troubleshooting

### Errore: "Utente non trovato"
- Verifica che l'USER_ID sia corretto
- Assicurati che l'utente esista nella tabella `profiles`

### Errore: "NEXT_PUBLIC_SUPABASE_URL non configurato"
- Verifica che `.env.local` esista
- Controlla che le variabili d'ambiente siano configurate correttamente

### Script non si avvia
- Assicurati di essere nella directory corretta
- Verifica che `tsx` sia installato: `npm list tsx`
- Se non installato: `npm install --save-dev tsx`

