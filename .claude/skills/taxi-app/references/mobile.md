# Mobile Reference — React Native CLI

## Table of Contents
1. [Project Setup](#project-setup)
2. [Folder Structure](#folder-structure)
3. [Navigation Architecture](#navigation-architecture)
4. [Zustand Stores](#zustand-stores)
5. [API Layer](#api-layer)
6. [Socket.IO Integration](#socketio-integration)
7. [Maps & Geolocation](#maps--geolocation)
8. [Passenger App Screens](#passenger-app-screens)
9. [Driver App Screens](#driver-app-screens)
10. [Shared Components](#shared-components)

---

## Project Setup

Both apps use React Native CLI (not Expo):

```bash
npx react-native init PassengerApp --template react-native-template-typescript
npx react-native init DriverApp --template react-native-template-typescript
```

### Dependencies (both apps)

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.x",
    "@react-navigation/native-stack": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "@tanstack/react-query": "^5.x",
    "axios": "^1.x",
    "zustand": "^4.x",
    "socket.io-client": "^4.x",
    "react-native-maps": "^1.x",
    "react-native-mmkv": "^2.x",
    "@react-native-community/geolocation": "^3.x",
    "@react-native-firebase/app": "^18.x",
    "@react-native-firebase/messaging": "^18.x",
    "react-native-safe-area-context": "^4.x",
    "react-native-screens": "^3.x",
    "react-native-gesture-handler": "^2.x",
    "react-native-reanimated": "^3.x"
  }
}
```

---

## Folder Structure

Each app follows the same structure:

```
src/
├── screens/
│   ├── auth/
│   │   ├── AuthScreen.tsx
│   │   └── OTPScreen.tsx
│   ├── home/
│   │   └── HomeScreen.tsx
│   ├── ride/
│   │   ├── OrderScreen.tsx
│   │   ├── SearchingScreen.tsx
│   │   ├── RideScreen.tsx
│   │   └── RatingScreen.tsx
│   ├── history/
│   │   └── HistoryScreen.tsx
│   ├── chat/
│   │   └── ChatScreen.tsx
│   └── profile/
│       └── ProfileScreen.tsx
├── components/
│   ├── ui/                      # Button, Input, Card, etc.
│   ├── map/                     # MapView, Marker, Route
│   └── ride/                    # RideCard, DriverInfo, etc.
├── navigation/
│   ├── RootNavigator.tsx        # Auth check → AuthStack or MainStack
│   ├── AuthStack.tsx
│   ├── MainStack.tsx
│   └── TabNavigator.tsx
├── store/
│   ├── useAuthStore.ts
│   ├── useRideStore.ts
│   ├── useLocationStore.ts
│   └── useChatStore.ts
├── api/
│   ├── client.ts                # Axios instance with interceptors
│   ├── auth.ts                  # auth endpoints
│   ├── rides.ts                 # ride endpoints
│   ├── drivers.ts               # driver endpoints
│   └── hooks/                   # React Query hooks
│       ├── useAuth.ts
│       ├── useRides.ts
│       └── useProfile.ts
├── hooks/
│   ├── useSocket.ts             # Socket.IO connection
│   ├── useLocation.ts           # GPS tracking
│   └── usePushNotifications.ts
├── utils/
│   ├── formatters.ts            # price, date, phone
│   ├── validators.ts            # phone, OTP
│   └── constants.ts
├── constants/
│   ├── colors.ts
│   ├── config.ts                # API_URL, SOCKET_URL, MAP_TILE_URL
│   └── screens.ts               # screen name constants
├── i18n/
│   └── ru.ts                    # all UI strings in Russian
└── types/
    ├── api.ts                   # API response types
    ├── ride.ts                  # Ride, RideStatus
    ├── user.ts                  # User, DriverProfile
    └── navigation.ts            # navigation param types
```

---

## Navigation Architecture

### Root Navigator

```typescript
// navigation/RootNavigator.tsx
import { useAuthStore } from '../store/useAuthStore';

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
```

### Passenger App Navigation

```
AuthStack
├── AuthScreen (phone input)
└── OTPScreen (code verification)

MainStack
├── TabNavigator
│   ├── HomeTab → HomeScreen (map + search)
│   ├── HistoryTab → HistoryScreen
│   └── ProfileTab → ProfileScreen
├── OrderScreen (modal)
├── SearchingScreen (modal)
├── RideScreen (full screen)
├── ChatScreen (modal)
└── RatingScreen (modal)
```

### Driver App Navigation

```
AuthStack
├── AuthScreen
└── OTPScreen

MainStack
├── TabNavigator
│   ├── HomeTab → HomeScreen (map + online toggle)
│   ├── EarningsTab → EarningsScreen
│   ├── HistoryTab → HistoryScreen
│   └── ProfileTab → ProfileScreen
├── NewOrderScreen (modal — incoming ride)
├── NavigationScreen (navigate to passenger)
├── RideScreen (active ride)
└── ChatScreen (modal)
```

---

## Zustand Stores

### Auth Store

```typescript
// store/useAuthStore.ts
import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: storage.getString('token') || null,
  user: null,
  isAuthenticated: !!storage.getString('token'),

  setAuth: (token, user) => {
    storage.set('token', token);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    storage.delete('token');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
```

### Ride Store

```typescript
// store/useRideStore.ts
interface RideState {
  currentRide: Ride | null;
  rideStatus: RideStatus | null;
  driverLocation: { lat: number; lng: number } | null;
  setCurrentRide: (ride: Ride | null) => void;
  setRideStatus: (status: RideStatus) => void;
  setDriverLocation: (loc: { lat: number; lng: number }) => void;
  reset: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  currentRide: null,
  rideStatus: null,
  driverLocation: null,
  setCurrentRide: (ride) => set({ currentRide: ride }),
  setRideStatus: (status) => set({ rideStatus: status }),
  setDriverLocation: (loc) => set({ driverLocation: loc }),
  reset: () => set({ currentRide: null, rideStatus: null, driverLocation: null }),
}));
```

### Location Store (Driver App)

```typescript
// store/useLocationStore.ts
interface LocationState {
  currentLocation: { lat: number; lng: number } | null;
  isOnline: boolean;
  watchId: number | null;
  setLocation: (loc: { lat: number; lng: number }) => void;
  setOnline: (online: boolean) => void;
  setWatchId: (id: number | null) => void;
}
```

---

## API Layer

### Axios Client

```typescript
// api/client.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { API_URL } from '../constants/config';

const client = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT token
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → logout
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default client;
```

### React Query Hooks

```typescript
// api/hooks/useRides.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../client';

export const useCreateRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRideRequest) => client.post('/rides/', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rides'] }),
  });
};

export const useRideHistory = (page = 1) =>
  useQuery({
    queryKey: ['rides', 'history', page],
    queryFn: () => client.get('/rides/', { params: { page } }),
  });
```

---

## Socket.IO Integration

### Socket Hook

```typescript
// hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import { SOCKET_URL } from '../constants/config';

export const useSocket = (namespace: string) => {
  const socketRef = useRef<Socket | null>(null);
  const token = useAuthStore(s => s.token);

  useEffect(() => {
    if (!token) return;

    const socket = io(`${SOCKET_URL}${namespace}`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => console.log(`Connected to ${namespace}`));
    socket.on('connect_error', (err) => console.error(`Socket error: ${err.message}`));

    return () => { socket.disconnect(); };
  }, [token, namespace]);

  return socketRef;
};
```

### Usage in Ride Screen (Passenger)

```typescript
const socket = useSocket('/rides');
const trackingSocket = useSocket('/tracking');

useEffect(() => {
  const s = socket.current;
  if (!s) return;

  s.on('ride:accepted', (data) => {
    rideStore.setRideStatus('accepted');
    rideStore.setCurrentRide({ ...rideStore.currentRide, driver: data.driver });
  });

  s.on('ride:arrived', () => rideStore.setRideStatus('arrived'));
  s.on('ride:started', () => rideStore.setRideStatus('in_progress'));
  s.on('ride:completed', (data) => {
    rideStore.setRideStatus('completed');
    navigation.navigate('Rating', { rideId: data.ride_id, price: data.price });
  });

  return () => { s.removeAllListeners(); };
}, []);

// GPS tracking — водитель
useEffect(() => {
  const ts = trackingSocket.current;
  if (!ts) return;

  ts.on('driver:location:update', (data) => {
    rideStore.setDriverLocation({ lat: data.lat, lng: data.lng });
  });
}, []);
```

---

## Maps & Geolocation

### Map Configuration (OSM Tiles)

```typescript
// constants/config.ts
export const MAP_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

// Душанбе центр (default)
export const DEFAULT_REGION = {
  latitude: 38.5598,
  longitude: 68.7740,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
```

### MapView with OSM

```tsx
import MapView, { UrlTile, Marker } from 'react-native-maps';
import { MAP_TILE_URL, DEFAULT_REGION } from '../constants/config';

<MapView
  style={{ flex: 1 }}
  initialRegion={DEFAULT_REGION}
  mapType="none"  // disable default tiles
>
  <UrlTile urlTemplate={MAP_TILE_URL} maximumZ={19} />
  {driverLocation && (
    <Marker coordinate={driverLocation} title="Водитель" />
  )}
</MapView>
```

### Background Location (Driver App)

```typescript
// hooks/useLocation.ts — для driver app
import Geolocation from '@react-native-community/geolocation';

export const useDriverLocation = (socket: Socket | null) => {
  const store = useLocationStore();

  useEffect(() => {
    if (!store.isOnline || !socket) return;

    const watchId = Geolocation.watchPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        store.setLocation(loc);

        // Отправить на сервер
        socket.emit('driver:location', {
          lat: loc.lat,
          lng: loc.lng,
          heading: position.coords.heading,
          speed: position.coords.speed,
        });
      },
      (error) => console.error('GPS error:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 20,  // обновлять каждые 20 метров
        interval: 5000,       // или каждые 5 секунд
      }
    );

    store.setWatchId(watchId);
    return () => Geolocation.clearWatch(watchId);
  }, [store.isOnline, socket]);
};
```

---

## Passenger App Screens

| Screen | Route | Key Components |
|--------|-------|----------------|
| SplashScreen | — | Logo, token check, auto-navigate |
| AuthScreen | Auth/Phone | Phone input, "Получить код" button |
| OTPScreen | Auth/OTP | 6-digit input, timer, resend |
| HomeScreen | Main/Home | MapView, SearchBar, pickup/dropoff selection |
| OrderScreen | Main/Order | Route preview, price, "Заказать" button |
| SearchingScreen | Main/Searching | Pulsing animation, cancel button, timer |
| RideScreen | Main/Ride | Map (driver tracking), driver info card, chat button, statuses |
| RatingScreen | Main/Rating | Stars (1-5), comment input, submit |
| HistoryScreen | Main/History | FlatList of rides, pull-to-refresh |
| ChatScreen | Main/Chat | Messages list, input, send button |
| ProfileScreen | Main/Profile | Avatar, name, phone, "Выйти" |

---

## Driver App Screens

| Screen | Route | Key Components |
|--------|-------|----------------|
| AuthScreen | Auth/Phone | Same as passenger |
| OTPScreen | Auth/OTP | Same as passenger |
| HomeScreen | Main/Home | Map, Online/Offline toggle, daily earnings card |
| NewOrderScreen | Main/NewOrder | Incoming ride: route, price, accept timer (15s) |
| NavigationScreen | Main/Navigation | Map with route to pickup point |
| RideScreen | Main/Ride | Map with route to dropoff, status buttons (arrived/start/complete) |
| EarningsScreen | Main/Earnings | Today/week/month stats, chart |
| HistoryScreen | Main/History | Ride list with earnings per ride |
| ChatScreen | Main/Chat | Same as passenger |
| ProfileScreen | Main/Profile | Profile, documents, vehicle info |

---

## Shared Components

Components that are identical in both apps — consider extracting to a shared package or copying:

```
components/
├── ui/
│   ├── Button.tsx              # Стандартная кнопка
│   ├── Input.tsx               # Поле ввода
│   ├── PhoneInput.tsx          # Ввод телефона +992
│   ├── OTPInput.tsx            # 6 цифр
│   ├── LoadingSpinner.tsx
│   ├── Avatar.tsx
│   └── Card.tsx
├── map/
│   ├── OSMMapView.tsx          # MapView + UrlTile wrapper
│   ├── DriverMarker.tsx        # Маркер водителя (с поворотом)
│   ├── RoutePolyline.tsx       # Линия маршрута
│   └── PickupDropoffMarkers.tsx
└── ride/
    ├── RideCard.tsx            # Карточка поездки в истории
    ├── DriverInfoCard.tsx      # Инфо о водителе (фото, имя, авто, рейтинг)
    ├── PriceDisplay.tsx        # Отображение цены
    └── StatusBadge.tsx         # Цветной бейдж статуса
```
