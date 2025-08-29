# 📋 PROJECT PLAN: DEPLOYMENT_AUTOMATION

## 🎯 Project Phases

### Phase 1: Analysis & Preparation  
- [x] Знайти використовувані медіа файли в коді (grep аналіз)
- [ ] Створити used-assets.txt з переліком файлів
- [ ] Створити .gitignore для великих файлів
- [ ] Очистити локальний проект від старих файлів

### Phase 2: Scripts Creation
- [ ] Створити copy-assets.sh (копіювання з робочого проекту)
- [ ] Створити clean-local.sh (очищення локального проекту)
- [ ] Створити clean-server.sh (очищення сервера)
- [ ] Створити головний deploy.sh (--media і звичайний режим)

### Phase 3: Local Testing
- [ ] Протестувати copy-assets.sh локально
- [ ] Перевірити що копіюються тільки потрібні файли
- [ ] Протестувати local build після копіювання
- [ ] Перевірити що build працює без 404 помилок

### Phase 4: Server Deployment
- [ ] Очистити сервер від старих файлів
- [ ] Протестувати ./deploy.sh --media (повний деплой)
- [ ] Перевірити що сайт працює без 404 помилок
- [ ] Протестувати ./deploy.sh (швидкий деплой тільки коду)

### Phase 5: Infrastructure Setup
- [ ] Налаштувати Nginx reverse proxy (80 → 3205)
- [ ] Додати Basic Authentication для захисту
- [ ] Створити SSL сертифікат (Let's Encrypt)
- [ ] Перевірити PostgreSQL authentication для логіну

## 📅 Timeline
- **Start Date**: 2025-08-29
- **Target Completion**: TBD
- **Actual Completion**: TBD

## 🎯 Current Sprint Tasks
- [ ] Створити used-assets.txt (Phase 1)
- [ ] Створити copy-assets.sh скрипт (Phase 2)
- [ ] Протестувати локальне копіювання (Phase 3)

## 🔄 Next Actions  
*Оновлено: 2025-08-29*
- [ ] Створити used-assets.txt з аналізу коду
- [ ] Написати copy-assets.sh скрипт
- [ ] Протестувати що копіюються тільки потрібні файли (~50MB)
