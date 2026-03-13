# Admin Panel Reference — React + Vite + Ant Design

## Table of Contents
1. [Project Setup](#project-setup)
2. [Folder Structure](#folder-structure)
3. [Routing & Auth Guards](#routing--auth-guards)
4. [API Layer](#api-layer)
5. [Pages](#pages)
6. [Layout](#layout)
7. [Key Components](#key-components)

---

## Project Setup

```bash
npm create vite@latest admin-panel -- --template react-ts
cd admin-panel
npm install antd @ant-design/icons @ant-design/charts
npm install zustand @tanstack/react-query axios
npm install react-router-dom
npm install react-leaflet leaflet @types/leaflet
npm install recharts
npm install dayjs
```

---

## Folder Structure

```
src/
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── rides/
│   │   ├── RidesListPage.tsx
│   │   └── RideDetailPage.tsx
│   ├── drivers/
│   │   ├── DriversListPage.tsx
│   │   └── DriverDetailPage.tsx
│   ├── passengers/
│   │   └── PassengersListPage.tsx
│   ├── pricing/
│   │   └── PricingPage.tsx
│   ├── live-map/
│   │   └── LiveMapPage.tsx
│   ├── reports/
│   │   └── ReportsPage.tsx
│   └── settings/
│       └── SettingsPage.tsx
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx          # Sidebar + Header + Content
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── common/
│   │   ├── StatusBadge.tsx
│   │   ├── UserAvatar.tsx
│   │   └── StatCard.tsx
│   ├── maps/
│   │   ├── LiveMap.tsx            # Leaflet + driver markers
│   │   └── RideRouteMap.tsx
│   └── charts/
│       ├── RidesChart.tsx
│       └── RevenueChart.tsx
├── store/
│   ├── useAuthStore.ts
│   └── useAppStore.ts
├── api/
│   ├── client.ts                  # Axios instance
│   ├── auth.ts
│   ├── rides.ts
│   ├── drivers.ts
│   ├── passengers.ts
│   ├── pricing.ts
│   ├── dashboard.ts
│   └── hooks/                     # React Query hooks
│       ├── useDashboard.ts
│       ├── useRides.ts
│       └── useDrivers.ts
├── hooks/
│   └── useSocket.ts               # Socket.IO for live map
├── utils/
│   ├── formatters.ts
│   └── constants.ts
├── types/
│   ├── api.ts
│   ├── ride.ts
│   ├── user.ts
│   └── driver.ts
├── App.tsx
├── router.tsx
└── main.tsx
```

---

## Routing & Auth Guards

```typescript
// router.tsx
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

const ProtectedRoute = () => {
  const isAuth = useAuthStore(s => s.isAuthenticated);
  return isAuth ? <AppLayout><Outlet /></AppLayout> : <Navigate to="/login" />;
};

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Navigate to="/dashboard" /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'rides', element: <RidesListPage /> },
      { path: 'rides/:id', element: <RideDetailPage /> },
      { path: 'drivers', element: <DriversListPage /> },
      { path: 'drivers/:id', element: <DriverDetailPage /> },
      { path: 'passengers', element: <PassengersListPage /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'live-map', element: <LiveMapPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
```

---

## API Layer

```typescript
// api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
```

---

## Pages

### Dashboard

Displays key metrics. Uses cards + charts + mini live map.

```typescript
// pages/DashboardPage.tsx structure:
// - Row of StatCards: Активные поездки, Водителей онлайн, Поездок сегодня, Выручка сегодня
// - Row: RidesChart (last 7 days) + RevenueChart (last 7 days)
// - Mini LiveMap (last 10 active drivers)
// - Recent rides table (last 10)
```

Stats endpoint: `GET /api/v1/dashboard/stats/`
```json
{
  "active_rides": 23,
  "online_drivers": 45,
  "today_rides": 312,
  "today_revenue": "15600.00",
  "rides_chart": [
    { "date": "2026-03-07", "count": 280 },
    { "date": "2026-03-08", "count": 310 }
  ],
  "revenue_chart": [
    { "date": "2026-03-07", "amount": "14200.00" },
    { "date": "2026-03-08", "amount": "15600.00" }
  ]
}
```

### Rides List

Ant Design `Table` with filters.

| Column | Type | Filter |
|--------|------|--------|
| ID | UUID (short) | — |
| Пассажир | name + phone | Search |
| Водитель | name + phone | Search |
| Откуда | address | — |
| Куда | address | — |
| Статус | StatusBadge | Select |
| Цена | decimal | Range |
| Дата | datetime | DateRange |

Endpoint: `GET /api/v1/dashboard/rides/?status=completed&page=1`

### Drivers List

| Column | Filter |
|--------|--------|
| ФИО | Search |
| Телефон | Search |
| Статус | Online/Offline/All |
| Верифицирован | Yes/No/All |
| Рейтинг | Range |
| Поездок | — |
| Действия | Verify / Block |

### Live Map

Full-screen Leaflet map showing all online drivers in real-time via Socket.IO `/tracking` namespace.

```typescript
// Socket connection for admin live map
const socket = io(SOCKET_URL + '/tracking', {
  auth: { token: adminToken },
  transports: ['websocket'],
});

socket.on('drivers:nearby', (drivers) => {
  setMarkers(drivers.map(d => ({
    id: d.id,
    position: [d.lat, d.lng],
    popup: `${d.name} — ${d.car}`,
  })));
});
```

### Pricing

Form for managing tariffs using Ant Design Form:

```typescript
// Fields per tariff:
// - name: string (Стандарт, Комфорт)
// - base_fare: number (сомони)
// - per_km: number
// - per_min: number
// - min_fare: number
// - is_active: boolean
```

---

## Layout

```typescript
// components/layout/AppLayout.tsx
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined, CarOutlined, UserOutlined,
  TeamOutlined, DollarOutlined, EnvironmentOutlined,
  BarChartOutlined, SettingOutlined
} from '@ant-design/icons';

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Дашборд' },
  { key: 'rides', icon: <CarOutlined />, label: 'Поездки' },
  { key: 'drivers', icon: <UserOutlined />, label: 'Водители' },
  { key: 'passengers', icon: <TeamOutlined />, label: 'Пассажиры' },
  { key: 'pricing', icon: <DollarOutlined />, label: 'Тарифы' },
  { key: 'live-map', icon: <EnvironmentOutlined />, label: 'Live карта' },
  { key: 'reports', icon: <BarChartOutlined />, label: 'Отчёты' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Настройки' },
];
```

---

## Key Components

### StatCard

```tsx
// components/common/StatCard.tsx
import { Card, Statistic } from 'antd';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, prefix, suffix, color }) => (
  <Card>
    <Statistic title={title} value={value} prefix={prefix} suffix={suffix}
      valueStyle={{ color }} />
  </Card>
);
```

### StatusBadge

```tsx
// components/common/StatusBadge.tsx
import { Tag } from 'antd';

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  searching: { color: 'blue', label: 'Поиск' },
  accepted: { color: 'cyan', label: 'Принят' },
  arrived: { color: 'purple', label: 'На месте' },
  in_progress: { color: 'orange', label: 'В пути' },
  completed: { color: 'green', label: 'Завершён' },
  cancelled: { color: 'red', label: 'Отменён' },
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { color, label } = STATUS_MAP[status] || { color: 'default', label: status };
  return <Tag color={color}>{label}</Tag>;
};
```
