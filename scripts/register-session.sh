#!/bin/bash

# Claude Session Registration Script
# Usage: ./scripts/register-session.sh

set -e

echo "🤖 Claude Session Registration"
echo "=============================="
echo ""

# Check if docs/session-logs directory exists
mkdir -p docs/session-logs

# Session Type Selection
echo "📋 Виберіть тип сесії:"
echo "1) AGENT    - Backend agents, API, business logic"
echo "2) FRONTEND - UI components, pages, styling"  
echo "3) CONTENT  - KB_NEB integration, documentation"
echo "4) ARCH     - Architecture, coordination, database"
echo ""

read -p "Тип сесії (1-4): " SESSION_TYPE_NUM

case $SESSION_TYPE_NUM in
    1) SESSION_TYPE="AGENT" ;;
    2) SESSION_TYPE="FRONTEND" ;;
    3) SESSION_TYPE="CONTENT" ;;
    4) SESSION_TYPE="ARCH" ;;
    *) echo "❌ Невірний вибір"; exit 1 ;;
esac

# Generate Session ID
TIMESTAMP=$(date +%Y%m%d-%H%M)
SESSION_ID="${SESSION_TYPE}-${TIMESTAMP}"

echo ""
echo "🆔 Session ID: $SESSION_ID"

# Duration
echo ""
echo "⏱️ Очікувана тривалість:"
echo "1) Quick (< 1 hour)"
echo "2) Session (1-4 hours)"
echo "3) Extended (> 4 hours)"
echo ""

read -p "Тривалість (1-3): " DURATION_NUM

case $DURATION_NUM in
    1) DURATION="quick" ;;
    2) DURATION="session" ;;
    3) DURATION="extended" ;;
    *) echo "❌ Невірний вибір"; exit 1 ;;
esac

# Scope Selection
echo ""
echo "📁 Директорії для роботи (доступні для $SESSION_TYPE):"

case $SESSION_TYPE in
    "AGENT")
        echo "1) /lib/agents/"
        echo "2) /app/api/"
        echo "3) /lib/services/"
        echo "4) Tests for agents"
        ;;
    "FRONTEND")
        echo "1) /components/ui/"
        echo "2) /components/shared/"
        echo "3) /app/(pages)/"
        echo "4) Styling files"
        ;;
    "CONTENT")
        echo "1) /docs/"
        echo "2) KB_NEB integration"
        echo "3) Content management"
        echo "4) Documentation updates"
        ;;
    "ARCH")
        echo "1) /prisma/"
        echo "2) Project structure"
        echo "3) Configuration files"
        echo "4) Cross-cutting concerns"
        ;;
esac

echo ""
read -p "Основна робота буде в (номери через кому): " SCOPE_INPUT

# Convert scope to directories
declare -a SCOPE_DIRS
case $SESSION_TYPE in
    "AGENT")
        IFS=',' read -ra NUMS <<< "$SCOPE_INPUT"
        for num in "${NUMS[@]}"; do
            case $num in
                1) SCOPE_DIRS+=("/lib/agents/") ;;
                2) SCOPE_DIRS+=("/app/api/") ;;
                3) SCOPE_DIRS+=("/lib/services/") ;;
                4) SCOPE_DIRS+=("/__tests__/agents/") ;;
            esac
        done
        ;;
    "FRONTEND")
        IFS=',' read -ra NUMS <<< "$SCOPE_INPUT"
        for num in "${NUMS[@]}"; do
            case $num in
                1) SCOPE_DIRS+=("/components/ui/") ;;
                2) SCOPE_DIRS+=("/components/shared/") ;;
                3) SCOPE_DIRS+=("/app/(pages)/") ;;
                4) SCOPE_DIRS+=("/styles/") ;;
            esac
        done
        ;;
    "CONTENT")
        IFS=',' read -ra NUMS <<< "$SCOPE_INPUT"
        for num in "${NUMS[@]}"; do
            case $num in
                1) SCOPE_DIRS+=("/docs/") ;;
                2) SCOPE_DIRS+=("/lib/kb-neb/") ;;
                3) SCOPE_DIRS+=("/content/") ;;
                4) SCOPE_DIRS+=("/docs/") ;;
            esac
        done
        ;;
    "ARCH")
        IFS=',' read -ra NUMS <<< "$SCOPE_INPUT"
        for num in "${NUMS[@]}"; do
            case $num in
                1) SCOPE_DIRS+=("/prisma/") ;;
                2) SCOPE_DIRS+=("/") ;;
                3) SCOPE_DIRS+=("/config/") ;;
                4) SCOPE_DIRS+=("/lib/") ;;
            esac
        done
        ;;
esac

# Goals
echo ""
read -p "🎯 Основна ціль сесії: " MAIN_GOAL

# Dependencies
echo ""
echo "🔗 Залежності від інших сесій:"
echo "1) Незалежна робота"
echo "2) Потребує координації"
echo "3) Блокує інші сесії"
echo ""

read -p "Залежності (1-3): " DEPENDENCY_NUM

case $DEPENDENCY_NUM in
    1) DEPENDENCIES="independent" ;;
    2) DEPENDENCIES="coordination_needed" ;;
    3) DEPENDENCIES="blocking" ;;
    *) echo "❌ Невірний вибір"; exit 1 ;;
esac

# Check for active sessions
echo ""
echo "🔍 Перевірка активних сесій..."

if [ -f "docs/session-logs/current-sessions.json" ]; then
    echo "📋 Активні сесії:"
    cat docs/session-logs/current-sessions.json | grep -o '"sessionId":"[^"]*"' | sed 's/"sessionId":"//g' | sed 's/"//g' || echo "Немає активних сесій"
else
    echo "Немає активних сесій"
    echo "[]" > docs/session-logs/current-sessions.json
