/**
 * Bundle Size Analysis
 * 
 * Analizza le dimensioni del bundle e identifica opportunità di ottimizzazione
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(process.cwd(), '.next');
const ANALYSIS_FILE = path.join(BUILD_DIR, 'analyze', 'client.json');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('📦 Bundle Size Analysis');
  console.log('======================\n');

  if (!fs.existsSync(ANALYSIS_FILE)) {
    console.log('❌ Analysis file not found.');
    console.log('   Run: npm run analyze');
    console.log('   Then: npm run build');
    return;
  }

  const analysis = JSON.parse(fs.readFileSync(ANALYSIS_FILE, 'utf8'));

  // Analyze chunks
  const chunks = analysis.chunks || [];
  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  const totalGzipped = chunks.reduce((sum, chunk) => sum + (chunk.gzipSize || 0), 0);

  console.log(`Total Bundle Size: ${formatBytes(totalSize)}`);
  console.log(`Total Gzipped: ${formatBytes(totalGzipped)}\n`);

  // Sort by size
  const sortedChunks = [...chunks].sort((a, b) => b.size - a.size);

  console.log('📊 Top 10 Largest Chunks:');
  console.log('─────────────────────────');
  sortedChunks.slice(0, 10).forEach((chunk, index) => {
    const gzipSize = chunk.gzipSize || 0;
    const gzipRatio = ((gzipSize / chunk.size) * 100).toFixed(1);
    console.log(`${(index + 1).toString().padStart(2)}. ${chunk.names[0] || 'unknown'}`);
    console.log(`    Size: ${formatBytes(chunk.size)} | Gzipped: ${formatBytes(gzipSize)} (${gzipRatio}%)`);
  });

  // Recommendations
  console.log('\n💡 Recommendations:');
  
  const largeChunks = sortedChunks.filter(c => c.size > 500000); // > 500KB
  if (largeChunks.length > 0) {
    console.log(`   ⚠️  ${largeChunks.length} chunks are > 500KB. Consider code splitting.`);
  }

  if (totalSize > 5000000) { // > 5MB
    console.log('   ⚠️  Total bundle is > 5MB. Consider lazy loading.');
  }

  if (totalGzipped > 2000000) { // > 2MB gzipped
    console.log('   ⚠️  Gzipped bundle is > 2MB. Consider optimization.');
  }

  // Check for duplicate dependencies
  console.log('\n📋 Dependency Analysis:');
  const modules = analysis.modules || [];
  const moduleSizes = {};
  
  modules.forEach(module => {
    const name = module.name || 'unknown';
    const packageName = name.split('node_modules/')[1]?.split('/')[0] || name;
    if (!moduleSizes[packageName]) {
      moduleSizes[packageName] = 0;
    }
    moduleSizes[packageName] += module.size || 0;
  });

  const sortedPackages = Object.entries(moduleSizes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  console.log('Top 10 Largest Dependencies:');
  sortedPackages.forEach(([pkg, size], index) => {
    console.log(`   ${(index + 1).toString().padStart(2)}. ${pkg}: ${formatBytes(size)}`);
  });
}

analyzeBundle();
