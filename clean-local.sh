#!/bin/bash
# 🧹 Clean local neb-hetzner project
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧹 Cleaning neb-hetzner local project..."

# Check if we're in the right directory
if [[ ! -f "used-assets.txt" ]] || [[ ! -f "DEPLOYMENT_PLAN.md" ]]; then
    echo -e "${RED}❌ This doesn't look like neb-hetzner directory!${NC}"
    echo "Make sure you're in /Users/chyngys/scripts/neb-hetzner/"
    exit 1
fi

echo "📁 Removing build files..."
rm -rf .next/

echo "📁 Removing public files..."
rm -rf public/*

echo "📁 Removing node_modules..."
rm -rf node_modules/

echo "🔄 Git clean untracked files..."
git clean -fd

echo "📊 Directory sizes after cleanup:"
du -sh . 2>/dev/null || echo "Current directory size: $(du -s . | cut -f1) blocks"

echo ""
echo -e "${GREEN}✅ Local cleanup completed!${NC}"
echo ""
echo "Next steps:"
echo "  ./copy-assets.sh       # Copy assets from working project"
echo "  npm install           # Install dependencies"
echo "  npm run build         # Build project"