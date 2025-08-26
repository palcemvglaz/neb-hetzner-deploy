#!/bin/bash
# Hetzner Production Setup Script

set -e

echo "🚀 Setting up Nebachiv on Hetzner..."

# Check Node.js version
echo "📋 Checking Node.js version..."
node --version
npm --version

# Check PostgreSQL connection
echo "📋 Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL client available"
else
    echo "❌ PostgreSQL client not found. Install with: apt install postgresql-client"
    exit 1
fi

# Install dependencies
echo "📦 Installing production dependencies..."
npm ci --only=production

# Check environment file
if [ ! -f ".env.production" ]; then
    echo "⚠️  Creating .env.production from example..."
    cp .env.production.example .env.production
    echo "❗ IMPORTANT: Edit .env.production with real values before continuing!"
    echo "❗ Required: DATABASE_URL, NEXTAUTH_SECRET, OAuth keys"
    exit 1
fi

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Build application
echo "🏗️  Building application..."
npm run build

# Test build
if [ ! -d ".next" ]; then
    echo "❌ Build failed - .next directory not found"
    exit 1
fi

echo "✅ Build successful!"

# Setup PM2 if available
if command -v pm2 &> /dev/null; then
    echo "🔄 Setting up PM2..."
    pm2 start npm --name "nebachiv" -- start
    pm2 save
    pm2 startup
    echo "✅ PM2 configured"
else
    echo "⚠️  PM2 not found. Install with: npm install -g pm2"
    echo "🚀 Starting server manually..."
    npm start
fi

echo ""
echo "🎉 Setup complete!"
echo "📊 Health check: curl http://localhost:3205/api/health"