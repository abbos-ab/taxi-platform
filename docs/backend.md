# Backend — TURB TAXI API

## Стек

- **Python 3.13+**
- **FastAPI** — веб-фреймворк
- **Uvicorn** — ASGI-сервер
- **Pydantic** — валидация данных и настройки

## Зависимости

Все зависимости указаны в файле `backend/requirements.txt`:

| Пакет              | Версия   | Назначение                              |
|--------------------|----------|-----------------------------------------|
| `fastapi`          | >=0.115  | Веб-фреймворк для API                   |
| `uvicorn`          | >=0.34   | ASGI-сервер для запуска FastAPI          |
| `pydantic`         | >=2.0    | Валидация данных, модели запросов/ответов |
| `pydantic-settings`| >=2.0    | Загрузка настроек из `.env` файла        |
| `sqlalchemy`       | >=2.0    | ORM для работы с базой данных            |
| `python-dotenv`    | >=1.0    | Чтение переменных окружения из `.env`    |

## Структура

```
backend/
├── requirements.txt         # Файл зависимостей
└── app/
    ├── main.py              # Точка входа FastAPI
    ├── .env                 # Переменные окружения
    ├── api/
    │   └── fare.py          # POST /fare/quote
    ├── core/
    │   └── config.py        # Загрузка настроек из .env
    ├── domain/
    │   ├── enums.py         # TariffType, WeatherType
    │   └── pricing.py       # Логика расчёта цен
    ├── services/
    │   └── fare_service.py  # Бизнес-логика расчёта тарифа
    ├── schemas/
    │   └── fare.py          # Pydantic-модели запроса/ответа
    ├── models/              # (зарезервировано для ORM-моделей)
    ├── repositories/        # (зарезервировано для работы с БД)
    ├── db/
    │   └── base.py          # (заготовка для подключения к БД)
    └── utils/
```

## Установка и запуск

### 1. Перейти в папку бэкенда

```bash
cd backend
```

### 2. Создать виртуальное окружение (рекомендуется)

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Установить зависимости

```bash
pip install -r requirements.txt
```

### 4. Проверить файл `.env`

Файл `backend/app/.env` уже содержит настройки по умолчанию:

```env
APP_NAME=TURB TAXI API
APP_ENV=development
DATABASE_URL=sqlite:///./taxi.db
DEFAULT_CITY=Khujand
DEFAULT_COUNTRY=Tajikistan
DEFAULT_CURRENCY=TJS
MIN_FARE=8
PER_KM_RATE=1.5
DELAY_MINUTE_RATE=0.2
WEATHER_CLEAR_EXTRA=0
WEATHER_RAIN_EXTRA=0.5
WEATHER_SNOW_EXTRA=1.0
```

При необходимости измените значения под свои нужды.

### 5. Запустить сервер

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Сервер будет доступен по адресу: **http://localhost:8000**

## API-эндпоинты

| Метод | Путь          | Описание                     |
|-------|---------------|------------------------------|
| GET   | `/`           | Проверка работоспособности   |
| POST  | `/fare/quote` | Расчёт стоимости поездки     |

### Пример запроса `POST /fare/quote`

```json
{
  "origin": [40.2833, 69.6222],
  "destination": [40.2900, 69.6300],
  "distance_km": 3.5,
  "delay_minutes": 5,
  "weather": "clear",
  "tariff": "economy"
}
```

### Пример ответа

```json
{
  "city": "Khujand",
  "currency": "TJS",
  "final_price": 8.25
}
```

## Тарифы

| Тариф    | Мин. цена (TJS) | За км (TJS) | За мин. ожидания (TJS) |
|----------|------------------|-------------|------------------------|
| Economy  | 8                | 1.5         | 0.2                    |
| Comfort  | 10               | 2.0         | 0.25                   |
| Business | 14               | 3.0         | 0.35                   |

## Формула расчёта

```
итоговая_цена = max(мин_цена, расстояние * тариф_за_км + ожидание * тариф_за_мин + надбавка_за_погоду)
```
