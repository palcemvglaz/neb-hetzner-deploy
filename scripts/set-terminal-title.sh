#!/bin/bash

# Terminal Title Management for Nebachiv Content App
# Inspired by my-finance-app terminal naming conventions
# 
# Usage: ./scripts/set-terminal-title.sh [status] [area] [task]
# Example: ./scripts/set-terminal-title.sh 🟡 "KB_NEB" "Sync Issues"

# Educational platform emoji mapping
declare -A AREA_EMOJIS=(
    ["Dashboard"]="📊"
    ["Courses"]="🎓"
    ["KB_NEB"]="🧠"
    ["Content"]="📚"
    ["Students"]="👥"
    ["Analytics"]="📈"
    ["Mobile"]="📱"
    ["Tests"]="📝"
    ["Payments"]="💳"
    ["Auth"]="🔒"
    ["API"]="🔌"
    ["Database"]="🗄️"
    ["Build"]="🔨"
    ["Deploy"]="🚀"
    ["Bugs"]="🐛"
    ["Features"]="✨"
    ["Performance"]="⚡"
    ["Security"]="🛡️"
    ["Documentation"]="📋"
    ["UI"]="🎨"
)

# Status emoji mapping (same as my-finance-app)
declare -A STATUS_EMOJIS=(
    ["started"]="🟡"
    ["problem"]="🔴"
    ["confirm"]="⏳"
    ["completed"]="✅"
    ["working"]="🔄"
    ["testing"]="🧪"
    ["review"]="👀"
)

# Function to set terminal title
set_title() {
    local status="$1"
    local area="$2"
    local task="$3"
    
    # If no parameters provided, show usage
    if [[ -z "$status" || -z "$area" || -z "$task" ]]; then
        echo "Usage: $0 [status] [area] [task]"
        echo ""
        echo "Status options: started|problem|confirm|completed|working|testing|review"
        echo "Area examples: Dashboard|Courses|KB_NEB|Content|Students|Analytics|Mobile"
        echo ""
        echo "Examples:"
        echo "  $0 started Courses 'Content Generation'"
        echo "  $0 problem KB_NEB 'Sync Failed'"
        echo "  $0 completed Mobile 'Build Success'"
        echo ""
        echo "Available area emojis:"
        for area_name in "${!AREA_EMOJIS[@]}"; do
            echo "  ${AREA_EMOJIS[$area_name]} $area_name"
        done | sort
        return 1
    fi
    
    # Resolve status emoji
    local status_emoji="${STATUS_EMOJIS[$status]}"
    if [[ -z "$status_emoji" ]]; then
        # If not a predefined status, use it as is (might be emoji already)
        status_emoji="$status"
    fi
    
    # Resolve area emoji
    local area_emoji="${AREA_EMOJIS[$area]}"
    if [[ -z "$area_emoji" ]]; then
        # If not a predefined area, try to find a match
        for area_name in "${!AREA_EMOJIS[@]}"; do
            if [[ "$area" == *"$area_name"* ]]; then
                area_emoji="${AREA_EMOJIS[$area_name]}"
                break
            fi
        done
        
        # If still no match, use default emoji
        if [[ -z "$area_emoji" ]]; then
            area_emoji="⚙️"
        fi
    fi
    
    # Construct title: [status_emoji] [area_emoji] Area - Task
    local title="${status_emoji} ${area_emoji} ${area} - ${task}"
    
    # Set terminal title
    echo -ne "\033]0;${title}\007"
    echo "Terminal title set to: ${title}"
}

# Quick presets for common educational tasks
case "$1" in
    "course-dev")
        set_title "🟡" "Courses" "Development"
        ;;
    "content-sync")
        set_title "🔄" "KB_NEB" "Content Sync"
        ;;
    "student-dash")
        set_title "🟡" "Dashboard" "Student View"
        ;;
    "mobile-build")
        set_title "🔄" "Mobile" "Building App"
        ;;
    "test-run")
        set_title "🧪" "Tests" "Running Suite"
        ;;
    "api-debug")
        set_title "🔴" "API" "Debugging"
        ;;
    "payment-flow")
        set_title "🟡" "Payments" "Flow Testing"
        ;;
    "kb-neb-fix")
        set_title "🔴" "KB_NEB" "Integration Fix"
        ;;
    "ui-polish")
        set_title "🎨" "UI" "Polishing"
        ;;
    "deploy-prep")
        set_title "🚀" "Deploy" "Preparation"
        ;;
    "presets")
        echo "Available presets:"
        echo "  course-dev     - 🟡 🎓 Courses - Development"
        echo "  content-sync   - 🔄 🧠 KB_NEB - Content Sync"
        echo "  student-dash   - 🟡 📊 Dashboard - Student View"
        echo "  mobile-build   - 🔄 📱 Mobile - Building App"
        echo "  test-run       - 🧪 📝 Tests - Running Suite"
        echo "  api-debug      - 🔴 🔌 API - Debugging"
        echo "  payment-flow   - 🟡 💳 Payments - Flow Testing"
        echo "  kb-neb-fix     - 🔴 🧠 KB_NEB - Integration Fix"
        echo "  ui-polish      - 🎨 🎨 UI - Polishing"
        echo "  deploy-prep    - 🚀 🚀 Deploy - Preparation"
        ;;
    *)
        set_title "$@"
        ;;
esac