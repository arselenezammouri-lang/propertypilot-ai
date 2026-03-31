/**
 * Script per sostituire console.log/error/warn con logger sicuro
 * 
 * Uso: node scripts/replace-console-logs.mjs
 * 
 * ATTENZIONE: Questo script è solo per riferimento.
 * Le sostituzioni vanno fatte manualmente per garantire correttezza.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');

// File da escludere
const excludePatterns = [
  'node_modules',
  '.next',
  'scripts',
  'safe-logger.ts', // Non modificare il logger stesso
];

// Pattern per trovare console.log/error/warn/debug
const consolePattern = /console\.(log|error|warn|debug)\(/g;

// Verifica se il file ha già l'import del logger
function hasLoggerImport(content) {
  return content.includes("import { logger } from '@/lib/utils/safe-logger'") ||
         content.includes('from "@/lib/utils/safe-logger"') ||
         content.includes("from '@/lib/utils/safe-logger'");
}

// Aggiunge l'import del logger se mancante
function addLoggerImport(content) {
  if (hasLoggerImport(content)) {
    return content;
  }

  // Trova l'ultimo import statement
  const importRegex = /^import\s+.*$/gm;
  const imports = content.match(importRegex) || [];
  
  if (imports.length === 0) {
    // Aggiungi all'inizio del file
    return `import { logger } from '@/lib/utils/safe-logger';\n${content}`;
  }

  // Aggiungi dopo l'ultimo import
  const lastImport = imports[imports.length - 1];
  const lastImportIndex = content.lastIndexOf(lastImport);
  const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
  
  return content.slice(0, insertIndex) + 
         "import { logger } from '@/lib/utils/safe-logger';\n" + 
         content.slice(insertIndex);
}

// Converte console.log/error/warn/debug in logger
function convertConsoleToLogger(match, method, content) {
  const loggerMethod = method === 'log' ? 'info' : method;
  
  // Estrai il contenuto tra le parentesi
  const contentMatch = content.match(/console\.(log|error|warn|debug)\((.*)\)/s);
  if (!contentMatch) return match;
  
  const args = contentMatch[2];
  
  // Se è un template literal o stringa semplice, estrai il messaggio
  const messageMatch = args.match(/^['"`](.*?)['"`]/);
  if (messageMatch) {
    const message = messageMatch[1];
    return `logger.${loggerMethod}('${message}')`;
  }
  
  // Altrimenti usa come context
  return `logger.${loggerMethod}('Log message', undefined, { data: ${args} })`;
}

// Scansiona directory ricorsivamente
function scanDirectory(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Salta se escluso
    if (excludePatterns.some(pattern => fullPath.includes(pattern))) {
      continue;
    }
    
    if (entry.isDirectory()) {
      scanDirectory(fullPath, files);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main
function main() {
  console.log('🔍 Scanning for console.log/error/warn/debug...\n');
  
  const files = scanDirectory(path.join(projectRoot, 'app', 'api'));
  const filesWithConsole = [];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    if (consolePattern.test(content)) {
      filesWithConsole.push(file);
    }
  }
  
  console.log(`📊 Found ${filesWithConsole.length} files with console statements:\n`);
  filesWithConsole.forEach(file => {
    const relativePath = path.relative(projectRoot, file);
    console.log(`  - ${relativePath}`);
  });
  
  console.log('\n⚠️  IMPORTANTE: Le sostituzioni vanno fatte manualmente per garantire correttezza.');
  console.log('   Usa questo script solo come riferimento per trovare i file da modificare.\n');
}

main();
