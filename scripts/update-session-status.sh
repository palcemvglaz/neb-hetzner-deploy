#!/bin/bash

# Claude Session Status Update Script
# Usage: ./scripts/update-session-status.sh [SESSION_ID] [STATUS]

set -e

SESSION_ID="$1"
NEW_STATUS="$2"

if [ -z "$SESSION_ID" ]; then
    echo "📋 Активні сесії:"
    if [ -f "docs/session-logs/current-sessions.json" ]; then
        cat docs/session-logs/current-sessions.json | jq -r '.[] | "🆔 \(.sessionId) - \(.type) - \(.status)"'
    else
        echo "Немає активних сесій"
    fi
    echo ""
    read -p "🆔 Session ID: " SESSION_ID
fi

if [ -z "$NEW_STATUS" ]; then
    echo ""
    echo "📊 Доступні статуси:"
    echo "1) working     - Активно працюю"
    echo "2) blocked     - Заблокований"
    echo "3) waiting     - Очікую координації"
    echo "4) testing     - Тестую зміни"
    echo "5) documenting - Оновлюю документацію"
    echo "6) completed   - Завершив роботу"
    echo "7) paused      - Пауза"
    echo ""
    read -p "Новий статус (1-7): " STATUS_NUM
    
    case $STATUS_NUM in
        1) NEW_STATUS="working" ;;
        2) NEW_STATUS="blocked" ;;
        3) NEW_STATUS="waiting" ;;
        4) NEW_STATUS="testing" ;;
        5) NEW_STATUS="documenting" ;;
        6) NEW_STATUS="completed" ;;
        7) NEW_STATUS="paused" ;;
        *) echo "❌ Невірний вибір"; exit 1 ;;
    esac
fi

# Check if sessions file exists
if [ ! -f "docs/session-logs/current-sessions.json" ]; then
    echo "❌ Файл сесій не знайдено"
    exit 1
fi

# Check if session exists
if ! jq -e ".[] | select(.sessionId == \"$SESSION_ID\")" docs/session-logs/current-sessions.json > /dev/null; then
    echo "❌ Сесію $SESSION_ID не знайдено"
    exit 1
fi

# Get current task
echo ""
read -p "📝 Поточне завдання: " CURRENT_TASK

# Get files being modified
echo ""
read -p "📁 Файли які змінюються (через кому): " FILES_INPUT

# Convert files to array
if [ -n "$FILES_INPUT" ]; then
    IFS=',' read -ra FILES_ARRAY <<< "$FILES_INPUT"
    FILES_JSON=$(printf '"%s",' "${FILES_ARRAY[@]}" | sed 's/,$//; s/^/[/; s/$/]/')
else
    FILES_JSON="[]"
fi

# Estimated completion
if [ "$NEW_STATUS" = "working" ] || [ "$NEW_STATUS" = "testing" ]; then
    echo ""
    echo "⏱️ Очікуване завершення:"
    echo "1) 30 хвилин"
    echo "2) 1 година"
    echo "3) 2-3 години"
    echo "4) Сьогодні"
    echo "5) Завтра"
    echo ""
    read -p "ETA (1-5): " ETA_NUM
    
    case $ETA_NUM in
        1) ETA_MINUTES=30 ;;
        2) ETA_MINUTES=60 ;;
        3) ETA_MINUTES=180 ;;
        4) ETA_MINUTES=480 ;;
        5) ETA_MINUTES=1440 ;;
        *) ETA_MINUTES=60 ;;
    esac
    
    ETA_TIME=$(date -u -d "+${ETA_MINUTES} minutes" +%Y-%m-%dT%H:%M:%SZ)
else
    ETA_TIME="null"
fi

# Coordination needs
echo ""
read -p "🤝 Потребує координації з (session IDs через кому, або Enter): " COORDINATION_INPUT

