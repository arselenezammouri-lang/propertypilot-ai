/**
 * Pre-Launch Audit Script
 * Verifica sistematica di tutti gli aspetti critici prima del lancio
 */

const fs = require('fs');
const path = require('path');

const issues = [];
const warnings = [];
const checks = [];

// Helper per aggiungere issue
function addIssue(category, message, file = null) {
  issues.push({ category, message, file });
  console.log(`❌ [${category}] ${message}${file ? ` (${file})` : ''}`);
}

// Helper per aggiungere warning
function addWarning(category, message, file = null) {
  warnings.push({ category, message, file });
  console.log(`⚠️  [${category}] ${message}${file ? ` (${file})` : ''}`);
}

// Helper per aggiungere check passato
function addCheck(category, message) {
  checks.push({ category, message });
  console.log(`✅ [${category}] ${message}`);
}

console.log('🔍 Pre-Launch Audit - PropertyPilot AI\n');
console.log('='.repeat(60));
console.log('');

// 1. Verifica Logo
console.log('1️⃣  Verifica Logo e Branding...');
const logoFiles = [
  'public/logo.png',
  'public/favicon.png',
  'components/logo.tsx',
];

logoFiles.forEach(file => {
  if (fs.existsSync(file)) {
    addCheck('Logo', `Logo file trovato: ${file}`);
  } else {
    addIssue('Logo', `Logo file mancante: ${file}`);
  }
});

// Verifica uso logo nelle pagine principali
const pagesToCheck = [
  'app/page.tsx',
  'app/dashboard/page.tsx',
  'app/pricing/page.tsx',
];

pagesToCheck.forEach(page => {
  if (fs.existsSync(page)) {
    const content = fs.readFileSync(page, 'utf8');
    if (content.includes('logo') || content.includes('Logo') || content.includes('PropertyPilotLogo')) {
      addCheck('Logo', `Logo usato in ${page}`);
    } else {
      addWarning('Logo', `Logo non trovato in ${page}`);
    }
  }
});

console.log('');

// 2. Verifica Design System
console.log('2️⃣  Verifica Design System...');
const designSystemFile = 'styles/design-system.css';
if (fs.existsSync(designSystemFile)) {
  const content = fs.readFileSync(designSystemFile, 'utf8');
  
  // Verifica background nero
  if (content.includes('#000000') || content.includes('--diamond-black')) {
    addCheck('Design System', 'Background nero configurato');
  } else {
    addIssue('Design System', 'Background nero non trovato nel design system');
  }
  
  // Verifica font
  if (content.includes('Inter') || content.includes('Geist')) {
    addCheck('Design System', 'Font Inter/Geist configurato');
  } else {
    addIssue('Design System', 'Font Inter/Geist non trovato');
  }
  
  // Verifica bordi 1px
  if (content.includes('1px') || content.includes('diamond-border')) {
    addCheck('Design System', 'Bordi 1px configurati');
  } else {
    addWarning('Design System', 'Bordi 1px non esplicitamente configurati');
  }
} else {
  addIssue('Design System', 'File design-system.css non trovato');
}

// Verifica import design system in layout
const layoutFile = 'app/layout.tsx';
if (fs.existsSync(layoutFile)) {
  const content = fs.readFileSync(layoutFile, 'utf8');
  if (content.includes('design-system.css')) {
    addCheck('Design System', 'Design system importato in layout');
  } else {
    addIssue('Design System', 'Design system non importato in layout');
  }
}

console.log('');

// 3. Verifica Error Pages
console.log('3️⃣  Verifica Error Pages...');
const errorPages = {
  'app/not-found.tsx': '404 Not Found',
  'app/error.tsx': '500 Error',
};

Object.entries(errorPages).forEach(([file, type]) => {
  if (fs.existsSync(file)) {
    addCheck('Error Pages', `${type} page presente`);
    
    // Verifica che usi design system
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('diamond-') || content.includes('bg-black')) {
      addCheck('Error Pages', `${type} page usa design system`);
    } else {
      addWarning('Error Pages', `${type} page potrebbe non usare design system`);
    }
  } else {
    addIssue('Error Pages', `${type} page mancante`);
  }
});

