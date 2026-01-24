# 🚀 Avviare PropertyPilot AI in Sviluppo Locale

## Prerequisiti

1. **Node.js 18+** installato
2. **Variabili d'Ambiente** configurate in `.env.local`
3. **Database Supabase** configurato con tutte le migration

## Step 1: Verifica Dipendenze

```powershell
npm install
```

## Step 2: Verifica Variabili d'Ambiente

Assicurati che `.env.local` contenga almeno:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
OPENAI_API_KEY=sk-...
```

## Step 3: Esegui Migration SQL

1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il tuo progetto
3. Vai su **SQL Editor**
4. Esegui le migration in ordine:
   - `supabase-prospecting-migration.sql` (se non già eseguita)
   - `supabase-prospecting-add-lead-score.sql` (NUOVA - per lead_score)

## Step 4: Popola Database con Dati di Test

**IMPORTANTE:** Prima di eseguire lo script, ottieni il tuo USER_ID:

### Come Ottenere USER_ID (Windows PowerShell):

```powershell
# Opzione 1: Da Supabase Dashboard
# Vai su Authentication → Users e copia l'UUID

# Opzione 2: Se sei già loggato nell'app
# Apri la console del browser (F12) e esegui:
# localStorage.getItem('supabase.auth.token')
```

### Esegui Script Seed:

```powershell
cd C:\Users\utente\propilot-ai
npx tsx scripts/seed-listings.ts <TUO_USER_ID>
```

**Esempio:**
```powershell
npx tsx scripts/seed-listings.ts 123e4567-e89b-12d3-a456-426614174000
```

## Step 5: Avvia Server di Sviluppo

```powershell
npm run dev
```

Il server partirà su: **http://localhost:3000**

## Step 6: Verifica Dashboard

1. **Login/Registrazione:**
   - Vai su `http://localhost:3000/auth/signup` per registrarti
   - Oppure `http://localhost:3000/auth/login` per login

2. **Dashboard Prospecting:**
   - Vai su `http://localhost:3000/dashboard/prospecting`
   - Dovresti vedere 5 annunci di test con:
     - Badge "🏆 TOP DEAL" per lead_score >= 80
     - Barre di progresso per il punteggio
     - Statistiche in alto (chiamate oggi, appuntamenti settimana)

3. **Landing Page:**
   - Vai su `http://localhost:3000`
   - Dovresti vedere la landing page marketing

## Troubleshooting

### Errore: "Module not found"
```powershell
npm install
```

### Errore: "Environment variable not found"
- Verifica che `.env.local` esista nella root del progetto
- Riavvia il server dopo aver modificato `.env.local`

### Errore: "Database error" o "Table doesn't exist"
- Esegui le migration SQL in Supabase Dashboard
- Verifica che tutte le tabelle siano create

### Dashboard vuota dopo seed script
- Verifica che lo script sia stato eseguito correttamente
- Controlla che l'USER_ID sia corretto
- Vai su Supabase Dashboard → Table Editor → `external_listings` e verifica che i dati ci siano

### Port 3000 già in uso
```powershell
# Cambia porta in package.json o kill process:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

## Comandi Utili

### Verifica Connessione Database
```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM external_listings;
SELECT * FROM external_listings LIMIT 5;
```

### Verifica Variabili d'Ambiente (Windows)
```powershell
Get-Content .env.local | Select-String "SUPABASE"
```

### Logs del Server
I logs appariranno direttamente nel terminale quando esegui `npm run dev`

## Prossimi Passi

1. ✅ Server avviato
2. ✅ Dashboard popolata con dati di test
3. ✅ Verifica funzionalità:
   - Clicca "Chiama Ora" su un annuncio (richiede BLAND_AI_API_KEY)
   - Verifica filtri e ricerca
   - Controlla statistiche in tempo reale

---

**Buon lavoro! 🚀**

