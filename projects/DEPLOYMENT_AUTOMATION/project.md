# 🎯 PROJECT: DEPLOYMENT_AUTOMATION

## 📊 Metadata
- **Status**: 🔴 Active
- **Priority**: Critical
- **Created**: 2025-08-29
- **Updated**: 2025-08-29
- **Branch**: feature/deployment-automation

## 🎯 Problem Statement
Створити швидкий та надійний процес деплойменту Nebachiv на Hetzner сервер. Поточна проблема: великі медіа файли (2.6GB) не можуть йти через Git, ручний процес деплойменту, відсутність автоматизації.

## 🎯 Project Goals
- [ ] Створити список використовуваних медіа файлів (used-assets.txt)
- [ ] Створити скрипти автоматизації (copy-assets.sh, deploy.sh, clean-*.sh)
- [ ] Налаштувати селективне копіювання (50MB замість 2.6GB)
- [ ] Налаштувати Nginx reverse proxy з Basic Auth
- [ ] Створити SSL сертифікати
- [ ] Перевірити PostgreSQL authentication

## 🔗 Dependencies
- **Blocking**: None
- **Blocked by**: None  
- **Related**: DEPLOYMENT_PLAN.md, робочий проект neb-content-appv2

## 📊 Success Metrics
- [ ] Деплоймент займає <5 хвилин замість годин
- [ ] Трафік скорочений до 50MB замість 2.6GB  
- [ ] Сайт доступний через https з basic auth
- [ ] PostgreSQL login працює коректно
- [ ] Нуль 404 помилок для статичних файлів

## 🧠 Context & Background
- Поточний стан: сайт працює на http://49.12.74.42:3205 з багатьма 404 помилками
- Медіа файли в /public/videos_bg (211MB) + /marketing_data (2.4GB) 
- Тільки ~10 файлів реально використовуються в коді
- Потрібна швидка система для оновлень

## ⚖️ Trade-offs & Decisions
- **Git vs rsync**: Git для коду, rsync для медіа (швидша синхронізація)
- **Local build vs Server build**: Local build (сервер має мало RAM)
- **Селективне копіювання**: used-assets.txt замість повного public/

## 🚨 Risks & Mitigation
- **Risk 1**: Пропустити критичні медіа файли → Перевірити всі src="/..." в коді
- **Risk 2**: Зламати існуючі функції → Тестувати кожен крок локально спочатку
- **Risk 3**: SSH доступ втратити → Мати backup план відновлення

---
*Project created on 2025-08-29*
