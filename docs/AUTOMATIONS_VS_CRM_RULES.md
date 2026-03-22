# Automations vs CRM Rules

Due concetti distinti condividono il prefisso `/api/automations`; in **UI** hanno nomi e percorsi separati per evitare confusione.

## Workflow automazioni (follow-up / reminder / contenuti)

- **Cosa sono**: automazioni pianificate (follow-up email, reminder visite, contenuti settimanali) sulla tabella `automations`.
- **API**:
  - `GET/POST/PATCH/DELETE /api/automations` – CRUD
  - `POST /api/automations/execute` – esecuzione manuale
- **UI**: `/dashboard/automations` — etichetta prodotto **Workflow automazioni**; link incrociato verso le regole CRM.

## Regole CRM (if/then su eventi lead)

- **Cosa sono**: regole trigger → condizione → azione (nuovo lead, cambio stato, score, ecc.) sulla tabella `automations_rules`.
- **API**:
  - `GET/POST/PATCH/DELETE /api/automations/rules` – CRUD regole
  - `POST /api/automations/execute-rule` – esecuzione (anche da pipeline)
- **UI**: `/dashboard/crm/automations` — etichetta **Regole automazione CRM**; link incrociato verso i workflow.

**Navigazione**: nella sidebar CRM compaiono entrambe le voci, con descrizioni che chiariscono la differenza.

In futuro le regole CRM potrebbero essere spostate sotto `/api/crm/automation-rules` solo lato API (breaking change da pianificare).
