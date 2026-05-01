# 🚀 AlmaTour - Quick Start Checklist

## Перед началом

- [ ] Python 3.8+ установлен
- [ ] Git установлен
- [ ] Текстовый редактор/IDE установлен
- [ ] Доступ к Neon базе данных

---

## 📦 Подготовка окружения

### Шаг 1: Установка зависимостей (Windows PowerShell)

```powershell
# Создать виртуальное окружение (опционально)
python -m venv venv
./venv/Scripts/Activate.ps1

# Установить требуемые модули для миграции
pip install requests
```

### Шаг 2: Проверка файлов

Убедитесь что все эти файлы существуют:

```
AlmaTourRep/
├── src/
│   ├── config.js          ✅ (создан)
│   ├── auth.js            ✅ (обновлен)
│   ├── auth.html          ✅ (обновлен)
│   ├── tours_api.js       ✅ (создан)
│   ├── tours.html         ✅ (обновлена)
│   ├── profile.js         ✅ (обновлен)
│   ├── profile.html       ✅ (обновлена)
│   ├── booking.js         ✅ (обновлен)
│   ├── booking.html       ✅ (обновлена)
│   ├── payment.html       ✅ (обновлена)
│   ├── tour_detail.html   ✅ (обновлена)
│   ├── index.html         ✅ (обновлена)
│   └── almatour.db        ✅ (существует)
├── migrate_to_neon.py      ✅ (создан)
├── requirements_migration.txt ✅ (создан)
├── BACKEND_INTEGRATION.md  ✅ (создан)
├── MIGRATION_SUMMARY.md    ✅ (создан)
└── COMPLETION_REPORT.md    ✅ (создан)
```

---

## 🔄 Запуск миграции

### Шаг 3: Запуск FastAPI бэкенда

Убедитесь что у вас есть FastAPI приложение по спецификации в `docs/swagger.json`

```powershell
# Если основной бэкенд находится в другом месте:
cd /path/to/backend
python -m uvicorn main:app --reload

# Вывод должен показать:
# Uvicorn running on http://127.0.0.1:8000
```

**Проверка здоровья бэкенда:**
```powershell
curl http://localhost:8000/health
# Ожидается: 200 OK
```

### Шаг 4: Выполнение миграции

```powershell
# В директории AlmaTourRep
python migrate_to_neon.py

# Ожидаемый вывод:
# ✅ Connected to local database
# ✅ Admin authenticated
# ✅ Tour created: Shymbulak Mountain Tour (ID: 1)
# ... (5 туров всего)
# ✅ Migration complete!
```

**Если возникли ошибки:**

| Ошибка | Решение |
|--------|---------|
| `Connection refused` | Убедитесь бэкенд запущен на 8000 |
| `File not found: almatour.db` | Скрипт должен запускаться из папки с БД |
| `Invalid credentials` | Проверьте семена учетных записей на бэкенде |
| `Network timeout` | Проверьте подключение к интернету |

---

## 🌐 Проверка фронтенда

### Шаг 5: Открыть приложение

```powershell
# В браузере перейти:
http://localhost:8000
```

### Шаг 6: Тестовые учетные записи

Используйте для тестирования:

| Роль | Email | Пароль |
|------|-------|--------|
| Админ | admin@almatour.kz | admin123 |
| Гид | guide@almatour.kz | guide123 |
| Турист | tourist@almatour.kz | tourist123 |

### Шаг 7: Тестирование функций

**Авторизация:**
- [ ] Откройте `/auth.html`
- [ ] Введите `tourist@almatour.kz` / `tourist123`
- [ ] Должно перенаправить на главную

**Просмотр туров:**
- [ ] Перейдите на `/tours.html`
- [ ] Должны загрузиться туры с бэкенда
- [ ] Переключение стр должно работать
- [ ] Фильтры должны работать

**Профиль:**
- [ ] Перейдите на `/profile.html`
- [ ] Должны видеть свои бронирования
- [ ] Информация профиля должна отображаться

