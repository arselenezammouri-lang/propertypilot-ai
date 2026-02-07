# 🚀 Script PowerShell - Riavvio Server PropertyPilot AI
# Esegui questo script quando il server è bloccato

Write-Host "`n🛑 Fermo tutti i processi Node...`n" -ForegroundColor Yellow

# Ferma tutti i processi Node
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Libera la porta 3000
Write-Host "🔓 Libero la porta 3000...`n" -ForegroundColor Yellow
$connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($connections) {
    $connections | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✅ Porta 3000 liberata`n" -ForegroundColor Green
}

# Rimuovi cache e lock
Write-Host "🧹 Pulisco cache e lock files...`n" -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✅ Cache rimossa`n" -ForegroundColor Green
}

# Verifica che tutto sia pulito
Write-Host "🔍 Verifica finale...`n" -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "⚠️  Ancora processi Node attivi, li fermo...`n" -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
}

$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if (-not $port3000) {
    Write-Host "✅ Porta 3000 libera`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  Porta 3000 ancora occupata`n" -ForegroundColor Yellow
}

# Avvia server
Write-Host "🚀 Avvio server...`n" -ForegroundColor Cyan
Write-Host "⏳ Attendi 60-90 secondi per la compilazione iniziale`n" -ForegroundColor Yellow
Write-Host "📝 Quando vedi '✓ Ready' nel terminale, apri: http://localhost:3000`n" -ForegroundColor Cyan

# Disabilita Turbopack e avvia
$env:NEXT_DISABLE_TURBO = "1"
npm run dev
