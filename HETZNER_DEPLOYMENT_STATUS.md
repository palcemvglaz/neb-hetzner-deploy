# 🚀 HETZNER DEPLOYMENT STATUS - NEBACHIV PROJECT

> **CRITICAL**: This file contains all deployment information. Read BEFORE any session!

## 📊 OVERALL PROGRESS: 40% Complete

### Quick Status
- ✅ Server ordered and configured
- ✅ PostgreSQL running in Docker
- 🔄 Infrastructure partially installed
- ❌ Application not deployed yet
- ❌ Domain not configured

---

## 🔑 CRITICAL ACCESS INFORMATION

### Hetzner Cloud Panel
```
URL: https://console.hetzner.cloud
Username: (ADD YOUR HETZNER EMAIL HERE)
Password: (ADD YOUR HETZNER PASSWORD HERE)
```

### Hetzner Server
```
IP Address: 49.12.74.42
Server Type: (Unknown - check Hetzner panel)
Location: Nuremberg, Germany
OS: Ubuntu 22.04.5 LTS
Hostname: nebachiv-prod
```

### SSH Access
```bash
ssh root@49.12.74.42
Root Password: chupocabroNE8-
```

### PostgreSQL Database
```
Host: 49.12.74.42
Port: 5432
Database: nebachiv_prod
Username: nebachiv
Password: NebachivProd2024!

Connection String:
postgresql://nebachiv:NebachivProd2024!@49.12.74.42:5432/nebachiv_prod
```

### Docker Containers
```
PostgreSQL Container: nebachiv_postgres
Status: Running on port 5432
Image: postgres:16-alpine
```

---

## 📝 DEPLOYMENT LOG

### 2025-08-21 (Initial Setup)

**14:00** - Server accessed, password change required
- Old password: CJTJcXrC3he3EsWadgRU (expired)
- New password: chupocabroNE8-

**14:10** - System updates
```bash
apt update && apt upgrade -y
# Updated 6 packages including kernel
```

**14:20** - Docker installation
```bash
curl -fsSL https://get.docker.com | sh
# Docker version 28.3.3 installed
```

**14:25** - Docker Compose and PostgreSQL client
```bash
apt install -y docker-compose postgresql-client
```

**14:30** - Created project structure
```bash
mkdir -p /opt/nebachiv/{data,backups,scripts}
cd /opt/nebachiv
```

**14:35** - PostgreSQL setup
```bash
docker run -d --name nebachiv_postgres \
  -p 5432:5432 \
  -e POSTGRES_USER=nebachiv \
  -e POSTGRES_PASSWORD=NebachivProd2024! \
  -e POSTGRES_DB=nebachiv_prod \
  postgres:16-alpine
```

**14:40** - Firewall configuration
```bash
ufw allow 22/tcp   # SSH
ufw allow 5432/tcp # PostgreSQL
ufw allow 5050/tcp # PgAdmin (not installed yet)
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

**14:45** - PostgreSQL verification
```bash
docker exec nebachiv_postgres pg_isready -U nebachiv
# Result: accepting connections ✅
```

---

## ✅ COMPLETED TASKS

### STAGE 2: SERVER SETUP
- [x] Hetzner server ordered
- [x] SSH access configured
- [x] Root password changed
- [x] System updated to latest packages
- [x] Hostname set to nebachiv-prod

### STAGE 3: INFRASTRUCTURE (Partial)
- [x] Docker installed (v28.3.3)
- [x] Docker Compose installed
- [x] PostgreSQL 16 running in Docker
- [x] Database nebachiv_prod created
- [x] Firewall configured with required ports
- [x] PostgreSQL accessible remotely

---

## ❌ PENDING TASKS

### STAGE 1: PREPARATION
- [ ] Export local PostgreSQL data
- [ ] Backup test users (6 accounts)
- [ ] Export RiderSkillMap data
- [ ] Export RiderTimelineEvent data
- [ ] Export Waitlist entries
- [ ] Save all environment variables

### STAGE 3: INFRASTRUCTURE (Continue)
- [ ] Install Node.js 20
- [ ] Install PM2 for process management
- [ ] Install Nginx web server
- [ ] Install Git
- [ ] Configure Nginx for domain

### STAGE 4: DEPLOYMENT
- [ ] Clone repository from GitHub
- [ ] Install npm dependencies
- [ ] Create production .env file
- [ ] Run Prisma migrations
- [ ] Import database dump
- [ ] Build Next.js application
- [ ] Start with PM2

### STAGE 5: VERIFICATION
- [ ] Test all 6 user accounts login
- [ ] Verify skill tree (levels 35, 75)
- [ ] Check timeline events display
- [ ] Test waitlist functionality
- [ ] Verify dark theme on all pages
- [ ] Test all API endpoints

### STAGE 6: DOMAIN
- [ ] Configure DNS records
- [ ] Setup Nginx virtual host
- [ ] Install SSL certificate (Let's Encrypt)
- [ ] Test HTTPS access

### STAGE 7: MONITORING
- [ ] Setup automatic backups
- [ ] Configure log rotation
- [ ] Setup PM2 monitoring
- [ ] Create health check scripts
- [ ] Setup alerting

---

## 🔧 NEXT STEPS (Priority Order)

### 1. LOCAL: Export Data
```bash
# On local machine
docker exec neb-postgres pg_dump -U nebachiv nebachiv_dev > local_backup.sql
```

### 2. SERVER: Install Node.js
```bash
# On server
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### 3. SERVER: Install PM2 and Nginx
```bash
npm install -g pm2
apt install -y nginx
```

