#!/bin/bash
# 🧹 Clean Hetzner server project
set -e

SERVER="root@49.12.74.42"
SERVER_DIR="/opt/nebachiv/app"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧹 Cleaning Hetzner server..."

# Check SSH connection
if ! ssh -o ConnectTimeout=5 "$SERVER" "echo 'Connection test'" >/dev/null 2>&1; then
    echo -e "${RED}❌ Cannot connect to server $SERVER${NC}"
    echo "Check your SSH connection and try again."
    exit 1
fi

echo "📁 Removing server build files..."
ssh "$SERVER" "cd $SERVER_DIR && rm -rf .next/"

echo "📁 Removing server public media files..."
ssh "$SERVER" "cd $SERVER_DIR && rm -rf public/videos_bg/* public/marketing_data/*"

echo "🛑 Stopping PM2 process..."
ssh "$SERVER" "cd $SERVER_DIR && pm2 stop nebachiv || echo 'Process was not running'"

echo "📊 Server directory info:"
ssh "$SERVER" "cd $SERVER_DIR && ls -la public/ | head -5"

echo ""
echo -e "${GREEN}✅ Server cleanup completed!${NC}"
echo ""
echo "Next steps:"
echo "  ./deploy.sh --media    # Deploy fresh copy with media"
echo ""
echo "Or manually check server:"
echo "  ssh $SERVER"
echo "  cd $SERVER_DIR"