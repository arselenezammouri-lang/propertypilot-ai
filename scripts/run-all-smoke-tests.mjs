/**
 * Esegue in sequenza: system smoke test + Stripe smoke test.
 * Un solo comando per verificare tutto ciò che è automatizzabile senza TestSprite.
 *
 * Uso dalla terminale (una sola volta imposti .env.test, poi):
 *   npm run test:smoke
 * oppure:
 *   node scripts/run-all-smoke-tests.mjs
 *
 * Carica automaticamente .env.test e .env.local (BASE_URL, TEST_EMAIL, TEST_PASSWORD).
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import { readFileSync, existsSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// Carica variabili da .env.test e .env.local (solo per questo processo)
function loadEnvFile(file, dir) {
  const p = path.join(dir, file);
  if (!existsSync(p)) return;
  try {
    let content = readFileSync(p, "utf8");
    if (content.charCodeAt(0) === 0xfeff) content = content.slice(1);
    if (content.includes("\r")) content = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (m) {
        const val = m[2].replace(/^["']|["']$/g, "").trim();
        if (!process.env[m[1]]) process.env[m[1]] = val;
      }
    }
  } catch (_) {}
}
// Prova da root script, poi da cwd (terminale può essere in root progetto)
loadEnvFile(".env.test", rootDir);
loadEnvFile(".env.local", rootDir);
const cwd = process.cwd();
if (cwd !== rootDir) {
  loadEnvFile(".env.test", cwd);
  loadEnvFile(".env.local", cwd);
}

function run(script, name) {
  return new Promise((resolve, reject) => {
    const child = spawn("node", [script], {
      cwd: rootDir,
      stdio: "inherit",
      env: { ...process.env, FORCE_COLOR: "1" },
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${name} exit ${code}`))));
    child.on("error", reject);
  });
}

async function main() {
  const baseUrl = process.env.BASE_URL || "https://propertypilot-ai.vercel.app";
  const hasCreds = !!(process.env.TEST_EMAIL && process.env.TEST_PASSWORD);

  console.log("========== PROPERTYPILOT AI – FULL SMOKE SUITE ==========\n");
  console.log("BASE_URL:", baseUrl);
  console.log("Credenziali test:", hasCreds ? "impostate (.env.test / .env.local)" : "MANCANTI (crea .env.test da .env.test.example)");
  if (!hasCreds) {
    console.log("");
    console.log("Per 0 fail su TUTTI i test: copia .env.test.example in .env.test e inserisci TEST_EMAIL e TEST_PASSWORD.");
    console.log("Poi rilancia: npm run test:smoke");
    console.log("");
  }

  try {
    console.log(">>> 1/2 System smoke test (pagine + dashboard + AI flow)\n");
    await run(path.join(__dirname, "system-smoke-test.mjs"), "System smoke test");

    console.log("\n>>> 2/2 Stripe smoke test (diagnose + checkout URL)\n");
    await run(path.join(__dirname, "stripe-smoke-test.mjs"), "Stripe smoke test");

    console.log("\n========== TUTTI I TEST AUTOMATICI SUPERATI ==========");
  } catch (e) {
    console.error("\n========== QUALCHE TEST È FALLITO ==========");
    console.error(e.message);
    process.exitCode = 1;
  }
}

main();
