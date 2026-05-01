# AlmaTour - Backend Integration Setup Guide

## 📋 Overview

Этот документ описывает процесс миграции данных локальной SQLite базы в удаленную PostgreSQL базу на Neon и переподключение фронтенда для работы с бэкенд API.

## 🔗 Backend URL

**Neon Database Connection:**
```
postgresql://neondb_owner:npg_RYUA5FsG2Luj@ep-noisy-dust-alwalayv-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 📝 Пошаговая инструкция

### Шаг 1: Настройка Backend API

1. Убедитесь, что у вас есть работающий FastAPI backend (описан в swagger.json)
2. Backend должен быть доступен по адресу `http://localhost:8000` (для разработки)
3. Для production обновите URL в `src/config.js`

**Семена учетных записей (по умолчанию):**
- Admin: `admin@almatour.kz` / `admin123`
- Guide: `guide@almatour.kz` / `guide123`
- Tourist: `tourist@almatour.kz` / `tourist123`

### Шаг 2: Установка зависимостей миграции

```bash
pip install requests
```

### Шаг 3: Выполнение миграции

1. **Запустите FastAPI backend:**
   ```bash
   python -m uvicorn main:app --reload
   ```

2. **В отдельном терминале выполните миграцию:**
   ```bash
   python migrate_to_neon.py
   ```

   Скрипт выполнит следующее:
   - ✅ Подключится к локальной SQLite базе
   - ✅ Аутентифицируется на бэкенде
   - ✅ Мигрирует все туры
   - ✅ Мигрирует бронирования

### Шаг 4: Обновление конфигурации фронтенда

**В `src/config.js`:**
- Для разработки: оставьте `BASE_URL: "http://localhost:8000"`
- Для production: обновите на ваш URL развернутого backend

Пример для Vercel deployment:
```javascript
BASE_URL: "https://your-almatour-backend.vercel.app"
```

### Шаг 5: Тестирование фронтенда

1. **Откройте приложение в браузере:**
   ```
   http://localhost:8000
   ```

2. **Попробуйте функции:**
   - Авторизация с помощью `auth.html`
   - Просмотр туров на `tours.html` (туры загружаются с бэкенда)
   - Профиль пользователя на `profile.html` (показывает бронирования с бэкенда)

## 🖼️ Изображения

Локальные изображения в `src/assets/` будут использоваться программой как `/images/{filename}`:

- `src/assets/kolsay.jpg` → `/images/kolsay.jpg`
- `src/assets/shymb.jpg` → `/images/shymb.jpg`
- и т.д.

**Позже для production:**
1. Загрузите изображения на CDN (например, AWS S3, Cloudinary)
2. Обновите URLs в тестах или используйте backend endpoint для сервирования изображений

## 🔐 Аутентификация

### Локальное хранилище JWT токена
Когда пользователь логинится:
1. Backend возвращает JWT token
2. Token сохраняется в `localStorage` под ключом `almatour_token`
3. Token автоматически добавляется в заголовок `Authorization: Bearer <token>` для всех последующих запросов

### Получение текущего пользователя
```javascript
// config.js предоставляет глобальный объект `api`
const isAuthenticated = api.isAuthenticated();
const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
```

## 📋 API Endpoints

Все доступные endpoints описаны в `docs/swagger.json`:

### Основные:
- `POST /auth/login` - Вход
- `GET /tours` - список туров
- `POST /tours` - создание тура (guide/admin)
- `POST /bookings` - создание бронирования
- `GET /bookings/me` - мои бронирования
- `PATCH /tours/{tour_id}` - обновление тура

## 🐛 Troubleshooting

### "401 Unauthorized"
- Убедитесь, что вы залогинены
- Проверьте, что token не истек
- Очистите localStorage и переавторизуйтесь

### "CORS errors"
- Backend должен быть запущен на `http://localhost:8000`
- Проверьте CORS конфигурацию в FastAPI

### "Failed to load tours"
- API недоступен (проверьте URL в config.js)
- Backend не запущен
- Проверьте консоль браузера для деталей ошибки

## 📂 Структура проекта

```
src/
├── config.js           # Конфигурация API и глобальный клиент
├── auth.js            # Аутентификация (использует API)
├── auth.html
├── tours_api.js       # Загрузка туров с бэкенда
├── tours.html
├── profile.js         # Профиль и бронирования (использует API)
├── profile.html
├── booking.js         # Бронирование
├── booking.html
└── assets/            # Локальные изображения

migrate_to_neon.py     # Миграционный скрипт
```

## 🚀 Production Deployment

1. **Deploy Backend (опции):**
   - Vercel: `vercel deploy`
   - Railway: Connect GitHub repo
   - Render: Connect GitHub repo

2. **Update config.js:**
   ```javascript
   BASE_URL: "https://your-backend-domain.com"
   ```

3. **Upload Images:**
   - AWS S3, Cloudinary, или другой CDN
   - Update tour creation to use CDN URLs

4. **Deploy Frontend:**
   - GitHub Pages, Vercel, Netlify, или другой сервис

## 📚 Дополнительная информация

### Использование миграционного скрипта
Скрипт `migrate_to_neon.py` является одноразовым инструментом для миграции существующих данных. После миграции:
- Новые туры должны создаваться через web interface или API
- Новые бронирования должны создаваться через приложение

### Структура базы данных
Schema управляется через FastAPI models (SQLAlchemy ORM). Обновления проводятся через Alembic миграции.

## ✅ Checklist для запуска

- [ ] Backend работает на `http://localhost:8000`
- [ ] Миграция выполнена успешно
- [ ] `config.js` настроена с правильным URL
- [ ] Авторизация работает
- [ ] Туры загружаются на странице Tours
- [ ] Бронирования видны в профиле

---

**Version:** 2.0.0  
**Last Updated:** 2026-05-01