console.log('');

// 4. Verifica Navigation
console.log('4️⃣  Verifica Navigation...');
const navigationFiles = [
  'app/dashboard/page.tsx',
  'components/sidebar.tsx',
  'components/navbar.tsx',
];

navigationFiles.forEach(file => {
  if (fs.existsSync(file)) {
    addCheck('Navigation', `File navigation trovato: ${file}`);
  } else {
    // Non è un issue se non esiste sidebar/navbar separato
    if (file.includes('sidebar') || file.includes('navbar')) {
      addWarning('Navigation', `File navigation non trovato: ${file} (potrebbe essere inline)`);
    }
  }
});

console.log('');

// 5. Verifica Stripe Configuration
console.log('5️⃣  Verifica Stripe Configuration...');
const stripeConfigFile = 'lib/stripe/config.ts';
if (fs.existsSync(stripeConfigFile)) {
  const content = fs.readFileSync(stripeConfigFile, 'utf8');
  
  // Verifica Price IDs
  const priceIdChecks = [
    'NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID',
    'NEXT_PUBLIC_STRIPE_PRO_PRICE_ID',
    'NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID',
    'NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID',
  ];
  
  priceIdChecks.forEach(priceId => {
    if (content.includes(priceId)) {
      addCheck('Stripe', `Price ID configurato: ${priceId}`);
    } else {
      addIssue('Stripe', `Price ID mancante: ${priceId}`);
    }
  });
} else {
  addIssue('Stripe', 'File stripe config non trovato');
}

// Verifica webhook
const webhookFile = 'app/api/stripe/webhook/route.ts';
if (fs.existsSync(webhookFile)) {
  addCheck('Stripe', 'Webhook endpoint presente');
  
  const content = fs.readFileSync(webhookFile, 'utf8');
  if (content.includes('signature') || content.includes('constructEvent')) {
    addCheck('Stripe', 'Webhook signature verification presente');
  } else {
    addIssue('Stripe', 'Webhook signature verification mancante');
  }
} else {
  addIssue('Stripe', 'Webhook endpoint mancante');
}

console.log('');

// 6. Verifica i18n
console.log('6️⃣  Verifica Internationalization...');
const i18nConfigFile = 'lib/i18n/config.ts';
if (fs.existsSync(i18nConfigFile)) {
  const content = fs.readFileSync(i18nConfigFile, 'utf8');
  
  const locales = ['it', 'en', 'es', 'fr', 'de', 'ar'];
  locales.forEach(locale => {
    if (content.includes(`'${locale}'`) || content.includes(`"${locale}"`)) {
      addCheck('i18n', `Locale supportato: ${locale}`);
    } else {
      addWarning('i18n', `Locale potrebbe non essere supportato: ${locale}`);
    }
  });
} else {
  addIssue('i18n', 'File i18n config non trovato');
}

// Verifica Aria Coach i18n
const ariaCoachFile = 'components/aria-coach.tsx';
if (fs.existsSync(ariaCoachFile)) {
  const content = fs.readFileSync(ariaCoachFile, 'utf8');
  if (content.includes('getBrowserLocale') || content.includes('locale')) {
    addCheck('i18n', 'Aria Coach supporta i18n');
  } else {
    addWarning('i18n', 'Aria Coach potrebbe non supportare i18n completamente');
  }
}

console.log('');

// 7. Verifica Security
console.log('7️⃣  Verifica Security...');
const nextConfigFile = 'next.config.mjs';
if (fs.existsSync(nextConfigFile)) {
  const content = fs.readFileSync(nextConfigFile, 'utf8');
  
  const securityHeaders = [
    'Strict-Transport-Security',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection',
  ];
  
  securityHeaders.forEach(header => {
    if (content.includes(header)) {
      addCheck('Security', `Security header configurato: ${header}`);
    } else {
      addWarning('Security', `Security header non trovato: ${header}`);
    }
  });
} else {
  addWarning('Security', 'next.config.mjs non trovato');
}

