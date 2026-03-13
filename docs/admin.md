# Admin — Панель управления Khujand Taxi

## Стек

- **Vite 7** — сборщик
- **React 19** — UI-библиотека
- **TypeScript 5** — типизация
- **Tailwind CSS 4** — стили
- **React Router 7** — маршрутизация
- **Lucide React** — иконки

## Структура

```
admin/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── src/
    ├── main.tsx                 # Точка входа + BrowserRouter
    ├── App.tsx                  # Роутинг страниц
    ├── index.css                # Tailwind + CSS-переменные
    ├── components/
    │   └── layout/
    │       └── sidebar.tsx      # Боковое меню навигации
    ├── pages/
    │   ├── dashboard.tsx        # Дашборд
    │   ├── orders.tsx           # Заказы
    │   ├── drivers.tsx          # Водители
    │   ├── clients.tsx          # Клиенты
    │   ├── fleet.tsx            # Автопарк
    │   ├── tariffs.tsx          # Тарифы
    │   ├── promos.tsx           # Промокоды
    │   ├── reports.tsx          # Отчёты
    │   ├── map.tsx              # Карта
    │   └── settings.tsx         # Настройки
    └── lib/
        └── utils.ts             # Утилиты (cn)
```

## Установка и запуск

### 1. Перейти в папку админки

```bash
cd admin
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Запустить в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: **http://localhost:5173**

### 4. Сборка для продакшена

```bash
npm run build
npm run preview
```

## Доступные скрипты

| Команда           | Описание                          |
|-------------------|-----------------------------------|
| `npm run dev`     | Запуск dev-сервера (порт 5173)    |
| `npm run build`   | Сборка продакшен-версии           |
| `npm run preview` | Предпросмотр собранной версии     |
| `npm run lint`    | Проверка кода (ESLint)            |

## Пункты меню сайдбара

| Пункт      | Путь        | Иконка         | Описание                          |
|------------|-------------|----------------|-----------------------------------|
| Дашборд    | `/`         | LayoutDashboard| Статистика и обзор системы        |
| Заказы     | `/orders`   | ClipboardList  | Список и управление заказами      |
| Водители   | `/drivers`  | UserCheck      | Управление водителями             |
| Клиенты    | `/clients`  | Users          | Управление клиентами              |
| Автопарк   | `/fleet`    | Car            | Управление автопарком             |
| Тарифы     | `/tariffs`  | Banknote       | Управление тарифами               |
| Промокоды  | `/promos`   | Ticket         | Управление промокодами            |
| Отчёты     | `/reports`  | BarChart3      | Отчёты и аналитика                |
| Карта      | `/map`      | Map            | Карта с водителями в реал-тайме   |
| Настройки  | `/settings` | Settings       | Настройки системы                 |

## Требования

- **Node.js 18+**
- **npm**

## Порты

| Сервис    | Порт |
|-----------|------|
| Admin     | 5173 |
| Frontend  | 3000 |
| Backend   | 8000 |
