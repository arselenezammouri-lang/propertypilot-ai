$content = Get-Content .env.local
$content = $content -replace 'NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=.*', 'NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_1StsWIA1is7KNmaevo6UdO0Z'
$content = $content -replace 'NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=.*', 'NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_1StsZEA1is7KNmae5XkGgEr4'
$content = $content -replace 'NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=.*', 'NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_1StsbAA1is7KNmae4taYsNtk'
$content | Set-Content .env.local
Write-Host "Stripe Price IDs updated successfully"
