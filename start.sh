#!/bin/bash

# Nebachiv Content App - Enhanced Development Startup Script
# Incorporates best practices from my-finance-app start.sh
# Features: Terminal titles, health checks, detailed logging, error handling

# Terminal title update function
update_terminal() {
    echo -ne "\033]0;$1\007"
}

# Error handler with terminal update
handle_error() {
    update_terminal "🔴 Nebachiv Start - Failed"
    echo "❌ Error occurred during startup. Check the logs above."
    
    # Cleanup any started services
    cleanup
    exit 1
}

# Set error trap
trap 'handle_error' ERR

# Initial terminal title
update_terminal "🟡 Nebachiv Start - Initializing"
echo "🚀 Starting Nebachiv Content App development environment..."
echo "$(date '+%Y-%m-%d %H:%M:%S') - Startup initiated" >> startup.log

# Configuration
PORT=3205
PRISMA_PORT=5555
MAX_ATTEMPTS=30
DB_FILE="./prisma/dev.db"
HEALTH_CHECK_SCRIPT="./health-check.js"

# Check if running from correct directory
if [ ! -f "package.json" ] || [ ! -d "prisma" ]; then
    update_terminal "🔴 Nebachiv Start - Wrong Directory"
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Load environment variables if available
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# PID file paths
NEXTJS_PID_FILE=".nextjs.pid"
PRISMA_PID_FILE=".prisma.pid"

# Cleanup function with comprehensive shutdown
cleanup() {
    echo ""
    update_terminal "🟡 Nebachiv Start - Shutting Down"
    echo "🛑 Stopping services..."
    
    # Stop Next.js if running
    if [ -f "$NEXTJS_PID_FILE" ]; then
        NEXTJS_PID=$(cat $NEXTJS_PID_FILE)
        if kill -0 $NEXTJS_PID 2>/dev/null; then
            echo "Stopping Next.js (PID: $NEXTJS_PID)..."
            kill $NEXTJS_PID 2>/dev/null || true
        fi
        rm -f $NEXTJS_PID_FILE
    fi
    
    # Stop Prisma Studio if running
    if [ -f "$PRISMA_PID_FILE" ]; then
        PRISMA_PID=$(cat $PRISMA_PID_FILE)
        if kill -0 $PRISMA_PID 2>/dev/null; then
            echo "Stopping Prisma Studio (PID: $PRISMA_PID)..."
            kill $PRISMA_PID 2>/dev/null || true
        fi
        rm -f $PRISMA_PID_FILE
    fi
    
    # Clean up any orphaned processes on our ports
    ./scripts/safe-process-killer.sh $PORT 2>/dev/null || true
    ./scripts/safe-process-killer.sh $PRISMA_PORT 2>/dev/null || true
    
    update_terminal "✅ Nebachiv Start - Stopped"
    echo "✅ All services stopped."
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Shutdown complete" >> startup.log
    exit 0
}

# Set interrupt trap for clean shutdown
trap cleanup INT TERM

# Check dependencies
update_terminal "🟡 Nebachiv Start - Checking Dependencies"
echo "📦 Checking dependencies..."

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install || handle_error
fi

# Use safe process killer
update_terminal "🟡 Nebachiv Start - Port Check"
echo "🛡️  Using safe process killer to check ports..."
./scripts/safe-process-killer.sh $PORT || handle_error
./scripts/safe-process-killer.sh $PRISMA_PORT || true  # Prisma port is optional

# Database initialization
update_terminal "🟡 Nebachiv Start - Database Setup"
if [ ! -f "$DB_FILE" ]; then
    echo "📊 Database not found. Initializing database..."
    npm run db:push || handle_error
    echo "🌱 Seeding database with initial data..."
    npm run db:seed || handle_error
else
    echo "✅ Database exists at $DB_FILE"
    
    # Run migrations if any pending
    echo "🔄 Checking for pending migrations..."
    npm run db:push 2>&1 | grep -v "already in sync" || true
