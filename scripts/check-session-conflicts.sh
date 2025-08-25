#!/bin/bash

# Claude Session Conflict Checker
# Usage: ./scripts/check-session-conflicts.sh [FILE_PATH]

set -e

FILE_PATH="$1"

echo "🔍 Claude Session Conflict Checker"
echo "=================================="
echo ""

# Check if sessions file exists
if [ ! -f "docs/session-logs/current-sessions.json" ]; then
    echo "📋 Немає активних сесій"
    exit 0
fi

# Show active sessions
echo "👥 Активні сесії:"
jq -r '.[] | "🆔 \(.sessionId) - \(.type) - \(.status) - Last: \(.lastUpdate)"' docs/session-logs/current-sessions.json
echo ""

# If specific file provided, check conflicts for that file
if [ -n "$FILE_PATH" ]; then
    echo "📁 Перевірка конфліктів для: $FILE_PATH"
    echo ""
    
    # Find sessions that might conflict
    CONFLICTS=$(jq -r --arg file "$FILE_PATH" '.[] | select(.scope[] | contains($file) or $file | contains(.)) | .sessionId' docs/session-logs/current-sessions.json)
    
    if [ -z "$CONFLICTS" ]; then
        echo "✅ Конфліктів не знайдено для $FILE_PATH"
    else
        echo "⚠️  Потенційні конфлікти:"
        echo "$CONFLICTS" | while read session; do
            echo "   🔴 $session"
        done
        echo ""
        echo "🤝 Рекомендується координація перед змінами"
    fi
    exit 0
fi

# General conflict analysis
echo "🔍 Аналіз конфліктів між сесіями:"
echo ""

# Check for overlapping scopes
jq -r '.[] | {sessionId, scope}' docs/session-logs/current-sessions.json | \
while IFS= read -r session_data; do
    SESSION_ID=$(echo "$session_data" | jq -r '.sessionId')
    SCOPE=$(echo "$session_data" | jq -r '.scope[]')
    
    echo "🆔 $SESSION_ID:"
    echo "$SCOPE" | while read dir; do
        echo "   📁 $dir"
        
        # Check if other sessions have overlapping scope
        OTHER_SESSIONS=$(jq -r --arg currentId "$SESSION_ID" --arg dir "$dir" \
            '.[] | select(.sessionId != $currentId and (.scope[] | contains($dir) or $dir | contains(.))) | .sessionId' \
            docs/session-logs/current-sessions.json)
        
        if [ -n "$OTHER_SESSIONS" ]; then
            echo "$OTHER_SESSIONS" | while read other; do
                echo "      ⚠️  Overlap with $other"
            done
        fi
    done
    echo ""
done

# Check for coordination needs
echo "🤝 Необхідна координація:"
COORD_NEEDED=$(jq -r '.[] | select(.needsCoordination | length > 0) | {sessionId, needsCoordination}' docs/session-logs/current-sessions.json)

if [ -z "$COORD_NEEDED" ]; then
    echo "✅ Координація не потрібна"
else
    echo "$COORD_NEEDED" | jq -r '"🆔 \(.sessionId) needs coordination with: \(.needsCoordination | join(", "))"'
fi

echo ""

# Check for blocked sessions
echo "🚫 Заблоковані сесії:"
BLOCKED=$(jq -r '.[] | select(.status == "blocked" or .status == "waiting") | .sessionId' docs/session-logs/current-sessions.json)

if [ -z "$BLOCKED" ]; then
    echo "✅ Немає заблокованих сесій"
else
    echo "$BLOCKED" | while read session; do
        echo "   🔴 $session"
        TASK=$(jq -r --arg id "$session" '.[] | select(.sessionId == $id) | .currentTask' docs/session-logs/current-sessions.json)
        echo "      Task: $TASK"
    done
fi

echo ""

# Git branch conflicts
echo "🌿 Git branch аналіз:"
CURRENT_BRANCH=$(git branch --show-current)
echo "   Current branch: $CURRENT_BRANCH"

# Show all session branches
echo "   Session branches:"
jq -r '.[] | "   🆔 \(.sessionId): \(.branch)"' docs/session-logs/current-sessions.json

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo ""
    echo "⚠️  Незбережені зміни в git:"
    git status --porcelain | head -10
    if [ $(git status --porcelain | wc -l) -gt 10 ]; then
        echo "   ... та ще $(( $(git status --porcelain | wc -l) - 10 )) файлів"
    fi
fi

echo ""

# Recommendations
echo "💡 Рекомендації:"

# Check session activity
INACTIVE_SESSIONS=$(jq -r --arg time "$(date -u -d '2 hours ago' +%Y-%m-%dT%H:%M:%SZ)" \
    '.[] | select(.lastUpdate < $time and .status == "active") | .sessionId' \
    docs/session-logs/current-sessions.json)

if [ -n "$INACTIVE_SESSIONS" ]; then
    echo "   ⏰ Неактивні сесії (>2 години):"
    echo "$INACTIVE_SESSIONS" | while read session; do
        echo "      🔶 $session - перевірте статус"
    done
fi

# Check for high conflict sessions
HIGH_CONFLICT=$(jq -r '.[] | select(.conflictLevel == "HIGH") | .sessionId' docs/session-logs/current-sessions.json)
if [ -n "$HIGH_CONFLICT" ]; then
    echo "   🔴 Високий ризик конфліктів:"
    echo "$HIGH_CONFLICT" | while read session; do
        echo "      ⚠️  $session - активна координація"
    done
fi

# General recommendations
echo "   📋 Загальні поради:"
echo "      1. Оновлюйте статус кожну годину"
echo "      2. Комітьте зміни частіше"
echo "      3. Координуйтеся перед зміною спільних файлів"
echo "      4. Використовуйте feature branches"

echo ""
echo "🔄 Для оновлення статусу: ./scripts/update-session-status.sh"
echo "📖 Повна документація: docs/CLAUDE_SESSION_MANAGEMENT.md"