#!/bin/bash

echo "🔄 Rolling back from PostgreSQL to SQLite..."
echo

# 1. Stop the server
echo "1. Stopping Next.js server..."
kill $(lsof -ti:3205) 2>/dev/null && echo "   ✅ Server stopped" || echo "   ⚠️ Server was not running"

# 2. Stop PostgreSQL
echo
echo "2. Stopping PostgreSQL container..."
docker stop nebachiv_postgres 2>/dev/null && echo "   ✅ PostgreSQL stopped" || echo "   ⚠️ PostgreSQL was not running"

# 3. Restore SQLite .env
echo
echo "3. Restoring SQLite configuration..."
if [ -f ".env.sqlite.backup" ]; then
    cp .env.sqlite.backup .env
    echo "   ✅ SQLite .env restored"
else
    echo "   ❌ SQLite backup not found!"
    exit 1
fi

# 4. Update Prisma schema to SQLite
echo
echo "4. Updating Prisma schema to SQLite..."
sed -i '' 's/provider = "postgresql"/provider = "sqlite"/' prisma/schema.prisma
echo "   ✅ Prisma schema updated to SQLite"

# 5. Restore SQLite database if backup exists
echo
echo "5. Checking SQLite database..."
if [ -f "prisma/dev.db" ]; then
    echo "   ✅ SQLite database exists"
elif [ -f "prisma/dev.db.backup" ]; then
    cp prisma/dev.db.backup prisma/dev.db
    echo "   ✅ SQLite database restored from backup"
else
    echo "   ⚠️ SQLite database not found, will need to seed"
fi

# 6. Generate Prisma client for SQLite
echo
echo "6. Generating Prisma client for SQLite..."
npx prisma generate

# 7. Push schema to SQLite
echo
echo "7. Pushing schema to SQLite..."
npx prisma db push --accept-data-loss

# 8. Start server
echo
echo "8. Starting Next.js server..."
npm run dev &
SERVER_PID=$!

echo
echo "⏳ Waiting for server to start..."
sleep 3

# Check if server started
if lsof -ti:3205 > /dev/null 2>&1; then
    echo "   ✅ Server started successfully"
    echo
    echo "🎉 Rollback completed successfully!"
    echo
    echo "📍 Current status:"
    echo "   • Database: SQLite (file:./prisma/dev.db)"
    echo "   • Server: http://localhost:3205"
    echo "   • Prisma Studio: npx prisma studio"
    echo
    echo "🔐 Test login with:"
    echo "   • Email: admin@test.com | Password: password123"
else
    echo "   ❌ Server failed to start"
    echo "   Check logs: tail -f nextjs.log"
fi