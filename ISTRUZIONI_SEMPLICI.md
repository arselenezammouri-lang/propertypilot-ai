# ✅ Istruzioni Semplici - Avvio Server

## 🚀 Come Avviare il Server (SEMPRE)

### Metodo 1: Script Automatico (RACCOMANDATO)
```powershell
.\fix-all.ps1
```

### Metodo 2: Manuale
```powershell
# 1. Ferma tutto
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Pulisci cache
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Avvia server
$env:NEXT_DISABLE_TURBO = "1"
npm run dev
```

---

## ⏱️ Attendi 60-90 secondi

Nel terminale vedrai:
```
✓ Compiled / in X.Xs
✓ Ready in X.Xs
Local: http://localhost:3000
```

---

## ✅ Verifica

1. Apri: http://localhost:3000
2. Hard Refresh: `Ctrl + Shift + R`
3. Dovresti vedere la homepage

---

## 🚨 Se Vedi Errori

Esegui di nuovo:
```powershell
.\fix-all.ps1
```

---

**Semplice e funziona sempre! 🎯**
