# Environment Variables - Global Launch

## Nuove Variabili Richieste

### Crittografia
```bash
# Chiave di crittografia AES-256 (genera con: openssl rand -hex 32)
ENCRYPTION_KEY=your-256-bit-encryption-key-here

# Salt per hash (genera con: openssl rand -hex 16)
HASH_SALT=your-hash-salt-here
```

### Exchange Rates (Opzionale - per produzione)
```bash
# API Key per exchangerate-api.com o simile
EXCHANGE_RATE_API_KEY=your-api-key-here
EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest
```

## Variabili Esistenti

Tutte le variabili esistenti rimangono valide:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `BLAND_AI_API_KEY`
- `RESEND_API_KEY`
- `GOOGLE_CLIENT_ID` (per Google Calendar Sync)
- `GOOGLE_CLIENT_SECRET` (per Google Calendar Sync)
- `GOOGLE_REFRESH_TOKEN` (per Google Calendar Sync - OAuth2 refresh token)

## Google Calendar OAuth2 Setup

Per configurare Google Calendar Sync (richiesto per piano Agency):

1. Vai a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona uno esistente
3. Abilita Google Calendar API
4. Crea credenziali OAuth 2.0 (tipo "Desktop app" o "Web application")
5. Scarica le credenziali e ottieni:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
6. Genera un refresh token seguendo [questa guida](https://developers.google.com/identity/protocols/oauth2/web-server#obtainingaccesstoken)

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
```

**Nota**: Il refresh token permette l'accesso continuo al calendario senza dover ri-autenticare l'utente ogni volta.

## Note

- **ENCRYPTION_KEY**: DEVE essere una stringa esadecimale di 64 caratteri (256 bit)
- **HASH_SALT**: DEVE essere una stringa esadecimale di 32 caratteri (128 bit)
- **GOOGLE_REFRESH_TOKEN**: Deve essere generato tramite OAuth2 flow (vedi setup sopra)
- In produzione, usa un Key Management Service (AWS KMS, Google Cloud KMS, etc.)
- Non committare mai queste chiavi nel repository

