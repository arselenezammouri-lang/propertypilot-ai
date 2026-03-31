# 📡 API Documentation - PropertyPilot AI

**Versione:** 1.0.0  
**Base URL:** `https://your-domain.com/api`

---

## 🔐 Autenticazione

Tutte le API (eccetto quelle pubbliche) richiedono autenticazione tramite Supabase Auth.

### Headers Richiesti

```http
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json
```

### Gestione Errori

Tutte le API restituiscono errori nel formato:

```json
{
  "error": "ErrorName",
  "message": "Human-readable error message",
  "details": {}
}
```

Codici di stato HTTP:
- `200` - Successo
- `201` - Creato
- `400` - Bad Request (validazione fallita)
- `401` - Unauthorized (non autenticato)
- `403` - Forbidden (non autorizzato, subscription richiesta)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error
- `503` - Service Unavailable (servizio esterno non disponibile)

---

## 📋 Endpoint Pubblici

### Health Check

```http
GET /api/health
```

Verifica lo stato del server.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

### Lead Capture (Pubblico)

```http
POST /api/public/lead-capture
```

Cattura lead da form pubblici.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "Interested in property"
}
```

**Response:**
```json
{
  "success": true,
  "leadId": "lead-123"
}
```

---

## 🔑 Autenticazione

### Setup User

```http
POST /api/auth/setup-user
```

Configura profilo utente dopo signup.

**Body:**
```json
{
  "name": "John Doe",
  "company": "Real Estate Co"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "user-123"
}
```

---

## 💳 Stripe / Pagamenti

### Checkout (Subscription)

```http
POST /api/stripe/checkout
```

Crea sessione Stripe Checkout per subscription.

**Body:**
```json
{
  "plan": "pro" // "starter" | "pro" | "agency"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

---

### Checkout (One-time)

```http
POST /api/stripe/checkout-oneshot
```

Crea sessione Stripe Checkout per pagamento one-time.

**Body:**
```json
{
  "package": "boost" // "boost" | altri package
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

---

### Webhook

```http
POST /api/stripe/webhook
```

Endpoint per webhook Stripe. Richiede signature verification.

**Headers:**
```http
stripe-signature: <stripe_signature>
```

**Eventi gestiti:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

### Upgrade Subscription

```http
POST /api/stripe/upgrade
```

Aggiorna subscription a piano superiore.

**Body:**
```json
{
  "newPlan": "pro"
}
```

---

### Sync Subscription

```http
POST /api/stripe/sync
```

Sincronizza subscription da Stripe a database.

---

### Diagnose

```http
GET /api/stripe/diagnose
```

Diagnostica problemi con Stripe.

---

## 🤖 AI / Generazione Contenuto

### Generate Comprehensive

```http
POST /api/generate-comprehensive
```

Genera contenuto completo per listing immobiliare.

**Body:**
```json
{
  "address": "123 Main St, City",
  "price": 500000,
  "propertyType": "apartment",
  "transactionType": "sale",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 120,
  "locale": "it" // opzionale, default: browser locale
}
```

**Response:**
```json
{
  "title": "Stunning 3BR Apartment in City Center",
  "description": "...",
  "highlights": ["...", "..."],
  "features": ["...", "..."],
  "location": "...",
  "investment": "..."
}
```

**Rate Limit:** 10 richieste/ora per utente FREE, 100/ora per PRO/AGENCY

---

### Refine Listing

```http
POST /api/refine-listing
```

Raffina/ottimizza listing esistente.

**Body:**
```json
{
  "listingId": "listing-123",
  "improvements": ["more emotional", "add investment angle"]
}
```

---

### Translate Listing

```http
POST /api/translate-listing
```

Traduce listing in altra lingua.

**Body:**
```json
{
  "listingId": "listing-123",
  "targetLanguage": "en"
}
```

---

### Generate Social Posts

```http
POST /api/social-posts
```

Genera post social media da listing.

**Body:**
```json
{
  "listingId": "listing-123",
  "platform": "instagram" // "instagram" | "facebook" | "linkedin"
}
```

---

### Generate Agent Bio

```http
POST /api/agent-bio
```

Genera bio agente immobiliare.

**Body:**
```json
{
  "name": "John Doe",
  "experience": "10 years",
  "specialization": "luxury properties"
}
```

---

### Generate Perfect Copy

```http
POST /api/perfect-copy
```

Genera copy perfetto per listing.

**Body:**
```json
{
  "listingId": "listing-123",
  "tone": "luxury" // "luxury" | "family" | "investment"
}
```

---

## 📊 Leads Management

### Get Leads

```http
GET /api/leads
```

Ottiene lista leads dell'utente.

**Query Parameters:**
- `status` - Filtra per status
- `limit` - Numero risultati (default: 50)
- `offset` - Paginazione

**Response:**
```json
{
  "leads": [
    {
      "id": "lead-123",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "new",
      "score": 85,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100
}
```

---

### Get Lead

```http
GET /api/leads/:id
```

Ottiene dettagli singolo lead.

---

### Update Lead

```http
PUT /api/leads/:id
```

Aggiorna lead.

**Body:**
```json
{
  "status": "contacted",
  "notes": "Called on 2024-01-01"
}
```

---

### Generate Follow-up

```http
POST /api/leads/:id/followup
```

Genera messaggio follow-up AI per lead.

**Body:**
```json
{
  "locale": "it" // opzionale
}
```

**Response:**
```json
{
  "message": "Hi John, I wanted to follow up on...",
  "tone": "professional"
}
```

---

## 🏠 Listings Management

### Get Listings

```http
GET /api/listings
```

Ottiene lista listings dell'utente.

**Query Parameters:**
- `status` - Filtra per status
- `limit` - Numero risultati
- `offset` - Paginazione

---

### Get Listing

```http
GET /api/listings/:id
```

Ottiene dettagli singolo listing.

---

### Create Listing

```http
POST /api/listings
```

Crea nuovo listing.

**Body:**
```json
{
  "address": "123 Main St",
  "price": 500000,
  "propertyType": "apartment",
  "transactionType": "sale"
}
```

---

### Update Listing

```http
PUT /api/listings/:id
```

Aggiorna listing.

---

### Delete Listing

```http
DELETE /api/listings/:id
```

Elimina listing.

---

## 🔍 Prospecting

### Get Prospecting Listings

```http
GET /api/prospecting/listings
```

Ottiene lista properties per prospecting.

**Query Parameters:**
- `location` - Filtra per location
- `minPrice` - Prezzo minimo
- `maxPrice` - Prezzo massimo

---

### Get Prospecting Listing

```http
GET /api/prospecting/listings/:id
```

Ottiene dettagli singola property per prospecting.

---

### Update Prospecting Listing

```http
PUT /api/prospecting/listings/:id
```

Aggiorna property prospecting (es. aggiunge note).

---

### Automate Prospecting

```http
POST /api/prospecting/automate
```

Avvia automazione prospecting.

**Body:**
```json
{
  "criteria": {
    "location": "Milan",
    "minPrice": 200000,
    "maxPrice": 500000
  },
  "frequency": "daily"
}
```

---

### Call Webhook (Bland AI)

```http
POST /api/prospecting/call/webhook
```

Webhook per esiti chiamate Bland AI.

---

## 📈 Analytics

### Track Event

```http
POST /api/analytics/track
```

Traccia evento custom.

**Body:**
```json
{
  "event": "button_click",
  "properties": {
    "button": "get_started",
    "page": "/"
  }
}
```

---

### Web Vitals

```http
POST /api/analytics/web-vitals
```

Invia Core Web Vitals data.

**Body:**
```json
{
  "name": "LCP",
  "value": 2500,
  "id": "metric-id",
  "delta": 2500,
  "entries": []
}
```

---

## 👤 User Management

### Get User Profile

```http
GET /api/user/profile
```

Ottiene profilo utente.

---

### Update User Profile

```http
PUT /api/user/profile
```

Aggiorna profilo utente.

**Body:**
```json
{
  "name": "John Doe",
  "company": "Real Estate Co",
  "phone": "+1234567890"
}
```

---

### Get Subscription

```http
GET /api/user/subscription
```

Ottiene subscription corrente.

**Response:**
```json
{
  "plan": "pro",
  "status": "active",
  "currentPeriodEnd": "2024-02-01T00:00:00.000Z",
  "cancelAtPeriodEnd": false
}
```

---

## 🎯 Rate Limiting

Tutti gli endpoint AI hanno rate limiting:

- **FREE:** 10 richieste/ora
- **PRO:** 100 richieste/ora
- **AGENCY:** 500 richieste/ora

Quando il limite è raggiunto, l'API restituisce `429 Too Many Requests`.

---

## 🔒 Subscription Requirements

Alcuni endpoint richiedono subscription attiva:

- `POST /api/generate-comprehensive` - Richiede PRO o AGENCY
- `POST /api/prospecting/automate` - Richiede PRO o AGENCY
- Altri endpoint premium

Se la subscription non è attiva, l'API restituisce `403 Forbidden`.

---

## 📝 Note

- Tutti i timestamp sono in formato ISO 8601
- Tutti i prezzi sono in centesimi (es. 500000 = €5000.00)
- Le date sono in formato ISO 8601
- Il locale supportato è: `it`, `en`, `es`, `fr`, `de`, `ar`

---

**Ultimo aggiornamento:** ${new Date().toISOString()}
