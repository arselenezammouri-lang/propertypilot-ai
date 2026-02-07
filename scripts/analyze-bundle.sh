#!/bin/bash

# Bundle Analysis Script
# Usage: ./scripts/analyze-bundle.sh

echo "🔍 Analyzing bundle size..."

# Check if @next/bundle-analyzer is installed
if ! npm list @next/bundle-analyzer > /dev/null 2>&1; then
  echo "📦 Installing @next/bundle-analyzer..."
  npm install --save-dev @next/bundle-analyzer
fi

# Run build with analyzer
echo "🏗️  Building with bundle analyzer..."
ANALYZE=true npm run build

echo "✅ Bundle analysis complete! Check the browser that opened automatically."