### 4. SERVER: Clone and Deploy
```bash
cd /opt/nebachiv
git clone [REPOSITORY_URL]
cd neb-content-appv2
npm install
npx prisma generate
```

---

## 🚨 CRITICAL DATA TO PRESERVE

### Test Accounts (MUST WORK)
1. student@test.com - password123 (Beginner, Level 35)
2. student2@test.com - password123 (Experienced, Level 75)
3. admin@test.com - password123
4. school@test.com - password123
5. admin@nebachiv.com - password123
6. school@nebachiv.com - password123

### Database Tables (MUST MIGRATE)
- User (all test accounts)
- RiderSkillMap (skill levels)
- RiderTimelineEvent (rider journey)
- Waitlist (form submissions)
- Course/Enrollment (if any)

### Features (MUST VERIFY)
- ✅ Dark theme on ALL pages
- ✅ /teaser as main homepage
- ✅ Questionnaire saves profiles
- ✅ Skill tree visualization works
- ✅ Timeline shows events
- ✅ Waitlist form saves to DB

---

## 📌 KNOWN ISSUES & SOLUTIONS

### Issue 1: SSH Password Expired
**Problem**: Initial root password expired immediately
**Solution**: Changed to chupocabroNE8-

### Issue 2: Docker Compose YAML Error
**Problem**: docker-compose.yml wasn't created properly
**Solution**: Used direct docker run command instead

### Issue 3: Connection Timeout
**Problem**: SSH connection timed out after firewall enable
**Solution**: Connection restored, firewall rules are correct

---

## 📞 EMERGENCY CONTACTS

### Server Access Lost?
1. Check Hetzner Cloud Console
2. Use VNC console from Hetzner panel
3. Verify firewall didn't block SSH

### Database Connection Issues?
```bash
# Test from server
docker exec nebachiv_postgres pg_isready -U nebachiv

# Test from local
psql postgresql://nebachiv:NebachivProd2024!@49.12.74.42:5432/nebachiv_prod
```

### Application Not Starting?
1. Check PM2 logs: `pm2 logs`
2. Check Node version: `node --version`
3. Check port 3205: `lsof -i:3205`

---

## 📅 SESSION HISTORY

### Session 1: 2025-08-21
- Initial server setup
- Docker and PostgreSQL installation
- Firewall configuration
- **Next**: Need to continue with Node.js installation

### Session 2: [Current]
- Creating documentation
- Planning next steps
- **Todo**: Export local data, install remaining infrastructure

---

## 🎯 SUCCESS CRITERIA

Deployment is complete when:
1. ✅ All 6 test accounts can login
2. ✅ Skill tree shows correct levels
3. ✅ Timeline displays events
4. ✅ Waitlist saves entries
5. ✅ Dark theme everywhere
6. ✅ SSL certificate active
7. ✅ Automatic backups running
8. ✅ Zero errors in logs

---

**LAST UPDATED**: 2025-08-22
**NEXT REVIEW**: Before continuing deployment