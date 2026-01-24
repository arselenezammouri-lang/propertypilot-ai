# Stripe Live Production Checklist

## ✅ Passi per il Lancio in Produzione

### 1. Genera le API Keys Live su Stripe Dashboard

1. Vai su https://dashboard.stripe.com/apikeys
2. Assicurati di essere in modalità **Live** (toggle in alto a destra)
3. Copia le seguenti chiavi:
   - **Publishable key** (inizia con `pk_live_`)
   - **Secret key** (inizia con `sk_live_`)

### 2. Crea i Price IDs Live per i Piani

1. Vai su **Products** → **+ Add product**
2. Crea i seguenti prodotti:
   - **STARTER**: €97/mese (mensile ricorrente)
   - **PRO**: €297/mese (mensile ricorrente)
   - **AGENCY**: €597/mese (mensile ricorrente)
3. Copia i **Price IDs** (iniziano con `price_`)

### 3. Configura Webhook Endpoint

1. Vai su **Developers** → **Webhooks**
2. Clicca **+ Add endpoint**
3. URL endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Seleziona questi eventi:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copia il **Signing secret** (inizia con `whsec_`)

### 4. Aggiorna Variabili d'Ambiente

Nel file `.env.local` (o nelle variabili d'ambiente del tuo hosting), aggiorna:

```bash
# Stripe Live Keys
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Stripe Live Price IDs
STRIPE_PRICE_ID_STARTER=price_YOUR_STARTER_PRICE_ID
STRIPE_PRICE_ID_PRO=price_YOUR_PRO_PRICE_ID
STRIPE_PRICE_ID_AGENCY=price_YOUR_AGENCY_PRICE_ID
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_YOUR_STARTER_PRICE_ID
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_YOUR_PRO_PRICE_ID
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_YOUR_AGENCY_PRICE_ID
```

### 5. Aggiorna lib/stripe/config.ts

Assicurati che il file `lib/stripe/config.ts` usi le variabili d'ambiente corrette:

```typescript
export const STRIPE_PRICE_IDS = {
  STARTER: process.env.STRIPE_PRICE_ID_STARTER || process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  PRO: process.env.STRIPE_PRICE_ID_PRO || process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  AGENCY: process.env.STRIPE_PRICE_ID_AGENCY || process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID,
};
```

### 6. Test del Webhook

1. Installa Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Testa un evento: `stripe trigger checkout.session.completed`
3. Verifica che il webhook aggiorni correttamente `profiles.subscription_plan`

### 7. Verifica Database

Assicurati che la tabella `profiles` abbia la colonna `subscription_plan` e che il webhook la aggiorni correttamente:

```sql
-- Verifica struttura
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name LIKE '%subscription%';

-- Test update (simula webhook)
UPDATE profiles 
SET subscription_plan = 'pro' 
WHERE id = 'your-test-user-id';
```

### 8. Test Checkout Completo

1. Vai su `/dashboard/settings/billing` (o `/pricing`)
2. Clicca "Upgrade to PRO" (o altro piano)
3. Usa carta di test Stripe:
   - Carta valida: `4242 4242 4242 4242`
   - Data scadenza: qualsiasi data futura
   - CVC: qualsiasi 3 cifre
4. Completa il checkout
5. Verifica che:
   - Il webhook riceva l'evento
   - `profiles.subscription_plan` sia aggiornato
   - L'utente possa accedere alle funzionalità PRO

### 9. Monitoraggio Post-Lancio

1. **Stripe Dashboard**: Monitora i pagamenti e gli errori
2. **Logs**: Controlla i log del server per errori webhook
3. **Database**: Verifica che tutti i checkout completati aggiornino correttamente il piano

### 10. Sicurezza

- ✅ **Mai committare** le chiavi live nel repository
- ✅ Usa variabili d'ambiente sicure (Vercel, Railway, etc.)
- ✅ Verifica sempre la signature del webhook
- ✅ Usa HTTPS per il webhook endpoint

## ⚠️ Note Importanti

- **Test Mode vs Live Mode**: Assicurati di non mescolare chiavi test e live
- **Price IDs**: Ogni ambiente (test/live) ha Price IDs diversi
- **Webhook Secret**: Il secret cambia quando ricrei il webhook
- **Refund Policy**: Configura la politica di rimborso su Stripe Dashboard

## 🚀 Ready for Launch!

Una volta completati tutti i passaggi, sei pronto per accettare pagamenti reali!