if [ -n "$COORDINATION_INPUT" ]; then
    IFS=',' read -ra COORD_ARRAY <<< "$COORDINATION_INPUT"
    COORD_JSON=$(printf '"%s",' "${COORD_ARRAY[@]}" | sed 's/,$//; s/^/[/; s/$/]/')
else
    COORD_JSON="[]"
fi

# Current timestamp
CURRENT_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Update session in current-sessions.json
UPDATED_SESSIONS=$(jq --arg sessionId "$SESSION_ID" \
                     --arg status "$NEW_STATUS" \
                     --arg task "$CURRENT_TASK" \
                     --argjson files "$FILES_JSON" \
                     --arg eta "$ETA_TIME" \
                     --argjson coord "$COORD_JSON" \
                     --arg time "$CURRENT_TIME" \
                     'map(if .sessionId == $sessionId then 
                        .status = $status | 
                        .currentTask = $task | 
                        .filesModified = $files | 
                        .estimatedCompletion = $eta | 
                        .needsCoordination = $coord | 
                        .lastUpdate = $time 
                      else . end)' \
                   docs/session-logs/current-sessions.json)

echo "$UPDATED_SESSIONS" > docs/session-logs/current-sessions.json

# Update individual session status
SESSION_DIR="docs/session-logs/sessions/$SESSION_ID"
if [ -f "$SESSION_DIR/status.json" ]; then
    UPDATED_STATUS=$(jq --arg sessionId "$SESSION_ID" \
                       --arg task "$CURRENT_TASK" \
                       --argjson files "$FILES_JSON" \
                       --arg eta "$ETA_TIME" \
                       --argjson coord "$COORD_JSON" \
                       '.currentTask = $task | 
                        .filesModified = $files | 
                        .estimatedCompletion = $eta | 
                        .needsCoordination = $coord' \
                     "$SESSION_DIR/status.json")
    
    echo "$UPDATED_STATUS" > "$SESSION_DIR/status.json"
fi

# Add to session notes
if [ -f "$SESSION_DIR/notes.md" ]; then
    echo "" >> "$SESSION_DIR/notes.md"
    echo "### Update: $CURRENT_TIME" >> "$SESSION_DIR/notes.md"
    echo "- **Status**: $NEW_STATUS" >> "$SESSION_DIR/notes.md"
    echo "- **Task**: $CURRENT_TASK" >> "$SESSION_DIR/notes.md"
    if [ "$ETA_TIME" != "null" ]; then
        echo "- **ETA**: $ETA_TIME" >> "$SESSION_DIR/notes.md"
    fi
    echo "" >> "$SESSION_DIR/notes.md"
fi

# Show status summary
echo ""
echo "✅ Статус сесії $SESSION_ID оновлено!"
echo ""
echo "📊 Поточний стан:"
echo "   Status: $NEW_STATUS"
echo "   Task: $CURRENT_TASK"
if [ "$ETA_TIME" != "null" ]; then
    echo "   ETA: $ETA_TIME"
fi
echo "   Files: $FILES_JSON"
if [ "$COORD_JSON" != "[]" ]; then
    echo "   Coordination: $COORD_JSON"
fi

# Check for coordination alerts
if [ "$COORD_JSON" != "[]" ]; then
    echo ""
    echo "🔔 Потрібна координація з іншими сесіями!"
    echo "   Перевірте active sessions та зв'яжіться з ними"
fi

# Notify if session is blocked
if [ "$NEW_STATUS" = "blocked" ]; then
    echo ""
    echo "⚠️  Сесія заблокована!"
    echo "   Оновіть блокуючі фактори в session notes"
fi

# Show other active sessions if coordination needed
if [ "$COORD_JSON" != "[]" ] || [ "$NEW_STATUS" = "waiting" ]; then
    echo ""
    echo "👥 Інші активні сесії:"
    jq -r '.[] | select(.sessionId != "'$SESSION_ID'") | "   🆔 \(.sessionId) - \(.type) - \(.status) - \(.currentTask)"' docs/session-logs/current-sessions.json
fi

echo ""