fi

# Start Prisma Studio
update_terminal "🟡 Nebachiv Start - Prisma Studio"
echo "🗄️  Starting Prisma Studio (database GUI)..."
npm run db:studio > prisma-studio.log 2>&1 &
PRISMA_PID=$!
echo $PRISMA_PID > $PRISMA_PID_FILE
echo "Prisma Studio started with PID: $PRISMA_PID"

# Give Prisma Studio time to start
sleep 3

# Verify Prisma Studio is running
if ! kill -0 $PRISMA_PID 2>/dev/null; then
    echo "⚠️  Prisma Studio failed to start. Check prisma-studio.log"
    # Continue anyway, it's not critical
fi

# Start Next.js development server
update_terminal "🟡 Nebachiv Start - Next.js Server"
echo "🔧 Starting Next.js development server on port $PORT..."
npm run dev > nextjs.log 2>&1 &
NEXTJS_PID=$!
echo $NEXTJS_PID > $NEXTJS_PID_FILE
echo "Next.js started with PID: $NEXTJS_PID"

# Wait for Next.js to be ready with retry logic
echo "⏳ Waiting for Next.js to compile and start..."
NEXTJS_READY=false
ATTEMPTS=0

while [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:$PORT > /dev/null 2>&1; then
        NEXTJS_READY=true
        break
    fi
    
    # Check if process is still running
    if ! kill -0 $NEXTJS_PID 2>/dev/null; then
        update_terminal "🔴 Nebachiv Start - Next.js Failed"
        echo "❌ Next.js process died. Check nextjs.log for errors"
        tail -20 nextjs.log
        handle_error
    fi
    
    echo "Waiting for Next.js... ($((ATTEMPTS+1))/$MAX_ATTEMPTS)"
    sleep 2
    ATTEMPTS=$((ATTEMPTS+1))
done

if [ "$NEXTJS_READY" = false ]; then
    update_terminal "🔴 Nebachiv Start - Timeout"
    echo "❌ Next.js failed to start within timeout"
    tail -20 nextjs.log
    handle_error
fi

# Run comprehensive health check
update_terminal "🟡 Nebachiv Start - Health Check"
echo ""
echo "🔍 Running comprehensive health check..."

if [ -f "$HEALTH_CHECK_SCRIPT" ]; then
    node $HEALTH_CHECK_SCRIPT || echo "⚠️  Some health checks failed, but continuing..."
else
    echo "⚠️  Health check script not found, skipping..."
fi

# Get local IP for mobile testing
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || echo "Not available")

