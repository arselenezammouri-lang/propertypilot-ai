# Founder Checklist – Go-Live PropertyPilot AI

## 1. Vercel – Environment Variables

In **Vercel → Project → Settings → Environment Variables** verifica:

| Variabile | Valore | Note |
|-----------|--------|------|
| `NEXT_PUBLIC_APP_URL` | `https://propertypilot-ai.vercel.app` | Obbligatorio |
| `NEXT_PUBLIC_SUPABASE_URL` | (da Supabase) | Obbligatorio |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (da Supabase) | Obbligatorio |
| `SUPABASE_SERVICE_ROLE_KEY` | (da Supabase) | Obbligatorio |
| `OPENAI_API_KEY` | (da OpenAI) | Obbligatorio |
| `STRIPE_SECRET_KEY` o `TESTING_STRIPE_SECRET_KEY` | (da Stripe) | Obbligatorio |
| `STRIPE_WEBHOOK_SECRET` | (da Stripe) | Obbligatorio |
| `SESSION_SECRET` | stringa casuale | Obbligatorio |
| `RESEND_API_KEY` | (da Resend) | Email welcome/notifiche |
| `RESEND_FROM_EMAIL` | es. `noreply@tudominio.com` | Dominio verificato su Resend |
| `BLAND_AI_API_KEY` | (da Bland AI) | Voice calling (opzionale) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` | (da Google Cloud) | Calendar sync (opzionale) |

Poi fai **Redeploy** per applicare le modifiche.

---

## 2. Supabase – Auth Redirect URLs

In **Supabase → Authentication → URL Configuration** aggiungi:

- **Site URL:** `https://propertypilot-ai.vercel.app`
- **Redirect URLs:**  
  `https://propertypilot-ai.vercel.app/**`  
  `https://propertypilot-ai.vercel.app/auth/callback`

---

## 3. Stripe – Webhook

In **Stripe Dashboard → Developers → Webhooks**:

1. Clicca **Add endpoint**
2. **Endpoint URL:** `https://propertypilot-ai.vercel.app/api/stripe/webhook`
3. Eventi: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
4. Copia il **Signing secret** (whsec_...) e impostalo come `STRIPE_WEBHOOK_SECRET` su Vercel

---

## 4. Bland AI (opzionale – Voice Calling)

Se usi le chiamate automatiche:

1. Bland AI Dashboard → Webhooks
2. Aggiungi: `https://propertypilot-ai.vercel.app/api/prospecting/call/webhook`
3. Imposta `BLAND_AI_API_KEY` su Vercel

---

## 5. Resend (opzionale – Email)

1. Crea account su resend.com
2. Verifica il dominio per `RESEND_FROM_EMAIL`
3. Copia l’API key e impostala come `RESEND_API_KEY` su Vercel

---

## 6. Test manuale consigliato

1. Registrazione: crea un account
2. Login / Logout
3. Dashboard: verifica che carichi correttamente
4. Aria Coach: messaggio di benvenuto
5. Elite Deals: badge SOLDI su Miami/Milano
6. Cambio lingua: IT → EN → ES
7. Billing: avvia checkout (usa carta di test Stripe)
8. Pagamento: completa un pagamento di test

---

## 7. Informazioni personali da inserire

- **Nessuna informazione personale obbligatoria** per il go-live
- Opzionalmente in Supabase: profilo founder (admin force-login usa `arselenezammouri@gmail.com` e un UUID specifico; va aggiornato se cambi account founder)

---

## Fix applicati in codice

- URL: tutti i riferimenti a Replit sostituiti con `propertypilot-ai.vercel.app`
- Stripe: portal e checkout-oneshot usano `request.nextUrl.origin`
- Template email: link dinamici con `NEXT_PUBLIC_APP_URL`
- Sitemap e robots: base URL aggiornato
- Admin force-login: redirect aggiornato
