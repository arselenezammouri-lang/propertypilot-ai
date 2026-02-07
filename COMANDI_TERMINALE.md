# 🚀 Comandi Terminale - Riavvio Server

## ✅ COMANDI DA ESEGUIRE (uno alla volta):

### 1. Ferma tutti i processi Node
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 2. Pulisci la cache Next.js
```powershell
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
```

### 3. Avvia il server (ATTENDI 30 secondi)
```powershell
npm run dev
```

---

## ⏳ DOPO L'AVVIO:

1. **Attendi 30 secondi** per la compilazione completa
2. **Apri browser:** http://localhost:3000
3. **Fai HARD REFRESH:**
   - **Windows:** `Ctrl + Shift + R`
   - **Oppure:** `Ctrl + F5`
   - Questo pulisce la cache del browser!

---

## 🔍 VERIFICA:

Se vedi ancora la vecchia versione:
1. Chiudi completamente il browser
2. Riapri il browser
3. Vai su http://localhost:3000
4. Fai HARD REFRESH (`Ctrl + Shift + R`)

---

## ✅ QUANDO VEDI LA NUOVA VERSIONE:

Dovresti vedere:
- ✅ Background nero (#000000)
- ✅ Font Inter/Geist
- ✅ Design system perfetto
- ✅ Logo PropertyPilot AI
- ✅ Nessun errore in console

---

**Esegui questi comandi nella terminale PowerShell!**
