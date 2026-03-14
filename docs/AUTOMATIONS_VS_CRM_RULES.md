# Automations vs CRM Rules

Due concetti distinti condividono il path `/api/automations`; qui la differenza.

## Automations (Dashboard)

- **Cosa sono**: flussi di automazione configurati dalla dashboard (trigger, azioni).
- **API**:
  - `GET/POST /api/automations` – CRUD automazioni
  - `POST /api/automations/execute` – esecuzione manuale/trigger
- **UI**: Dashboard → Automations.

## CRM Rules (Regole lead/CRM)

- **Cosa sono**: regole automatiche sul CRM (es. assegnazione lead, cambio stato, notifiche).
- **API**:
  - `GET/POST /api/automations/rules` – CRUD regole
  - `POST /api/automations/execute-rule` – esecuzione di una regola
- **UI**: Dashboard → CRM → Automations (impostazioni automazioni CRM).

In futuro le regole CRM potrebbero essere spostate sotto `/api/crm/automation-rules` per chiarezza.
