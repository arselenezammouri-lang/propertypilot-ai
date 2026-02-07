#!/bin/bash

# Security Audit Script
# Esegue controlli di sicurezza base per PropertyPilot AI

echo "🔒 Security Audit - PropertyPilot AI"
echo "======================================"
echo ""

# 1. npm audit
echo "1️⃣  Running npm audit..."
npm audit --audit-level=moderate

echo ""
echo "2️⃣  Checking for sensitive data in code..."
echo ""

# 2. Check for hardcoded secrets
echo "   Checking for potential secrets..."
if grep -r "sk_live\|sk_test\|STRIPE_SECRET" --include="*.ts" --include="*.js" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next . | grep -v "process.env\|NEXT_PUBLIC"; then
    echo "   ⚠️  WARNING: Potential hardcoded secrets found!"
else
    echo "   ✅ No hardcoded secrets found"
fi

# 3. Check for SQL injection vulnerabilities
echo ""
echo "3️⃣  Checking for SQL injection patterns..."
if grep -r "\.query\|\.execute\|raw.*sql" --include="*.ts" --include="*.js" --exclude-dir=node_modules --exclude-dir=.next . | grep -v "supabase\|drizzle"; then
    echo "   ⚠️  WARNING: Potential SQL injection risks found!"
else
    echo "   ✅ Using safe query builders (Supabase/Drizzle)"
fi

# 4. Check for XSS vulnerabilities
echo ""
echo "4️⃣  Checking for XSS patterns..."
if grep -r "dangerouslySetInnerHTML\|innerHTML\|eval\|Function(" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next .; then
    echo "   ⚠️  WARNING: Potential XSS vulnerabilities found!"
else
    echo "   ✅ No obvious XSS patterns found"
fi

# 5. Check environment variables
echo ""
echo "5️⃣  Checking .env.example..."
if [ -f ".env.example" ]; then
    echo "   ✅ .env.example exists"
else
    echo "   ⚠️  WARNING: .env.example not found"
fi

if [ -f ".env.local" ] && [ ! -f ".gitignore" ] || ! grep -q ".env.local" .gitignore; then
    echo "   ⚠️  WARNING: .env.local might be tracked in git!"
else
    echo "   ✅ .env.local is in .gitignore"
fi

echo ""
echo "======================================"
echo "✅ Security audit complete!"
echo ""
echo "📋 Recommendations:"
echo "   - Review npm audit output"
echo "   - Fix high/critical vulnerabilities"
echo "   - Review any warnings above"
echo "   - Run 'npm audit fix' for auto-fixable issues"
