# 📚 HETZNER DEPLOYMENT PROJECT - ПОВНА ДОКУМЕНТАЦІЯ

## 🎯 OVERVIEW

### Мета проекту
Завершити deployment Nebachiv додатку на Hetzner сервер (поточний прогрес: 40%)

### Структура проектів
```
/Users/chyngys/scripts/neb-content-appv2/   ← Основна розробка
/Users/chyngys/scripts/neb-hetzner/         ← ЧИСТИЙ deployment (працюємо тут!)
```

### Git репозиторії
- **neb-content-appv2**: локальна розробка (власний Git)
- **neb-hetzner**: `https://github.com/palcemvglaz/neb-hetzner-deploy.git`

---

## 🔄 DEPLOYMENT WORKFLOW

```mermaid
graph LR
    A[Розробка в neb-content-appv2] --> B[Копіювання в neb-hetzner]
    B --> C[Локальний build & test]
    C --> D[Push в GitHub]
    D --> E[Pull на Hetzner]
    E --> F[Production build]
    F --> G[PM2 start]
```

### Детальний процес:
1. **Розробка** - фічі та фікси в `/neb-content-appv2/`
2. **Копіювання** - критичні файли в `/neb-hetzner/`
3. **Локальний тест** - `npm run build` в `/neb-hetzner/`
4. **Git push** - в GitHub репозиторій
5. **Server pull** - на Hetzner сервері
6. **Production build** - на сервері
7. **Launch** - через PM2

---

## 🖥️ SERVER INFRASTRUCTURE

### Hetzner Server
```
IP: 49.12.74.42
OS: Ubuntu 22.04.5 LTS
Location: Nuremberg, Germany
Hostname: nebachiv-prod
```

### SSH Access
```bash
ssh root@49.12.74.42
Password: chupocabroNE8-
```

### PostgreSQL Database
```
Host: 49.12.74.42
Port: 5432
Database: nebachiv_prod
Username: nebachiv
Password: NebachivProd2024!

Connection: postgresql://nebachiv:NebachivProd2024!@49.12.74.42:5432/nebachiv_prod
```

### Docker Container
- **Name**: nebachiv_postgres
- **Image**: postgres:16-alpine
- **Status**: Running ✅

---

## 📊 DEPLOYMENT STATUS: 40% Complete

### ✅ COMPLETED (40%)
- [x] Server ordered and configured
- [x] SSH access working
- [x] PostgreSQL in Docker
- [x] Firewall configured
- [x] Database created
- [x] Local build working

### ❌ PENDING (60%)
- [ ] Install Node.js 20 on server
- [ ] Install PM2 process manager
- [ ] Install Nginx web server
- [ ] Clone repository
- [ ] Import database dump
- [ ] Build application on server
- [ ] Configure domain & SSL
- [ ] Verify all features

---

## 🚀 DEPLOYMENT PHASES

### Phase 1: Server Infrastructure [NEXT STEP]
```bash
# SSH to server
ssh root@49.12.74.42

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 & Nginx
npm install -g pm2
apt install -y nginx git
```

### Phase 2: Application Deployment
```bash
# Clone repository
cd /opt/nebachiv
git clone https://github.com/palcemvglaz/neb-hetzner-deploy.git nebachiv-app
cd nebachiv-app

# Setup environment
cp .env.production.example .env
# Edit .env with production values

# Install & build
npm ci --only=production
npx prisma generate
npm run build
```

### Phase 3: Database Setup
```bash
# Import database
psql postgresql://nebachiv:NebachivProd2024!@49.12.74.42:5432/nebachiv_prod < full_database_20250822_162213.sql

# Run migrations
npx prisma migrate deploy
```

### Phase 4: Launch Application
```bash
# Start with PM2
pm2 start npm --name "nebachiv" -- start
pm2 save
pm2 startup
```

### Phase 5: Domain & SSL
```bash
# Configure Nginx
# Setup Let's Encrypt SSL
# Point domain DNS to 49.12.74.42
```

---

## 🧪 VERIFICATION CHECKLIST

### Must Work:
- [ ] 6 test accounts login
  - student@test.com (Level 35)
  - student2@test.com (Level 75)
  - admin@test.com
  - school@test.com
  - admin@nebachiv.com
  - school@nebachiv.com
- [ ] Skill tree visualization
- [ ] Timeline events display
- [ ] Dark theme on all pages
- [ ] Questionnaire saves profiles
- [ ] Waitlist form works

---

## 🔧 LOCAL WORK INSTRUCTIONS

### Working Directory
```bash
cd /Users/chyngys/scripts/neb-hetzner
```

### Before Each Session
1. Check current status
2. Pull latest from GitHub
3. Review this documentation

### Making Changes
1. Copy files from `/neb-content-appv2/` if needed
2. Test locally: `npm run build`
3. Commit with clear messages
4. Push to GitHub

### Git Commands
```bash
# Check status
git status

# Commit changes
git add .
git commit -m "feat: [description]"

# Push to GitHub
git push origin main
```

---

## ❓ KNOWN ISSUES & QUESTIONS

### Issues:
1. **User problem on server** - потрібно уточнення
2. **Domain name** - не вказано який домен
3. **Local database location** - для експорту

### Questions for Resolution:
- Яка проблема з юзером на сервері?
- Який домен буде використовуватися?
- Де локальна база даних для експорту?

---

## 📋 QUICK COMMANDS REFERENCE

### Local Testing
```bash
cd /Users/chyngys/scripts/neb-hetzner
npm run build
npm run dev  # Test locally
```

### Server Connection
```bash
ssh root@49.12.74.42
# Password: chupocabroNE8-
```

### Database Connection
```bash
psql postgresql://nebachiv:NebachivProd2024!@49.12.74.42:5432/nebachiv_prod
```

---

## 🎯 PROJECT MANAGEMENT

### Recommended Approach:
1. **Work in**: `/Users/chyngys/scripts/neb-hetzner/`
2. **Use Claude**: Launch new session there
3. **Track progress**: Update this doc after each session
4. **Git history**: All changes tracked in neb-hetzner repo

### Next Immediate Actions:
1. Launch Claude in `/neb-hetzner/`
2. Install Node.js on server
3. Continue with deployment phases

---

## 📝 SESSION NOTES

### Session 1 (Aug 21)
- Server setup, PostgreSQL installed
- Progress: 0% → 40%

### Session 2 (Current)
- Documentation created
- Planning next steps
- Need to switch to neb-hetzner directory

### Session 3 (Next)
- Work from `/Users/chyngys/scripts/neb-hetzner/`
- Install Node.js on server
- Continue deployment

---

**IMPORTANT**: Наступну Claude сесію запустіть в `/Users/chyngys/scripts/neb-hetzner/` для продовження роботи!

Last Updated: 2025-08-27