---
name: taxi-app
description: "Full-stack taxi app skill: Django+DRF backend, Socket.IO realtime, React Native CLI mobile (passenger+driver), React admin panel. USE THIS SKILL for any taxi project task: scaffold modules/screens/endpoints, Django models/serializers/views/services, React Native screens/navigation, admin pages, Socket.IO events, ride lifecycle, GPS tracking, chat, push, pricing, Docker, tests. Triggers: taxi, ride, поездка, driver, водитель, пассажир, заказ, GPS, трекинг, чат, chat, Socket.IO, тариф, pricing, админка, admin, OSRM, маршрут, OTP, FCM, push. Always read before coding — contains exact architecture, conventions, folder structure, patterns."
---

# Taxi App — Full-Stack Development Skill

## Overview

Monorepo taxi application for the Tajikistan market. Russian-language UI. The project consists of 4 parts:

| Part | Stack | Location |
|------|-------|----------|
| Backend API | Django 5 + DRF 3.15 + PostgreSQL 16 + PostGIS + Celery + Redis | `backend/` |
| Realtime Service | Node.js 20 + Socket.IO 4 + Express + Redis | `realtime/` |
| Passenger App | React Native CLI + Zustand + React Query | `mobile/passenger-app/` |
| Driver App | React Native CLI + Zustand + React Query | `mobile/driver-app/` |
| Admin Panel | React 18 + Vite + Ant Design 5 + Zustand | `admin-panel/` |

Before writing any code, read the relevant reference file:
- Backend tasks → read `references/backend.md`
- Mobile tasks → read `references/mobile.md`
- Admin panel tasks → read `references/admin.md`
- Realtime tasks → read `references/realtime.md`

## Monorepo Structure

```
taxi-app/
├── backend/                    # Django + DRF
│   ├── config/                 # settings.py, urls.py, celery.py, wsgi.py
│   ├── apps/
│   │   ├── accounts/           # регистрация, JWT, профили, роли
│   │   ├── rides/              # создание, статусы, история, оценки
│   │   ├── drivers/            # профиль, документы, авто, онлайн-статус
│   │   ├── geo/                # PostGIS, OSRM, геокодинг
│   │   ├── chat/               # сообщения по поездкам
│   │   ├── notifications/      # FCM push, SMS, шаблоны
│   │   ├── pricing/            # тарифы, зоны, сурж
│   │   └── dashboard/          # статистика для админки
│   ├── core/                   # BaseModel, permissions, mixins, utils
│   ├── requirements/
│   │   ├── base.txt
│   │   ├── dev.txt
│   │   └── prod.txt
│   └── manage.py
├── realtime/                   # Node.js + Socket.IO
│   ├── src/
│   │   ├── index.js            # entry point
│   │   ├── namespaces/         # /tracking, /chat, /rides
│   │   ├── middleware/         # auth.js, rate-limit.js
│   │   └── services/          # redis.js, django-api.js
│   ├── package.json
│   └── .env.example
├── mobile/
│   ├── passenger-app/          # React Native CLI
│   │   └── src/
│   │       ├── screens/        # per-screen folders
│   │       ├── components/     # shared UI
│   │       ├── navigation/     # stacks, tabs
│   │       ├── store/          # zustand stores
│   │       ├── api/            # axios + react-query
│   │       ├── hooks/          # custom hooks
│   │       ├── utils/          # formatters, validators
│   │       ├── constants/      # colors, config
│   │       └── i18n/           # translations (ru)
│   └── driver-app/             # same structure
├── admin-panel/                # React + Vite
│   └── src/
│       ├── pages/              # page components
│       ├── components/         # shared components
│       ├── store/              # zustand
│       ├── api/                # axios + react-query
│       ├── hooks/
│       ├── utils/
│       └── constants/
└── docs/                       # architecture, API docs
```

## Backend Modules (Django Apps)

Each module is a standalone Django app in `apps/`. Every module follows this internal structure:

```
apps/<module>/
├── models/
│   ├── __init__.py             # re-export all models
│   └── <entity>.py             # one file per model
├── serializers/
│   ├── __init__.py
│   └── <entity>.py
├── views/
│   ├── __init__.py
│   └── <entity>.py
├── urls.py                     # module routes
├── services.py                 # business logic (fat services, thin views)
├── selectors.py                # complex DB queries
├── permissions.py              # DRF permission classes
├── signals.py                  # Django signals
├── tasks.py                    # Celery tasks
├── admin.py                    # Django Admin config
├── tests/
│   ├── test_models.py
│   ├── test_views.py
│   ├── test_services.py
│   └── factories.py            # factory_boy
└── migrations/
```

The core principle: **fat services, thin views**. Views only handle request parsing and response formatting. All business logic lives in `services.py`. Complex queries live in `selectors.py`.

## Module Responsibilities

| Module | App name | Scope |
|--------|----------|-------|
| Accounts | `apps.accounts` | Phone + OTP registration, JWT (SimpleJWT), profiles, roles (passenger/driver/admin) |
| Rides | `apps.rides` | Create ride, assign driver, status machine, history, ratings |
| Drivers | `apps.drivers` | Driver profile, documents, vehicle, online/offline status |
| Geo | `apps.geo` | PostGIS queries, geocoding (Nominatim), routes (OSRM), ETA |
| Chat | `apps.chat` | Messages per ride, history |
| Notifications | `apps.notifications` | FCM push, SMS (local provider), templates, delivery logs |
| Pricing | `apps.pricing` | Fare calculation, tariff zones, surge pricing |
| Dashboard | `apps.dashboard` | Analytics, reports for admin panel |