fi

# Generate branch name
BRANCH_NAME="feature/${SESSION_TYPE,,}-$(date +%m%d-%H%M)"

echo ""
echo "🌿 Git branch: $BRANCH_NAME"

# Conflict check
echo ""
echo "⚠️ Перевірка конфліктів..."

CONFLICT_LEVEL="LOW"
if [ -f "docs/session-logs/current-sessions.json" ]; then
    # Check if any active session works with same directories
    for dir in "${SCOPE_DIRS[@]}"; do
        if grep -q "$dir" docs/session-logs/current-sessions.json 2>/dev/null; then
            CONFLICT_LEVEL="HIGH"
            echo "🔴 КОНФЛІКТ: Директорія $dir вже використовується"
        fi
    done
fi

echo "📊 Рівень конфліктів: $CONFLICT_LEVEL"

# Confirmation
echo ""
echo "📋 Підтвердження реєстрації:"
echo "   Session ID: $SESSION_ID"
echo "   Type: $SESSION_TYPE"
echo "   Duration: $DURATION"
echo "   Goal: $MAIN_GOAL"
echo "   Scope: ${SCOPE_DIRS[*]}"
echo "   Branch: $BRANCH_NAME"
echo "   Conflicts: $CONFLICT_LEVEL"
echo ""

read -p "Продовжити реєстрацію? (y/N): " CONFIRM

if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "❌ Реєстрацію скасовано"
    exit 1
fi

# Create session record
CURRENT_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Read existing sessions
if [ -f "docs/session-logs/current-sessions.json" ]; then
    EXISTING_SESSIONS=$(cat docs/session-logs/current-sessions.json)
else
    EXISTING_SESSIONS="[]"
fi

# Create new session object
NEW_SESSION=$(cat <<EOF
{
  "sessionId": "$SESSION_ID",
  "type": "$SESSION_TYPE",
  "startTime": "$CURRENT_TIME",
  "duration": "$DURATION",
  "goal": "$MAIN_GOAL",
  "scope": [$(printf '"%s",' "${SCOPE_DIRS[@]}" | sed 's/,$//')],,
  "branch": "$BRANCH_NAME",
  "status": "active",
  "conflictLevel": "$CONFLICT_LEVEL",
  "dependencies": "$DEPENDENCIES",
  "lastUpdate": "$CURRENT_TIME"
}
EOF
)

# Add to sessions array
UPDATED_SESSIONS=$(echo "$EXISTING_SESSIONS" | jq ". + [$NEW_SESSION]")
echo "$UPDATED_SESSIONS" > docs/session-logs/current-sessions.json

# Create git branch
echo ""
echo "🌿 Створення git branch..."
git checkout -b "$BRANCH_NAME" 2>/dev/null || {
    echo "⚠️ Branch вже існує, перемикаємося на нього"
    git checkout "$BRANCH_NAME"
}

# Create session workspace
echo ""
echo "📁 Створення workspace..."

mkdir -p "docs/session-logs/sessions/$SESSION_ID"

# Create session notes file
cat > "docs/session-logs/sessions/$SESSION_ID/notes.md" <<EOF
# $SESSION_TYPE Session: $SESSION_ID

## Session Info
- **Started**: $CURRENT_TIME
- **Duration**: $DURATION  
- **Goal**: $MAIN_GOAL
- **Branch**: $BRANCH_NAME
- **Conflict Level**: $CONFLICT_LEVEL

## Scope
$(printf '- %s\n' "${SCOPE_DIRS[@]}")

## Progress
- [ ] Session setup complete
- [ ] Initial analysis done
- [ ] Development started
- [ ] Testing completed
- [ ] Documentation updated
- [ ] Ready for merge

## Notes
Add your session notes here...

## Coordination
Record any coordination with other sessions here...

## Files Modified
Track modified files here...
EOF

# Create session status file
cat > "docs/session-logs/sessions/$SESSION_ID/status.json" <<EOF
{
  "sessionId": "$SESSION_ID",
  "currentTask": "Session initialization",
  "filesModified": [],
  "estimatedCompletion": null,
  "blockedBy": [],
  "blocking": [],
  "needsCoordination": []
}
EOF

# Update CLAUDE.md with session info
echo "" >> CLAUDE.md
echo "## Active Claude Session: $SESSION_ID" >> CLAUDE.md
echo "- **Type**: $SESSION_TYPE" >> CLAUDE.md
echo "- **Goal**: $MAIN_GOAL" >> CLAUDE.md
echo "- **Branch**: $BRANCH_NAME" >> CLAUDE.md
echo "- **Started**: $CURRENT_TIME" >> CLAUDE.md
echo "" >> CLAUDE.md

# Success message
echo ""
echo "✅ Сесію $SESSION_ID успішно зареєстровано!"
echo ""
echo "📋 Наступні кроки:"
echo "1. Почніть роботу в своєму scope: ${SCOPE_DIRS[*]}"
echo "2. Регулярно оновлюйте статус: ./scripts/update-session-status.sh"
echo "3. Координуйтеся з іншими сесіями при потребі"
echo "4. Комітьте зміни з префіксом [$SESSION_TYPE]"
echo "5. Оновлюйте документацію в docs/session-logs/sessions/$SESSION_ID/"
echo ""
echo "📖 Повна документація: docs/CLAUDE_SESSION_MANAGEMENT.md"
echo ""

# Final reminders based on conflict level
if [ "$CONFLICT_LEVEL" = "HIGH" ]; then
    echo "⚠️  УВАГА: Високий рівень конфліктів!"
    echo "   Обов'язково координуйтеся з іншими сесіями перед змінами"
    echo ""
fi

echo "🚀 Бажаємо продуктивної роботи!"