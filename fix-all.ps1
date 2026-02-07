# 🚀 Script Definitivo - Risolve TUTTI i Problemi
# Esegui questo script quando hai problemi con il server

Write-Host "`n🛑 FERMO TUTTO...`n" -ForegroundColor Red

# 1. Ferma TUTTI i processi Node
Write-Host "1️⃣  Fermo tutti i processi Node...`n" -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# 2. Libera porte 3000 e 3001
Write-Host "2️⃣  Libero porte 3000 e 3001...`n" -ForegroundColor Yellow
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $connections | ForEach-Object {
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        Write-Host "   ✅ Porta $port liberata" -ForegroundColor Green
    }
}
Start-Sleep -Seconds 2

# 3. Rimuovi cache e lock
Write-Host "`n3️⃣  Pulisco cache e lock...`n" -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    Write-Host "   ✅ Cache .next rimossa" -ForegroundColor Green
}

# Rimuovi lock file se esiste ancora
if (Test-Path ".next\dev\lock") {
    Remove-Item -Path ".next\dev\lock" -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ Lock file rimosso" -ForegroundColor Green
}

# 4. Verifica finale
Write-Host "`n4️⃣  Verifica finale...`n" -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   ⚠️  Ancora processi Node, li fermo...`n" -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
} else {
    Write-Host "   ✅ Nessun processo Node attivo" -ForegroundColor Green
}

$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if (-not $port3000) {
    Write-Host "   ✅ Porta 3000 libera" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Porta 3000 ancora occupata - processo: $($port3000.OwningProcess)" -ForegroundColor Yellow
}

# 5. Avvia server
Write-Host "`n🚀 AVVIO SERVER...`n" -ForegroundColor Cyan
Write-Host "⏳ Attendi 60-90 secondi per la compilazione iniziale`n" -ForegroundColor Yellow
Write-Host "📝 Quando vedi '✓ Ready' nel terminale (SENZA Turbopack), apri: http://localhost:3000`n" -ForegroundColor Cyan
Write-Host "Se vedi ancora errori, esegui di nuovo questo script`n" -ForegroundColor White

# Disabilita Turbopack e avvia server
$env:NEXT_DISABLE_TURBO = "1"
npm run dev
