#!/bin/bash
# 📋 Copy only used assets from working project to deployment project
set -e

SOURCE_DIR="../neb-content-appv2"
DEST_DIR="."
ASSETS_LIST="used-assets.txt"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🖼️  Copying assets from working project..."

if [[ ! -f "$ASSETS_LIST" ]]; then
    echo -e "${RED}❌ $ASSETS_LIST not found!${NC}"
    exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
    echo -e "${RED}❌ Source directory $SOURCE_DIR not found!${NC}"
    exit 1
fi

copied_count=0
total_size=0

while IFS= read -r filepath; do
    # Skip empty lines
    [[ -z "$filepath" ]] && continue
    
    src="$SOURCE_DIR/$filepath"
    dest="$DEST_DIR/$filepath"
    
    if [[ -f "$src" ]]; then
        echo -e "${GREEN}✅ Copying: $filepath${NC}"
        
        # Create directory if doesn't exist
        mkdir -p "$(dirname "$dest")"
        
        # Copy file
        cp "$src" "$dest"
        
        # Count size
        file_size=$(stat -f%z "$src" 2>/dev/null || stat -c%s "$src" 2>/dev/null || echo "0")
        total_size=$((total_size + file_size))
        copied_count=$((copied_count + 1))
    else
        echo -e "${YELLOW}⚠️  Not found: $filepath${NC}"
    fi
done < "$ASSETS_LIST"

# Format size
if (( total_size > 1024*1024 )); then
    size_mb=$((total_size / 1024 / 1024))
    size_display="${size_mb}MB"
else
    size_kb=$((total_size / 1024))
    size_display="${size_kb}KB"
fi

echo ""
echo -e "${GREEN}🎉 Completed!${NC}"
echo "📊 Files copied: $copied_count"
echo "📦 Total size: $size_display"
echo ""
echo "Next steps:"
echo "  npm run build          # Build project locally"
echo "  ./deploy.sh --media    # Deploy with media to server"