**Бронирование:**
- [ ] Откройте любой тур и нажмите "View Details"
- [ ] Выберите дату и количество гостей
- [ ] Нажмите "Proceed to Payment"
- [ ] Должно создаться бронирование

---

## ⚙️ Конфигурация для Production

### Шаг 8: Обновление конфигурации

**Откройте `src/config.js`:**

```javascript
// Найдите эту строку:
BASE_URL: "https://your-backend-url.vercel.app",

// Обновите на ваш production URL:
// Примеры:
// BASE_URL: "https://almatour-api.vercel.app",
// BASE_URL: "https://api.almatour.kz",
// BASE_URL: "https://backend.railway.app",
```

### Шаг 9: Загрузка изображений

**Опции для управления изображениями:**

1. **AWS S3:**
   - Загрузить в S3 bucket
   - Обновить URLs в БД

2. **Cloudinary:**
   - Создать аккаунт
   - Загрузить через API

3. **Backend endpoint:**
   - Создать GET endpoint для изображений
   - Сохранять в `static/` папке

**Текущая настройка:**
```javascript
// Локально использует:
<img src="/images/kolsay.jpg">
// Сервируется из src/assets/
```

---

## 🧪 Debugging

### Включить ConsoleLogging

```javascript
// В config.js раскомментировать для debug:
// console.log('API Request:', url);
// console.log('API Response:', data);
```

### Проверить Network в браузере

```
F12 → Network (вкладка)
- Проверить запросы к /tours
- Проверить /auth/login
- Проверить статус кодов (200, 401, 500)
- Проверить Response body
```

### Проверить localStorage

```javascript
// В консоли браузера:
localStorage.getItem('almatour_token')  // Должен быть JWT
localStorage.getItem('almatour_user')   // Должен быть JSON пользователя
```

### Общие проблемы

**Страница туров пуста:**
```javascript
// Консоль браузера (F12):
api.listTours().then(r => console.log(r))  // Проверить ответ
```

**Не авторизуется:**
```javascript
// Проверить:
localStorage.clear()  // Очистить все
// И заново логиниться
```

**CORS ошибка:**
```
Error: No 'Access-Control-Allow-Origin' header

// Решение: Убедитесь бэкенд имеет CORS middleware
```

---

## 📋 Финальный чеклист перед Production

- [ ] Миграция выполнена успешно
- [ ] Все туры видны на странице tours.html
- [ ] Авторизация работает
- [ ] Бронирования сохраняются в БД
- [ ] Изображения загружены на CDN/storage
- [ ] config.js обновлен на production URL
- [ ] HTTPS настроен
- [ ] CORS правильно настроен
- [ ] Email подтверждение работает (если требуется)
- [ ] Error handling реализован
- [ ] Loading states добавлены
- [ ] Tested на всех браузерах

---

## 📞 Support

Если возникают проблемы:

1. **Прочитайте документацию:**
   - `BACKEND_INTEGRATION.md` - техническая подробность
   - `MIGRATION_SUMMARY.md` - обзор изменений
   - `COMPLETION_REPORT.md` - результаты работы

2. **Проверьте логи:**
   - Backend: `python -m uvicorn main:app --reload` output
   - Frontend: Браузер F12 → Console, Network

3. **Типичные решения:**
   - Очистить localStorage: `localStorage.clear()`
   - Перезагрузить страницу: `Ctrl+Shift+Backspace`
   - Перезапустить бэкенд
   - Проверить интернет соединение

---

## ✅ Готово!

После завершения этого чеклиста ваше приложение должно быть:

✅ Мигрировано на облачную БД  
✅ Подключено к REST API  
✅ Готово к масштабированию  
✅ Безопасно (JWT токены)  
✅ Готово к production deployment  

---

**Версия:** 2.0.0  
**Дата:** 2026-05-01  
**Время выполнения:** ~5-10 минут  

**Давайте начнём! 🚀**

