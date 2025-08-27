# 🚀 HETZNER DEPLOYMENT INSTRUCTIONS

## 📋 PHASE 1: Server Infrastructure Setup

### 1. SSH Connection
```bash
ssh root@49.12.74.42
# Password: chupocabroNE8-
```

### 2. Install Node.js 20
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show compatible npm version
```

### 3. Install PM2 Process Manager
```bash
# Install PM2 globally
npm install -g pm2

# Verify PM2 installation
pm2 --version

# Setup PM2 startup
pm2 startup
# Copy and run the command it provides
```

### 4. Install Nginx Web Server
```bash
# Update package list
apt update

# Install Nginx and Git
apt install -y nginx git

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Check status
systemctl status nginx
```

### 5. Create Application Directory
```bash
# Create app directory
mkdir -p /opt/nebachiv
cd /opt/nebachiv

# Set proper permissions
chown -R root:root /opt/nebachiv
```

## 📋 PHASE 2: Application Deployment

### 1. Clone Repository
```bash
cd /opt/nebachiv
git clone https://github.com/palcemvglaz/neb-hetzner-deploy.git nebachiv-app
cd nebachiv-app

# Check if clone successful
ls -la
```

### 2. Setup Environment Variables
```bash
# Copy environment template
cp .env.production.example .env

# Edit environment file
nano .env

# Set these values in .env:
DATABASE_URL="postgresql://nebachiv:NebachivProd2024!@localhost:5432/nebachiv_prod"
NEXTAUTH_URL="http://49.12.74.42:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. Install Dependencies and Build
```bash
# Install production dependencies only
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Build the application
npm run build

# Check build success
ls -la .next/
```

## 📋 PHASE 3: Database Setup

### 1. Check PostgreSQL Status
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# If not running, start it
docker start nebachiv_postgres
```

### 2. Import Database Dump
```bash
# Import the database dump
psql postgresql://nebachiv:NebachivProd2024!@localhost:5432/nebachiv_prod < full_database_20250822_162213.sql

# Run migrations
npx prisma migrate deploy

# Verify database
psql postgresql://nebachiv:NebachivProd2024!@localhost:5432/nebachiv_prod -c "\dt"
```

## 📋 PHASE 4: Launch Application

### 1. Start Application with PM2
```bash
# Start Next.js application
pm2 start npm --name "nebachiv" -- start

# Save PM2 configuration
pm2 save

# Check application status
pm2 status

# View application logs
pm2 logs nebachiv
```

### 2. Configure Port
```bash
# Check what port the app is running on
pm2 logs nebachiv | grep "ready"

# If needed, modify start command to use port 3000
pm2 delete nebachiv
pm2 start "npm start -- -p 3000" --name "nebachiv"
pm2 save
```

## 📋 PHASE 5: Basic Testing

### 1. Test Application Locally
```bash
# Check if app responds
curl -I http://localhost:3000

# Check specific endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000
```

### 2. Test External Access
From your local machine:
```bash
# Test server access
curl -I http://49.12.74.42:3000
```

## 🔍 Verification Checklist

After each phase, verify:

### Phase 1 Complete:
- [ ] Node.js 20 installed (`node --version`)
- [ ] PM2 installed (`pm2 --version`) 
- [ ] Nginx installed (`systemctl status nginx`)
- [ ] Application directory created (`ls /opt/nebachiv`)

### Phase 2 Complete:
- [ ] Repository cloned (`ls /opt/nebachiv/nebachiv-app`)
- [ ] Environment configured (`cat /opt/nebachiv/nebachiv-app/.env`)
- [ ] Dependencies installed (`ls node_modules`)
- [ ] Application built (`ls .next`)

### Phase 3 Complete:
- [ ] PostgreSQL running (`docker ps | grep postgres`)
- [ ] Database imported (check table count)
- [ ] Migrations applied (`npx prisma migrate status`)

### Phase 4 Complete:
- [ ] PM2 running app (`pm2 status`)
- [ ] Application responding (`curl http://localhost:3000`)
- [ ] No errors in logs (`pm2 logs nebachiv`)

### Phase 5 Complete:
- [ ] External access works (`curl http://49.12.74.42:3000`)
- [ ] API endpoints respond
- [ ] No critical errors

## 🚨 Troubleshooting

### Common Issues:

1. **Node.js installation fails**:
   ```bash
   # Try alternative method
   snap install node --classic
   ```

2. **PM2 startup fails**:
   ```bash
   # Manual startup setup
   pm2 unstartup
   pm2 startup
   ```

3. **Database connection fails**:
   ```bash
   # Check PostgreSQL container
   docker logs nebachiv_postgres
   docker restart nebachiv_postgres
   ```

4. **Build fails**:
   ```bash
   # Clean and retry
   rm -rf node_modules .next
   npm install
   npm run build
   ```

5. **Port conflicts**:
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   # Kill process if needed
   kill $(lsof -t -i:3000)
   ```

## 📝 Progress Tracking

Mark completed phases:
- [ ] Phase 1: Server Infrastructure
- [ ] Phase 2: Application Deployment  
- [ ] Phase 3: Database Setup
- [ ] Phase 4: Launch Application
- [ ] Phase 5: Basic Testing

Current Progress: 40% → Target: 80% (Ready for domain/SSL)