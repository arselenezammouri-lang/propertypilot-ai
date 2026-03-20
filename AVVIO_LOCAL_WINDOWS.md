# Avvio su Windows (localhost) — checklist

Se vedi **«Missing script: dev:free-port»**, **404 su /dashboard**, **schermo vuoto**, **Sei Offline** su porte diverse: segui **solo questi passi**, nell’ordine.

## 0) Emergenza — senza script nel `package.json`

Se **`npm run dev:free-port`** o **`npm run dev:clean`** danno *Missing script*, puoi ottenere lo stesso effetto **subito** (dalla cartella del progetto, dopo `npm install`):

```powershell
npx --yes kill-port 3000 3001 3002
npx next dev -p 3000
```

Nel terminale deve comparire **`http://localhost:3000`**. Il browser deve usare **esattamente quella porta** (se il terminale dice 3001/3002, quello è l’URL giusto — ma con i comandi sopra resti su 3000).

Verifica di essere nel repo giusto:

```powershell
git remote -v
```

Dovresti vedere `github.com/arselenezammouri-lang/propertypilot-ai` (o il tuo fork di quello).  
Cartelle tipo `propilot-ai` **senza** pull del branch aggiornato restano senza gli script npm: usa la sezione **2** oppure i comandi di emergenza qui sopra.

## 1) Cartella e repository giusti

- Devi essere nella cartella del clone **GitHub** del progetto (repo `propertypilot-ai`), **non** in una copia vecchia o rinominata a caso.
- Nel `package.json` alla radice devono esistere gli script **`dev:clean`** e **`dev:free-port`**.  
  Se non ci sono → **non è il progetto aggiornato**: rifai clone o `git pull` sul branch giusto (punto 2).

## 2) Branch e pull

```powershell
cd C:\percorso\propertypilot-ai
git fetch origin
git checkout cursor/configurazione-localhost-founder-41e5
git pull origin cursor/configurazione-localhost-founder-41e5
npm install
```

## 3) Una sola porta: sempre 3000

Chiudi **tutte** le tab del browser su PropertyPilot. Chiudi altri `npm run dev` (Cursor, Replit, altri terminali).

Poi:

```powershell
npm run dev:clean
```

Nel terminale deve comparire **`http://localhost:3000`** (non 3001 o 3002).

## 4) Browser solo su :3000

Apri **solo** `http://localhost:3000` — se il server è su 3001/3002 mentre il browser è su 3000, avrai login / cookie / PWA **sfasati**.

## 5) Se compare «Sei Offline»

Con il server avviato da `dev:clean`, apri:

`http://localhost:3000/api/dev/reset-client?next=/`

(solo in modalità development: svuota cache/storage PWA e ti rimanda alla home)

In alternativa: Chrome → **Application** → **Clear site data** + **Unregister service workers**.

## 6) Login e dashboard

- `http://localhost:3000/auth/login` → accedi  
- poi `http://localhost:3000/dashboard`

---

**Riepilogo errori tipici**

| Cosa vedi | Causa |
|-----------|--------|
| `Missing script: dev:free-port` | `package.json` vecchio / cartella sbagliata |
| Next su 3001/3002, browser su 3000 | Più processi; non usare porte diverse |
| 404 su `/dashboard` su :3000 | Su quella porta non gira questo Next.js |
| Offline / bianco | Service Worker o origine sbagliata |