## Ride Lifecycle (State Machine)

```
SEARCHING → ACCEPTED → ARRIVED → IN_PROGRESS → COMPLETED
    ↓           ↓          ↓
 CANCELLED   CANCELLED  CANCELLED
```

Status codes and transitions:
- `SEARCHING` — passenger created ride, looking for driver
- `ACCEPTED` — driver accepted → triggers: notify passenger, start GPS tracking
- `ARRIVED` — driver at pickup → triggers: notify passenger
- `IN_PROGRESS` — trip started → triggers: start metering
- `COMPLETED` — arrived at destination → triggers: calculate final price, prompt rating
- `CANCELLED` — cancelled by either party → triggers: notify other party, log reason

Always validate state transitions in `rides/services.py`. Never allow skipping states.

## Key Conventions

### Python / Django
- Python 3.12+, Django 5.x, DRF 3.15
- Use `core.models.BaseModel` (provides `id` as UUID, `created_at`, `updated_at`)
- Auth: SimpleJWT with phone number as username field
- All phone numbers: string, format `+992XXXXXXXXX`
- API prefix: `/api/v1/`
- Use `drf-spectacular` for OpenAPI docs at `/api/docs/`
- Celery for async tasks (SMS sending, push, analytics aggregation)
- Tests: `pytest` + `factory_boy` + `pytest-django`
- Settings split: `config/settings/base.py`, `dev.py`, `prod.py`

### React Native (Mobile)
- React Native CLI (no Expo), version 0.74+
- Navigation: React Navigation 6 (native stack + bottom tabs)
- State: Zustand (separate stores: `useAuthStore`, `useRideStore`, `useLocationStore`)
- API: Axios + React Query (`@tanstack/react-query`)
- Maps: `react-native-maps` with OpenStreetMap tiles (UrlTile)
- Geolocation: `@react-native-community/geolocation` + background tracking for driver
- WebSocket: `socket.io-client` 4.x
- Push: `@react-native-firebase/messaging`
- Storage: `react-native-mmkv` for tokens
- UI language: Russian only (hardcoded strings in `i18n/ru.ts`)

### React (Admin Panel)
- React 18 + Vite + TypeScript
- UI: Ant Design 5 (`antd`)
- State: Zustand
- API: Axios + React Query
- Maps: `react-leaflet` + OpenStreetMap
- Charts: `recharts` or Ant Design Charts
- Routing: `react-router-dom` v6 with auth guards

### Socket.IO (Realtime)
- Node.js 20 LTS + Socket.IO 4.x
- Three namespaces: `/tracking`, `/chat`, `/rides`
- Auth: JWT token verification via middleware (calls Django API)
- Redis adapter for horizontal scaling
- Driver locations stored in Redis GEO sets

## API Endpoints Summary

See `references/backend.md` for full endpoint list with request/response schemas.

Key groups:
- `POST /api/v1/auth/register/` — phone registration
- `POST /api/v1/auth/verify-otp/` — OTP verification
- `POST /api/v1/auth/token/` — get JWT
- `GET/PUT /api/v1/profile/` — user profile
- `POST /api/v1/rides/` — create ride
- `POST /api/v1/rides/{id}/accept/` — driver accepts
- `POST /api/v1/rides/{id}/complete/` — complete ride
- `GET /api/v1/rides/` — ride history
- `GET /api/v1/drivers/nearby/` — nearest drivers (PostGIS)
- `POST /api/v1/drivers/go-online/` — driver goes online
- `GET /api/v1/chat/{ride_id}/` — chat history
- `POST /api/v1/notifications/register-device/` — FCM token

## Socket.IO Events Summary

See `references/realtime.md` for full event list with payloads.

Key events:
- `driver:location` (client→server) — `{ lat, lng, heading, speed }`
- `ride:new` (server→driver) — `{ ride_id, pickup, dropoff, price }`
- `ride:accepted` (server→passenger) — `{ ride_id, driver, car, eta }`
- `message:send` (client→server) — `{ ride_id, text }`
- `message:received` (server→client) — `{ id, sender, text, timestamp }`

## Infrastructure

| Service | Technology | Port |
|---------|-----------|------|
| Django API | Gunicorn + Nginx | 8000 → 80/443 |
| Socket.IO | Node.js + PM2 | 3001 |
| PostgreSQL | PostgreSQL 16 + PostGIS | 5432 |
| Redis | Redis 7 | 6379 |
| Celery Worker | Celery + Redis broker | — |
| Celery Beat | Periodic tasks | — |
| OSRM | Open Source Routing Machine | 5000 |
| Nginx | Reverse proxy + SSL (Let's Encrypt) | 80, 443 |

## Workflow for Claude Code

When the user asks to implement something:

1. **Identify which part** of the monorepo is affected (backend / realtime / mobile / admin)
2. **Read the relevant reference file** from `references/`
3. **Follow the module structure** — don't create files outside the defined pattern
4. **Use services pattern** — business logic in services.py, not in views
5. **Follow naming conventions** — Russian comments for business logic, English for code
6. **Always create tests** alongside the implementation
7. **Validate state transitions** for any ride-related changes
8. **Use PostGIS** for any geo queries (never raw lat/lng math)