# Success! Update terminal and show summary
update_terminal "✅ Nebachiv Start - All Running"
echo ""
echo "🎉 All services started successfully!"
echo "$(date '+%Y-%m-%d %H:%M:%S') - All services running" >> startup.log
echo ""
echo "📋 Services running:"
echo "   • Next.js App: http://localhost:$PORT"
echo "   • API Health: http://localhost:$PORT/api/health"
echo "   • Prisma Studio: http://localhost:$PRISMA_PORT"
echo "   • KB_NEB Vault: /Users/chyngys/scripts/kb_neb/vault_output"
echo ""
echo "📱 Mobile Testing (same Wi-Fi network):"
echo "   • Mobile URL: http://$LOCAL_IP:$PORT"
echo "   • Dashboard: http://$LOCAL_IP:$PORT/dashboard"
echo "   • Courses: http://$LOCAL_IP:$PORT/courses"
echo ""
echo "📍 Available URLs & Endpoints:"
echo ""
echo "   🌐 Main Pages:"
echo "      • Home: http://localhost:$PORT"
echo "      • Dashboard: http://localhost:$PORT/dashboard"
echo "      • Courses: http://localhost:$PORT/courses"
echo "      • Login: http://localhost:$PORT/login"
echo ""
echo "   🔧 API Endpoints:"
echo "      • Health: http://localhost:$PORT/api/health"
echo "      • Courses: http://localhost:$PORT/api/courses"
echo "      • KB_NEB Sync: http://localhost:$PORT/api/kb-neb/sync"
echo "      • Auth: http://localhost:$PORT/api/auth"
echo "      • Stripe: http://localhost:$PORT/api/stripe"
echo ""
echo "   👥 Role-Based Pages:"
echo "      • Admin Panel: http://localhost:$PORT/admin"
echo "      • Instructor: http://localhost:$PORT/instructor"
echo "      • School: http://localhost:$PORT/school"
echo ""
echo "   🧪 Test Pages:"
echo "      • Google OAuth Test: http://localhost:$PORT/test-google"
echo "      • Skill Test: http://localhost:$PORT/test-skill"
echo ""
echo "📄 Log files:"
echo "   • Next.js: nextjs.log"
echo "   • Prisma Studio: prisma-studio.log"
echo "   • Startup events: startup.log"
echo "   • Enhanced logs: /logs directory"
echo ""
echo "🛠️  Quick commands:"
echo "   • Health check: node health-check.js"
echo "   • Test all pages: node test-all-pages.js"
echo "   • Deep check: node deep-health-check.js"
echo "   • KB_NEB sync: npm run kb-neb:sync"
echo "   • View logs: tail -f nextjs.log"
echo "   • Terminal title: ./scripts/set-terminal-title.sh [status] [area] [task]"
echo ""
echo "💡 Tips:"
echo "   • Use the 3-level health check system regularly"
echo "   • Check enhanced logs in /logs directory for debugging"
echo "   • Update terminal title to track your work status"
echo ""
echo "📱 Mobile App Installation:"
echo "   • iOS: Open http://$LOCAL_IP:$PORT in Safari → Share → Add to Home Screen"
echo "   • Android: Open http://$LOCAL_IP:$PORT in Chrome → Menu → Add to home screen"
echo "   • Or use ngrok for external access: ngrok http $PORT"
echo ""
echo "Press Ctrl+C to stop all services safely"

# Start error watcher in new terminal (by default)
echo ""
echo "🔍 Starting Error Watcher in new terminal..."
if command -v osascript &> /dev/null; then
    # macOS - open new terminal with error watcher
    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && node error-watcher.js"'
    echo "✅ Error Watcher started in new terminal window"
else
    # Linux/other - start in background
    node error-watcher.js > error-watcher.log 2>&1 &
    ERROR_WATCHER_PID=$!
    echo $ERROR_WATCHER_PID > $ERROR_WATCHER_PID_FILE
    echo "✅ Error Watcher started in background (PID: $ERROR_WATCHER_PID)"
    echo "   View logs: tail -f error-watcher.log"
fi

# Option to disable error watcher
if [[ "$1" == "--no-watcher" ]] || [[ "$1" == "-nw" ]]; then
    echo "⏭️  Skipping Error Watcher (use ./start.sh to enable)"
    if [ -f "$ERROR_WATCHER_PID_FILE" ]; then
        kill $(cat $ERROR_WATCHER_PID_FILE) 2>/dev/null || true
        rm -f $ERROR_WATCHER_PID_FILE
    fi
fi

# Optional: Start additional services
if [ -f "./scripts/auto-backup.sh" ]; then
    echo "🔄 Starting auto-backup service..."
    ./scripts/auto-backup.sh start > /dev/null 2>&1 || echo "⚠️  Auto-backup not available"
fi

# Keep script running and monitor services
while true; do
    # Check if main services are still running
    if [ -f "$NEXTJS_PID_FILE" ] && ! kill -0 $(cat $NEXTJS_PID_FILE) 2>/dev/null; then
        update_terminal "🔴 Nebachiv Start - Next.js Crashed"
        echo "❌ Next.js process crashed! Check nextjs.log"
        tail -20 nextjs.log
        handle_error
    fi
    
    # Sleep for monitoring interval
    sleep 10
done