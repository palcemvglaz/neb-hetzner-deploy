#!/bin/bash

# Safe Process Killer - only kills processes from THIS specific project
# Usage: ./scripts/safe-process-killer.sh [port] [project_name]

PROJECT_NAME="nebachiv-content-app"
PROJECT_DIR="/Users/chyngys/scripts/neb-content-appv2"
PORT=${1:-3205}

echo "🔍 Looking for processes from project: $PROJECT_NAME on port $PORT"

# Function to safely kill processes
safe_kill_by_port() {
    local port=$1
    local project_name=$2
    
    if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "✅ Port $port is free"
        return 0
    fi
    
    echo "⚠️  Port $port is in use. Analyzing processes..."
    
    # Get all processes on this port
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    for pid in $pids; do
        if [ -z "$pid" ]; then continue; fi
        
        # Get detailed process info
        local process_info=$(ps -p $pid -o pid,ppid,command= 2>/dev/null)
        local cwd=$(lsof -p $pid 2>/dev/null | grep "cwd" | awk '{print $9}' | head -1)
        
        echo "📋 Process $pid: $process_info"
        echo "📁 Working directory: $cwd"
        
        # Check if this process belongs to our project
        local should_kill=false
        
        # Method 1: Check if process is in our project directory
        if [[ "$cwd" == "$PROJECT_DIR"* ]]; then
            should_kill=true
            echo "✅ Process is in our project directory"
        fi
        
        # Method 2: Check if command contains our project name or specific patterns
        if [[ $process_info == *"$project_name"* ]] || 
           [[ $process_info == *"next dev"*"3205"* ]] || 
           [[ $process_info == *"prisma studio"* ]] && [[ "$cwd" == "$PROJECT_DIR"* ]]; then
            should_kill=true
            echo "✅ Process matches our project patterns"
        fi
        
        # Method 3: Check package.json in working directory
        if [ -f "$cwd/package.json" ] && grep -q "\"name\".*\"$project_name\"" "$cwd/package.json" 2>/dev/null; then
            should_kill=true
            echo "✅ Process belongs to our project (verified via package.json)"
        fi
        
        if [ "$should_kill" = true ]; then
            echo "🛑 Killing process $pid (belongs to $project_name)"
            kill -9 $pid 2>/dev/null
            sleep 1
        else
            echo "🔒 Keeping process $pid (belongs to different project)"
            echo "   If you need to stop it, please do it manually: kill $pid"
        fi
        
        echo "---"
    done
}

# Function to kill processes by pattern (safer version)
safe_kill_by_pattern() {
    local pattern=$1
    local project_dir=$2
    
    echo "🔍 Looking for processes matching pattern: $pattern"
    
    # Find processes matching pattern
    local pids=$(pgrep -f "$pattern" 2>/dev/null)
    
    for pid in $pids; do
        if [ -z "$pid" ]; then continue; fi
        
        local cwd=$(lsof -p $pid 2>/dev/null | grep "cwd" | awk '{print $9}' | head -1)
        local process_info=$(ps -p $pid -o command= 2>/dev/null)
        
        echo "📋 Found process $pid: $process_info"
        echo "📁 Working directory: $cwd"
        
        # Only kill if it's in our project directory
        if [[ "$cwd" == "$project_dir"* ]]; then
            echo "🛑 Killing process $pid (in our project directory)"
            kill -9 $pid 2>/dev/null
        else
            echo "🔒 Keeping process $pid (different project directory)"
        fi
        
        echo "---"
    done
}

# Main execution
echo "🚀 Safe Process Killer for $PROJECT_NAME"
echo "📁 Project directory: $PROJECT_DIR"
echo ""

# Kill by port (main method)
safe_kill_by_port $PORT $PROJECT_NAME

# Additionally, kill common development processes in our directory only
safe_kill_by_pattern "next dev.*$PORT" $PROJECT_DIR
safe_kill_by_pattern "prisma studio" $PROJECT_DIR

echo ""
echo "✅ Safe cleanup completed!"
echo "💡 Only processes from $PROJECT_NAME were affected"