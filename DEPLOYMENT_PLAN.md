# 🚀 HETZNER DEPLOYMENT - МІНІПРОЕКТ

## 📍 КОНТЕКСТ
- **Робочий проект**: `/Users/chyngys/scripts/neb-content-appv2/` (2.6GB медіа)
- **Clean deployment**: `/Users/chyngys/scripts/neb-hetzner/` (ми тут)
- **Сервер**: `root@49.12.74.42` в `/opt/nebachiv/app/`
- **Проблема**: Великі медіа файли (2.6GB) не можуть йти через Git

## 🎯 РІШЕННЯ: Копіювати тільки використовувані файли (~50MB замість 2.6GB)

## 📂 СТРУКТУРА ФАЙЛІВ

### 1. `used-assets.txt` - список використовуваних медіа
```
public/icon.svg
public/manifest.json
public/sw.js
public/videos_bg/hero-background.mp4
public/marketing_data/logos/palcemvglaz_dark_ninja_buddha_wearing_ICON_motorcycle_helmet_si_bf7c9345-ed92-4730-b9aa-d957aeee424e.png
public/marketing_data/logos/palcemvglaz_httpss.mj.png
public/marketing_data/photos good for promo site/IMG_5806.png
public/marketing_data/photos good for promo site/IMG_0963.png
public/marketing_data/photos good for promo site/IMG_7735.png
public/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_06 PM.png
```

### 2. `copy-assets.sh` - копіювання з робочого проекту
```bash
#!/bin/bash
SOURCE_DIR="../neb-content-appv2"
DEST_DIR="."

while IFS= read -r filepath; do
    src="$SOURCE_DIR/$filepath"
    if [ -f "$src" ]; then
        echo "Копіюю: $filepath"
        mkdir -p "$(dirname "$filepath")"
        cp "$src" "$filepath"
    else
        echo "⚠️  Не знайдено: $filepath"
    fi
done < used-assets.txt

echo "✅ Скопійовано тільки використовувані файли!"
```

### 3. `clean-local.sh` - очищення локального проекту
```bash
#!/bin/bash
echo "🧹 Очищення neb-hetzner..."
rm -rf public/*
rm -rf .next/
rm -rf node_modules/
git clean -fd
echo "✅ Очищено!"
```

### 4. `clean-server.sh` - очищення сервера
```bash
#!/bin/bash
echo "🧹 Очищення сервера..."
ssh root@49.12.74.42 "cd /opt/nebachiv/app && rm -rf public/videos_bg/* public/marketing_data/* .next/"
echo "✅ Сервер очищено!"
```

### 5. `deploy.sh` - головний скрипт деплою
```bash
#!/bin/bash

# Флаги
MEDIA=false
if [ "$1" = "--media" ]; then
    MEDIA=true
fi

echo "🚀 Deployment почато..."

# 1. Копіюємо код з робочого проекту
echo "📋 Копіюю код..."
cp ../neb-content-appv2/next.config.js .
cp ../neb-content-appv2/package*.json .
cp -r ../neb-content-appv2/app .
cp -r ../neb-content-appv2/components .
cp -r ../neb-content-appv2/lib .
cp -r ../neb-content-appv2/hooks .
cp -r ../neb-content-appv2/styles .
cp -r ../neb-content-appv2/prisma .

# 2. Копіюємо медіа якщо потрібно
if [ "$MEDIA" = true ]; then
    echo "🖼️  Копіюю медіа файли..."
    ./copy-assets.sh
fi

# 3. Build локально
echo "🔨 Build..."
npm run build

# 4. Git операції (тільки код)
echo "📤 Push в Git..."
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M')"
git push origin main

# 5. На сервері - pull код
echo "📥 Pull на сервері..."
ssh root@49.12.74.42 "cd /opt/nebachiv/app && git pull origin main"

# 6. Копіюємо медіа на сервер якщо потрібно
if [ "$MEDIA" = true ]; then
    echo "📤 Завантажую медіа на сервер..."
    while IFS= read -r filepath; do
        if [ -f "$filepath" ]; then
            ssh root@49.12.74.42 "mkdir -p /opt/nebachiv/app/$(dirname "$filepath")"
            scp "$filepath" "root@49.12.74.42:/opt/nebachiv/app/$filepath"
        fi
    done < used-assets.txt
fi

# 7. Копіюємо build
echo "📦 Копіюю build..."
rsync -avz --delete .next/ root@49.12.74.42:/opt/nebachiv/app/.next/

# 8. Restart
echo "♻️  Restart PM2..."
ssh root@49.12.74.42 "cd /opt/nebachiv/app && npm ci --only=production && pm2 restart nebachiv"

echo "✅ Deployment завершено!"
echo "🌐 Сайт: http://49.12.74.42:3205"
```

### 6. `.gitignore` - оновлений
```
# Dependencies
node_modules/

# Build
.next/
out/

# Media (великі файли)
public/videos_bg/
public/marketing_data/photos*/
public/marketing_data/*.mov
public/marketing_data/*.mp4
*.png
*.jpg
*.jpeg

# Але дозволяємо маленькі лого
!public/marketing_data/logos/*.png

# Env
.env
.env.local
.env.production

# Logs
*.log

# OS
.DS_Store
```

## 📋 ПОРЯДОК ВИКОНАННЯ

### Перший раз (повне очищення):
```bash
# В neb-hetzner директорії:
1. ./clean-local.sh      # Очистити локально
2. ./clean-server.sh     # Очистити сервер  
3. ./copy-assets.sh      # Копіювати медіа з робочого
4. ./deploy.sh --media   # Повний деплой з медіа
```

### Наступні рази (тільки код):
```bash
./deploy.sh              # Швидкий деплой без медіа
```

### Якщо змінились медіа:
```bash
./deploy.sh --media      # Деплой з оновленими медіа
```

## ⚠️ ВАЖЛИВО

1. **ВСІ команди виконуються з `/Users/chyngys/scripts/neb-hetzner/`**
2. **НЕ з робочого проекту!**
3. **used-assets.txt** контролює які медіа копіювати
4. **Git містить тільки код**, медіа йдуть через scp/rsync
5. **Build робиться локально** (на сервері мало RAM)

## 🔧 TODO (наступні кроки)
- [ ] Налаштувати Nginx reverse proxy
- [ ] Додати Basic Auth для захисту
- [ ] SSL сертифікат (Let's Encrypt)
- [ ] Перевірити PostgreSQL authentication
- [ ] Production mode в PM2

---
Створено: 29.08.2025
Статус: ЧЕКАЄ НА ВИКОНАННЯ