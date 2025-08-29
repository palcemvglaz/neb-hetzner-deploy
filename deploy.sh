#!/bin/bash
# 🚀 Main deployment script for Nebachiv Hetzner
set -e

SERVER="root@49.12.74.42"
SERVER_DIR="/opt/nebachiv/app"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Flags
DEPLOY_MEDIA=false
if [[ "$1" == "--media" ]]; then
    DEPLOY_MEDIA=true
fi

echo -e "${PURPLE}🚀 NEBACHIV HETZNER DEPLOYMENT${NC}"
echo "========================================"

if [[ "$DEPLOY_MEDIA" == "true" ]]; then
    echo -e "${YELLOW}📦 Mode: Full deployment with media${NC}"
else
    echo -e "${BLUE}⚡ Mode: Code-only deployment${NC}"
fi

echo ""

# Step 1: Copy code from working project
echo -e "${BLUE}📋 Step 1: Copying code from working project...${NC}"
SOURCE_DIR="../neb-content-appv2"

if [[ ! -d "$SOURCE_DIR" ]]; then
    echo -e "${RED}❌ Working project not found at $SOURCE_DIR${NC}"
    exit 1
fi

# Copy essential code files
cp "$SOURCE_DIR/next.config.js" . 2>/dev/null || echo "⚠️ next.config.js not found"
cp "$SOURCE_DIR/package"*.json . 2>/dev/null || echo "⚠️ package.json not found"

# Copy directories if they exist
for dir in app components lib hooks styles prisma; do
    if [[ -d "$SOURCE_DIR/$dir" ]]; then
        echo "  📁 Copying $dir/"
        cp -r "$SOURCE_DIR/$dir" .
    else
        echo "  ⚠️  Directory $dir not found"
    fi
done

# Step 2: Copy media if requested
if [[ "$DEPLOY_MEDIA" == "true" ]]; then
    echo ""
    echo -e "${BLUE}📋 Step 2: Copying media assets...${NC}"
    ./copy-assets.sh
fi

# Step 3: Install dependencies and build
echo ""
echo -e "${BLUE}📋 Step 3: Installing dependencies and building...${NC}"

if [[ ! -f "package.json" ]]; then
    echo -e "${RED}❌ package.json not found!${NC}"
    exit 1
fi

npm install
echo "🔨 Building project..."
npm run build

# Step 4: Git operations
echo ""
echo -e "${BLUE}📋 Step 4: Git operations...${NC}"

git add -A
if git diff --cached --quiet; then
    echo "📝 No changes to commit"
else
    commit_message="Deploy: $(date '+%Y-%m-%d %H:%M')"
    if [[ "$DEPLOY_MEDIA" == "true" ]]; then
        commit_message="$commit_message (with media)"
    fi
    git commit -m "$commit_message"
fi

git push origin main

# Step 5: Deploy to server
echo ""
echo -e "${BLUE}📋 Step 5: Deploying to server...${NC}"

# Check SSH connection
if ! ssh -o ConnectTimeout=5 "$SERVER" "echo 'Connection test'" >/dev/null 2>&1; then
    echo -e "${RED}❌ Cannot connect to server $SERVER${NC}"
    exit 1
fi

# Pull code on server
echo "📥 Pulling code on server..."
ssh "$SERVER" "cd $SERVER_DIR && git pull origin main"

# Copy media files to server if requested
if [[ "$DEPLOY_MEDIA" == "true" ]]; then
    echo "📤 Uploading media files to server..."
    while IFS= read -r filepath; do
        [[ -z "$filepath" ]] && continue
        if [[ -f "$filepath" ]]; then
            echo "  📤 $filepath"
            ssh "$SERVER" "mkdir -p $SERVER_DIR/$(dirname "$filepath")"
            scp "$filepath" "$SERVER:$SERVER_DIR/$filepath"
        fi
    done < used-assets.txt
fi

# Copy build to server
echo "📦 Copying build to server..."
rsync -avz --delete .next/ "$SERVER:$SERVER_DIR/.next/"

# Step 6: Server setup and restart
echo ""
echo -e "${BLUE}📋 Step 6: Server restart...${NC}"

ssh "$SERVER" << 'EOF'
cd /opt/nebachiv/app

echo "📦 Installing production dependencies..."
npm ci --only=production

echo "♻️ Restarting PM2..."
pm2 restart nebachiv || (pm2 start npm --name "nebachiv" -- start && echo "Started new PM2 process")

echo "📊 PM2 status:"
pm2 status nebachiv
EOF

# Step 7: Verification
echo ""
echo -e "${BLUE}📋 Step 7: Verification...${NC}"

sleep 5

if ssh "$SERVER" "curl -s http://localhost:3205 > /dev/null"; then
    echo -e "${GREEN}✅ Site is responding on server${NC}"
else
    echo -e "${YELLOW}⚠️ Site might not be responding yet${NC}"
fi

# Final summary
echo ""
echo -e "${PURPLE}🎉 DEPLOYMENT COMPLETED!${NC}"
echo "========================================"
echo -e "🌐 Site URL: ${GREEN}http://49.12.74.42:3205${NC}"
echo ""
echo "Quick checks:"
echo "  ssh $SERVER"
echo "  pm2 status nebachiv"
echo "  curl http://localhost:3205"
echo ""

if [[ "$DEPLOY_MEDIA" == "true" ]]; then
    echo -e "${GREEN}📦 Full deployment with media completed${NC}"
else
    echo -e "${BLUE}⚡ Code-only deployment completed${NC}"
    echo "To deploy media changes: ./deploy.sh --media"
fi