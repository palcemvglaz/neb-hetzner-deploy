# HETZNER DEPLOYMENT - ПОСТІЙНА ІНСТРУКЦІЯ ДЛЯ CLAUDE

## 🚨 КРИТИЧНО ВАЖЛИВА ІНФОРМАЦІЯ - ЧИТАЙ КОЖНУ СЕСІЮ!

### 📂 СТРУКТУРА ПРОЕКТІВ:
```
/Users/chyngys/scripts/neb-content-appv2/  ← РОБОЧА локальна версія (розробка)
/Users/chyngys/scripts/neb-hetzner/        ← ЧИСТА копія для деплойменту (ТУТ МИ ЗАРАЗ!)
```

### 🎯 ПРАВИЛО #1: HETZNER DEPLOYMENT PROCESS
```
1️⃣ ЗБИРАЄМО чисту копію в neb-hetzner локально
2️⃣ PUSH в GitHub репозиторій  
3️⃣ PULL на Hetzner сервері
```

**НІКОЛИ НЕ ДЕПЛОЇМО НАПРЯМУ З neb-content-appv2!**

---

## 🔧 HETZNER PROJECT INFO

### Git Repository
- **Remote**: `https://github.com/palcemvglaz/neb-hetzner-deploy.git`
- **Branch**: `main`
- **Local path**: `/Users/chyngys/scripts/neb-hetzner/`

### Server Details
- **IP**: `49.12.74.42`
- **SSH**: `ssh root@49.12.74.42`
- **Deploy path**: `/var/www/nebachiv/` (або подібний)

### Database
- **PostgreSQL** вже налаштований на сервері
- **Port**: 5432 (стандартний)
- **Connection string**: буде в .env.production

---

## 📋 СТАНДАРТНИЙ ПРОЦЕС DEPLOYMENT

### ЕТАП 1: Підготовка чистої копії (neb-hetzner)
```bash
cd /Users/chyngys/scripts/neb-hetzner

# Копіюємо критичні файли з робочої версії
cp ../neb-content-appv2/next.config.js .
cp ../neb-content-appv2/lib/db/prisma.ts lib/db/
cp -r ../neb-content-appv2/app/api/admin/questionnaires app/api/admin/
cp -r ../neb-content-appv2/tests .
cp ../neb-content-appv2/HETZNER_DEPLOYMENT_CHECKLIST.md .

# Фіксимо імпорти (якщо потрібно)
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '' "s|import.*prisma.*from.*'@/lib/prisma'|import { prisma } from '@/lib/db/prisma'|g"

# Додаємо production конфігурацію
# (environment variables, build settings тощо)
```

### ЕТАП 2: Git Push
```bash
git add .
git commit -m "feat: production-ready deployment 

✅ Fixed imports and configurations
✅ Added testing suite  
✅ Ready for Hetzner deployment

🚀 Generated with Claude Code"
git push origin main
```

### ЕТАП 3: Hetzner Deployment
```bash
# SSH на сервер
ssh root@49.12.74.42

# На сервері
cd /var/www/nebachiv
git pull origin main
npm ci --only=production
npm run build
pm2 restart nebachiv || pm2 start npm --name "nebachiv" -- start
```

---

## 🚨 ВАЖЛИВІ НАГАДУВАННЯ ДЛЯ CLAUDE

### ❌ НЕ РОБИ:
- Не деплой напряму з neb-content-appv2
- Не плутай робочу версію з deployment версією
- Не забувай про фіксацію імпортів
- Не push'у без тестування

### ✅ ЗАВЖДИ РОБИ:
- Працюй в `/Users/chyngys/scripts/neb-hetzner/`
- Копіюй файли з neb-content-appv2
- Перевіряй імпорти та конфігурацію
- Тестуй перед push
- Використовуй детальні commit messages

### 🔍 CHECKLIST ПЕРЕД DEPLOYMENT:
- [ ] Працюю в neb-hetzner директорії?
- [ ] Скопійовані всі критичні файли?
- [ ] Імпорти виправлені?
- [ ] Production конфігурація додана?
- [ ] Testing suite включена?
- [ ] Git commit зроблений?

---

## 📞 ШВИДКІ КОМАНДИ

### Перевірка статусу
```bash
# Де я зараз?
pwd  # Повинно бути /Users/chyngys/scripts/neb-hetzner

# Що змінилось?
git status --short

# Тест системи
node tests/quick-test.js  # (після копіювання tests)
```

### Emergency Recovery
```bash
# Якщо щось пішло не так
git reset --hard HEAD~1  # Відкат на попередній commit
git clean -fd             # Очистка untracked файлів
```

---

## 🎯 ЦЯ ІНСТРУКЦІЯ = МОЯ ПОСТІЙНА ПАМ'ЯТКА

**КОЖЕН РАЗ коли працюю з Hetzner deployment - ЧИТАЮ ЦЕЙ ФАЙЛ!**

Створено: 26 серпня 2025  
Версія: 1.0  
Статус: АКТИВНА ІНСТРУКЦІЯ 🟢