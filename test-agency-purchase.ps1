# 🚀 SCRIPT TEST ACQUISTO AGENCY - PropertyPilot AI
# Esegui: .\test-agency-purchase.ps1

Write-Host "🚀 PROPILOT AI - TEST ACQUISTO AGENCY (€897)" -ForegroundColor Cyan
Write-Host ""

# Verifica Stripe CLI
Write-Host "📋 Verificando Stripe CLI..." -ForegroundColor Yellow
try {
    $stripeVersion = stripe --version 2>&1
    Write-Host "✅ Stripe CLI trovato: $stripeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Stripe CLI non installato!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 INSTALLAZIONE:" -ForegroundColor Yellow
    Write-Host "1. Scarica da: https://github.com/stripe/stripe-cli/releases/latest" -ForegroundColor White
    Write-Host "2. Estrai stripe.exe e aggiungi al PATH" -ForegroundColor White
    Write-Host "   OPPURE" -ForegroundColor White
    Write-Host "3. Installa Scoop: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser; irm get.scoop.sh | iex" -ForegroundColor White
    Write-Host "4. Poi: scoop install stripe" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Verifica variabili d'ambiente
Write-Host ""
Write-Host "📋 Verificando variabili d'ambiente..." -ForegroundColor Yellow

$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    $envFile = ".env"
}

if (-not (Test-Path $envFile)) {
    Write-Host "❌ File .env.local o .env non trovato!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content $envFile -Raw
$agencyPriceId = $null

if ($envContent -match "NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=(.+)") {
    $agencyPriceId = $matches[1].Trim()
    Write-Host "✅ Price ID Agency trovato: $agencyPriceId" -ForegroundColor Green
} else {
    Write-Host "❌ NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID non trovato in $envFile" -ForegroundColor Red
    exit 1
}

# Richiedi User ID
Write-Host ""
Write-Host "📋 USER ID RICHIESTO" -ForegroundColor Yellow
Write-Host "Per ottenere il tuo user_id:" -ForegroundColor White
Write-Host "1. Vai su Supabase Dashboard → Authentication → Users" -ForegroundColor White
Write-Host "2. Copia l'ID del tuo utente (UUID)" -ForegroundColor White
Write-Host "   OPPURE" -ForegroundColor White
Write-Host "3. Esegui: node get-user-id.mjs" -ForegroundColor White
Write-Host ""
$userId = Read-Host "Incolla il tuo USER_ID qui"

if ([string]::IsNullOrWhiteSpace($userId)) {
    Write-Host "❌ User ID non fornito!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ User ID: $userId" -ForegroundColor Green

# Verifica login Stripe
Write-Host ""
Write-Host "📋 Verificando login Stripe..." -ForegroundColor Yellow
try {
    $stripeWhoami = stripe whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Sei loggato in Stripe CLI" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Non sei loggato. Eseguendo login..." -ForegroundColor Yellow
        Write-Host "   (Si aprirà il browser per autenticarti)" -ForegroundColor White
        stripe login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Login fallito!" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "❌ Errore durante verifica login Stripe" -ForegroundColor Red
    exit 1
}

# Istruzioni per webhook forwarding
Write-Host ""
Write-Host "📋 WEBHOOK FORWARDING" -ForegroundColor Yellow
Write-Host "IMPORTANTE: In un terminale SEPARATO, esegui:" -ForegroundColor White
Write-Host "  stripe listen --forward-to http://localhost:3000/api/stripe/webhook" -ForegroundColor Cyan
Write-Host ""
Write-Host "Copia il 'whsec_xxxxx' che appare e aggiungilo a .env.local:" -ForegroundColor White
Write-Host "  STRIPE_WEBHOOK_SECRET=whsec_xxxxx" -ForegroundColor Cyan
Write-Host ""
Write-Host "Poi riavvia il server Next.js (npm run dev)" -ForegroundColor White
Write-Host ""
$continue = Read-Host "Hai avviato il webhook forwarding? (s/n)"

if ($continue -ne "s" -and $continue -ne "S") {
    Write-Host "⚠️  Avvia il webhook forwarding prima di continuare!" -ForegroundColor Yellow
    exit 0
}

# Crea checkout session
Write-Host ""
Write-Host "🚀 Creando checkout session per Agency Plan..." -ForegroundColor Cyan
Write-Host ""

$checkoutCmd = "stripe checkout sessions create " +
    "--success-url `"http://localhost:3000/dashboard?success=true`" " +
    "--cancel-url `"http://localhost:3000/dashboard?canceled=true`" " +
    "--mode subscription " +
    "--line-items[0][price]=$agencyPriceId " +
    "--line-items[0][quantity]=1 " +
    "--metadata[userId]=$userId " +
    "--metadata[paymentType]=subscription"

Write-Host "Comando:" -ForegroundColor Yellow
Write-Host $checkoutCmd -ForegroundColor Gray
Write-Host ""

try {
    $checkoutResult = Invoke-Expression $checkoutCmd 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        # Estrai URL dal risultato
        if ($checkoutResult -match '"url":\s*"([^"]+)"') {
            $checkoutUrl = $matches[1]
            Write-Host "✅ Checkout session creata!" -ForegroundColor Green
            Write-Host ""
            Write-Host "🌐 APRI QUESTO URL NEL BROWSER:" -ForegroundColor Cyan
            Write-Host $checkoutUrl -ForegroundColor Yellow
            Write-Host ""
            Write-Host "💳 CARD DI TEST:" -ForegroundColor Cyan
            Write-Host "   Numero: 4242 4242 4242 4242" -ForegroundColor White
            Write-Host "   Scadenza: 12/25 (qualsiasi data futura)" -ForegroundColor White
            Write-Host "   CVC: 123 (qualsiasi 3 cifre)" -ForegroundColor White
            Write-Host "   ZIP: 12345 (qualsiasi 5 cifre)" -ForegroundColor White
            Write-Host ""
            Write-Host "📊 Dopo il pagamento, verifica:" -ForegroundColor Cyan
            Write-Host "   1. Terminale 'stripe listen' mostra eventi webhook" -ForegroundColor White
            Write-Host "   2. Supabase → subscriptions → status = 'agency'" -ForegroundColor White
            Write-Host "   3. Dashboard mostra piano Agency attivo" -ForegroundColor White
            Write-Host "   4. Badge 💎 SOLDI appare per lead con score > 90" -ForegroundColor White
            Write-Host ""
            
            # Apri browser automaticamente
            Start-Process $checkoutUrl
        } else {
            Write-Host "⚠️  Checkout creato ma URL non trovato. Output:" -ForegroundColor Yellow
            Write-Host $checkoutResult -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ Errore durante creazione checkout:" -ForegroundColor Red
        Write-Host $checkoutResult -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Errore:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ TEST COMPLETATO!" -ForegroundColor Green