// Verifica input validation
const validationFile = 'lib/utils/validation.ts';
if (fs.existsSync(validationFile)) {
  addCheck('Security', 'Input validation utility presente');
} else {
  addWarning('Security', 'Input validation utility non trovata');
}

console.log('');

// 8. Verifica Performance
console.log('8️⃣  Verifica Performance...');
const performanceFiles = [
  'components/performance-monitor.tsx',
  'app/api/analytics/web-vitals/route.ts',
];

performanceFiles.forEach(file => {
  if (fs.existsSync(file)) {
    addCheck('Performance', `File performance trovato: ${file}`);
  } else {
    addWarning('Performance', `File performance non trovato: ${file}`);
  }
});

// Verifica lazy loading
const dashboardPage = 'app/dashboard/page.tsx';
if (fs.existsSync(dashboardPage)) {
  const content = fs.readFileSync(dashboardPage, 'utf8');
  if (content.includes('dynamic') || content.includes('lazy')) {
    addCheck('Performance', 'Lazy loading usato in dashboard');
  } else {
    addWarning('Performance', 'Lazy loading potrebbe non essere usato in dashboard');
  }
}

console.log('');

// 9. Verifica Monitoring
console.log('9️⃣  Verifica Monitoring...');
const monitoringFiles = [
  'sentry.client.config.ts',
  'sentry.server.config.ts',
  'lib/monitoring/sentry.ts',
];

monitoringFiles.forEach(file => {
  if (fs.existsSync(file)) {
    addCheck('Monitoring', `File monitoring trovato: ${file}`);
  } else {
    addWarning('Monitoring', `File monitoring non trovato: ${file}`);
  }
});

console.log('');

// 10. Verifica Console Logs
console.log('🔟 Verifica Console Logs...');
const apiDir = 'app/api';
if (fs.existsSync(apiDir)) {
  const apiFiles = getAllFiles(apiDir, ['.ts', '.tsx']);
  let hasConsoleLog = false;
  
  apiFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    // Verifica console.log ma non logger
    if (content.includes('console.log') && !content.includes('logger')) {
      hasConsoleLog = true;
      addWarning('Console Logs', `console.log trovato in ${file} (dovrebbe usare logger)`);
    }
  });
  
  if (!hasConsoleLog) {
    addCheck('Console Logs', 'Nessun console.log trovato in API routes');
  }
}

console.log('');

// Summary
console.log('='.repeat(60));
console.log('\n📊 SUMMARY\n');

console.log(`✅ Checks Passed: ${checks.length}`);
console.log(`⚠️  Warnings: ${warnings.length}`);
console.log(`❌ Issues: ${issues.length}\n`);

if (issues.length === 0 && warnings.length === 0) {
  console.log('🎉 PERFETTO! Tutti i check sono passati!\n');
  process.exit(0);
} else {
  if (issues.length > 0) {
    console.log('❌ ISSUES CRITICI (da fixare prima del lancio):\n');
    issues.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.category}] ${issue.message}${issue.file ? ` - ${issue.file}` : ''}`);
    });
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (raccomandati da fixare):\n');
    warnings.slice(0, 10).forEach((warning, i) => {
      console.log(`${i + 1}. [${warning.category}] ${warning.message}${warning.file ? ` - ${warning.file}` : ''}`);
    });
    if (warnings.length > 10) {
      console.log(`... e altri ${warnings.length - 10} warnings`);
    }
    console.log('');
  }
  
  console.log('💡 Raccomandazione: Fixare tutti gli issues prima del lancio.\n');
  process.exit(issues.length > 0 ? 1 : 0);
}

// Helper per ottenere tutti i file
function getAllFiles(dirPath, extensions, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, extensions, arrayOfFiles);
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        arrayOfFiles.push(filePath);
      }
    }
  });
  
  return arrayOfFiles;
}
