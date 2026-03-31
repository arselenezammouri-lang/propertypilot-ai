# Pre-final push: pull, stato pulito, commit, push
# Esegui dalla root del progetto: .\scripts\pre-final-push.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "=== 1. Fetch e branch ===" -ForegroundColor Cyan
git fetch origin
$branch = git rev-parse --abbrev-ref HEAD
Write-Host "Branch attuale: $branch"

Write-Host "`n=== 2. Stato attuale ===" -ForegroundColor Cyan
git status --short

Write-Host "`n=== 3. Aggiungi tutto (rispetta .gitignore) ===" -ForegroundColor Cyan
git add -A
git status --short

Write-Host "`n=== 4. Commit se ci sono modifiche ===" -ForegroundColor Cyan
$diff = git diff --cached --name-only
if ($diff) {
    git commit -m "chore: pre-final push - smoke tests, readiness docs, env loader, TestSprite ready"
    Write-Host "Commit eseguito." -ForegroundColor Green
} else {
    Write-Host "Nessuna modifica da committare (già tutto committato)." -ForegroundColor Yellow
}

Write-Host "`n=== 5. Pull con rebase ===" -ForegroundColor Cyan
git pull --rebase origin $branch
if ($LASTEXITCODE -ne 0) {
    Write-Host "ATTENZIONE: pull fallito. Risolvi eventuali conflitti e poi: git push origin $branch" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== 6. Push ===" -ForegroundColor Cyan
git push origin $branch
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nPush completato. Repo pronto per test su TestSprite dashboard." -ForegroundColor Green
} else {
    Write-Host "Push fallito. Controlla remote e credenziali." -ForegroundColor Red
    exit 1
}
