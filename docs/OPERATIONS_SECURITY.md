# Operations & security — PropertyPilot AI

Guida per **chi gestisce produzione** (Vercel, log, dipendenze). Complementare a [SECURITY_HARDENING.md](./SECURITY_HARDENING.md) e [VERCEL_DEPLOY_CHECKLIST.md](./VERCEL_DEPLOY_CHECKLIST.md).

---

## 1. Vercel Firewall / WAF (consigliato in produzione)

L’app ha limiti Edge + Upstash nel codice, ma **Vercel Firewall** (piano a pagamento / Enterprise) aggiunge:

- Regole per path, metodo, paese, IP, User-Agent
- Rate limiting **centralizzato** indipendente dalle repliche Node
- Integrazione con il traffico reale prima che tocchi l’applicazione

**Azioni:**

1. Vercel Dashboard → progetto → **Security** / **Firewall** (nome esatto può variare).
2. Abilita regole base: blocco pattern noti, limiti aggressivi su `/api/*` se necessario.
3. Escludi esplicitamente i path webhook se usi firme dedicate: `/api/stripe/webhook`, `/api/prospecting/call/webhook` (già esclusi dal rate limit generico in middleware, ma il WAF è un layer separato).

Documentazione ufficiale: [Vercel — Firewall](https://vercel.com/docs/security/firewall) (verifica URL aggiornato nel prodotto).

---

## 2. Cloudflare (opzionale davanti al dominio)

Se il DNS punta a Cloudflare:

- **DDoS** e **Bot Fight Mode** / Bot Management
- **Turnstile** (già integrato in-app su login/signup)
- Regole WAF aggiuntive

Coordinare con `API_ALLOWED_ORIGINS` e header `Origin` quando si testano form embed.

---

## 2b. Rete applicativa: Edge middleware e rate limit

Il traffico verso `/api/*` passa dal **middleware Edge** (`middleware.ts`):

- **Bot guard** (UA vuoto / scanner): risposta `403` quando abilitato da env.
- **Rate limit**: bucket **generale**, **AI costose** e opzionale **AI per utente** (Upstash Redis quando `UPSTASH_REDIS_REST_*` è configurato; altrimenti limite **in-memory** per istanza).
- **Fail-open**: se Redis non è raggiungibile o non configurato, il codice tende a **non bloccare** il traffico legittimo (degradazione verso limiti in-memory o assenza di limite distribuito), così un outage Upstash non spegne il prodotto — a costo di meno protezione uniforme tra le repliche finché Redis non torna.

**Operatività:** monitorare log `security_audit` con `action":"edge_rate_limit"`; in picchi anomali verificare quote Upstash e, se serve, stringere `EDGE_*_RATE_LIMIT_*` o aggiungere WAF (§1).

---

## 3. Log e `security_audit` (JSON)

In produzione, `SECURITY_AUDIT_LOG` è attivo di default. Ogni evento è **una riga JSON** su stdout (raccolta da Vercel Log Drain o UI).

Campi tipici:

| Campo | Significato |
|-------|-------------|
| `type` | sempre `security_audit` |
| `action` | `edge_bot_block`, `edge_rate_limit`, … |
| `detail` | sottotipo (`upstash`, `ai_upstash`, `ai_user_upstash`, `general`, `ai`, `ai_user`, …) |
| `path`, `method`, `status` | contesto richiesta |
| `ip_hash` | presente se `SECURITY_AUDIT_IP_SALT` è impostato |
| `origin` | su alcuni eventi origin-reject |

**Esempi di uso:**

- **Vercel**: filtra log per `"type":"security_audit"` o `action":"edge_rate_limit"`.
- **Export / SIEM**: Log Drain → Datadog / Better Stack / BigQuery; crea alert su picchi di `edge_rate_limit` o `edge_bot_block`.
- **Rotazione salt**: cambiare `SECURITY_AUDIT_IP_SALT` invalida le correlazioni storiche per IP (utile dopo incident).

---

## 4. Dipendenze e CI

- **Dependabot**: `.github/dependabot.yml` — PR settimanali npm (e workflow actions).
- **GitHub Actions**: job `security` — **`npm audit --audit-level=critical`** blocca il merge su vulnerabilità **critical**; un secondo passo con `high` è **solo informativo** (log) perché alcune dipendenze (es. `xlsx` community, catena `eslint-config-next`/`glob`, patch Next successive alla 14.x) richiedono upgrade major pianificati.

**Debito noto da pianificare:**

- **`xlsx`**: advisory high senza fix upstream nella linea attuale — valutare `exceljs` o parsing server-side controllato / file solo da fonti fidate.
- **Next.js**: aggiornato a **14.2.35** (patch) per chiudere advisory **critical** note sulla 14.2.15. Le advisory **high** residue su 14.2.x e toolchain richiedono upgrade major quando il prodotto è pronto (15+ / 16).

Dopo merge di dipendenze: `npm ci`, `npm test`, smoke su staging.

---

## 5. Rotazione segreti (disciplina)

| Tipo | Quando ruotare |
|------|----------------|
| Chiavi esposte in chat / screenshot | **Subito** |
| `SUPABASE_SERVICE_ROLE_KEY`, Stripe secret, OpenAI | A cadenza o dopo offboarding admin |
| `SECURITY_AUDIT_IP_SALT` | Dopo incident o periodicamente (perde correlazione IP) |
| `STRIPE_WEBHOOK_SECRET` | Se webhook endpoint compromesso o refactor endpoint |

Mai committare `.env.local`. Produzione solo **Vercel Environment Variables**.

---

## 6. Checklist rapida post-incident

1. Identificare `action` / `detail` nei log `security_audit`.
2. Stringere temporaneamente `EDGE_API_RATE_LIMIT_*` o WAF Vercel.
3. Ruotare segreti coinvolti.
4. Aggiungere path a `ai-costly-api-path.ts` se una nuova route LLM non era coperta.
