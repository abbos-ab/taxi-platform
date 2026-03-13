import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapView } from '../../components/map/MapView';
import { LocationPicker } from '../../components/map/LocationPicker';
import { RoutePolyline } from '../../components/map/RoutePolyline';
import { Button } from '../../components/ui/Button';
import { useRideStore } from '../../store/useRideStore';
import { useLocationStore } from '../../store/useLocationStore';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useCreateRide } from '../../api/hooks/useRides';
import { reverseGeocode, getRoute } from '../../api/geo';
import { calculateFare } from '../../api/pricing';
import { ru } from '../../i18n/ru';
import type { FareQuote } from '../../types/ride';

const pickupIcon = L.divIcon({
  html: '<div style="background:#22c55e;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const dropoffIcon = L.divIcon({
  html: '<div style="background:#ef4444;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const MapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const services = [
  { id: 'taxi', icon: '🚕', label: 'Такси' },
  { id: 'delivery', icon: '📦', label: 'Доставка' },
  { id: 'intercity', icon: '🛣️', label: 'Межгород' },
];

const defaultTariffs: FareQuote[] = [
  { tariff_id: 'standard', tariff_name: 'Стандарт', price: 15, distance_km: 0, duration_min: 0 },
  { tariff_id: 'comfort', tariff_name: 'Комфорт', price: 25, distance_km: 0, duration_min: 0 },
  { tariff_id: 'business', tariff_name: 'Бизнес', price: 40, distance_km: 0, duration_min: 0 },
];

const tariffIcons: Record<string, string> = {
  'Стандарт': '🚗',
  'Комфорт': '🚙',
  'Бизнес': '🚘',
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { pickup, dropoff, setPickup, setDropoff, fareQuotes, setFareQuotes, selectedTariffId, setSelectedTariffId, setCurrentRide } = useRideStore();
  const currentLocation = useLocationStore((s) => s.currentLocation);
  const [selectingFor, setSelectingFor] = useState<'pickup' | 'dropoff'>('pickup');
  const [selectedService, setSelectedService] = useState('taxi');
  const [route, setRoute] = useState<[number, number][]>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const createRide = useCreateRide();

  useGeolocation();

  // Загрузка маршрута и тарифов при выборе обеих точек
  useEffect(() => {
    if (!pickup || !dropoff) {
      setRoute([]);
      setFareQuotes([]);
      return;
    }

    const fetchRoute = async () => {
      setLoadingRoute(true);
      try {
        const res = await getRoute(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
        setRoute(res.data.geometry);
        const quotesRes = await calculateFare(res.data.distance_km, res.data.duration_min);
        setFareQuotes(quotesRes.data);
        if (quotesRes.data.length > 0 && !selectedTariffId) {
          setSelectedTariffId(quotesRes.data[0].tariff_id);
        }
      } catch {
        // Показать дефолтные тарифы
        setFareQuotes(defaultTariffs);
        if (!selectedTariffId) setSelectedTariffId('standard');
      } finally {
        setLoadingRoute(false);
      }
    };
    fetchRoute();
  }, [pickup, dropoff]);

  const handleLocationSelect = useCallback(async (lat: number, lng: number) => {
    let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    try {
      const res = await reverseGeocode(lat, lng);
      address = res.data.address || address;
    } catch {
      // fallback
    }

    const loc = { lat, lng, address };
    if (selectingFor === 'pickup') {
      setPickup(loc);
      setSelectingFor('dropoff');
    } else {
      setDropoff(loc);
    }
  }, [selectingFor, setPickup, setDropoff]);

  const handleOrder = async () => {
    if (!pickup || !dropoff || !selectedTariffId) return;
    try {
      const res = await createRide.mutateAsync({
        pickup_lat: pickup.lat,
        pickup_lng: pickup.lng,
        pickup_address: pickup.address || '',
        dropoff_lat: dropoff.lat,
        dropoff_lng: dropoff.lng,
        dropoff_address: dropoff.address || '',
        tariff_id: selectedTariffId,
      });
      setCurrentRide(res.data);
      navigate('/searching');
    } catch {
      // TODO: error handling
    }
  };

  const mapCenter: [number, number] = currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : [38.5598, 68.774];

  const displayQuotes = fareQuotes.length > 0 ? fareQuotes : defaultTariffs;
  const selectedQuote = displayQuotes.find((q) => q.tariff_id === selectedTariffId);

  return (
    <div className="flex h-screen gap-5 p-5 bg-background">
      {/* Левая панель заказа */}
      <div className="w-[380px] flex-shrink-0 bg-white rounded-2xl shadow-sm flex flex-col overflow-auto">

        {/* Точка А и Б */}
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-bold text-primary mb-4">Заказ такси</h2>
          <div className="space-y-3">
            {/* Точка А */}
            <button
              onClick={() => setSelectingFor('pickup')}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                selectingFor === 'pickup' ? 'border-accent bg-sky-50' : 'border-border hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success flex-shrink-0" />
                <div>
                  <span className="text-xs text-text-secondary block">Точка А — {ru.home.pickup}</span>
                  <span className="text-sm text-primary font-medium">
                    {pickup?.address || 'Укажите на карте'}
                  </span>
                </div>
              </div>
            </button>

            {/* Разделитель */}
            <div className="flex items-center pl-[22px]">
              <div className="w-[3px] h-4 bg-gray-200 rounded-full" />
            </div>

            {/* Точка Б */}
            <button
              onClick={() => setSelectingFor('dropoff')}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                selectingFor === 'dropoff' ? 'border-accent bg-sky-50' : 'border-border hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-danger flex-shrink-0" />
                <div>
                  <span className="text-xs text-text-secondary block">Точка Б — {ru.home.dropoff}</span>
                  <span className="text-sm text-primary font-medium">
                    {dropoff?.address || ru.home.searchPlaceholder}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Сервисы */}
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Сервис</h3>
          <div className="flex gap-2">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedService(s.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all text-sm
                  ${selectedService === s.id
                    ? 'border-accent bg-sky-50 text-accent font-semibold'
                    : 'border-border text-text-secondary hover:border-gray-300'
                  }`}
              >
                <span className="text-2xl">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Тарифы */}
        <div className="p-5 border-b border-border flex-1">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Тариф</h3>
          <div className="space-y-2">
            {displayQuotes.map((q) => (
              <button
                key={q.tariff_id}
                onClick={() => setSelectedTariffId(q.tariff_id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all
                  ${selectedTariffId === q.tariff_id
                    ? 'border-accent bg-sky-50'
                    : 'border-border bg-white hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tariffIcons[q.tariff_name] || '🚗'}</span>
                  <div className="text-left">
                    <p className="font-semibold text-primary text-sm">{q.tariff_name}</p>
                    {q.distance_km > 0 && (
                      <p className="text-xs text-text-secondary">
                        {q.distance_km.toFixed(1)} км &middot; ~{Math.round(q.duration_min)} мин
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-base font-bold text-primary">
                  {q.price > 0 ? `${q.price.toFixed(0)} с.` : '—'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Кнопка Заказать */}
        <div className="p-5">
          <Button
            fullWidth
            onClick={handleOrder}
            loading={createRide.isPending}
            disabled={!pickup || !dropoff || !selectedTariffId}
          >
            {ru.order.order}
            {selectedQuote && selectedQuote.price > 0 && ` — ${selectedQuote.price.toFixed(0)} сомони`}
          </Button>
        </div>
      </div>

      {/* Карта справа */}
      <div className="flex-1 relative rounded-2xl overflow-hidden shadow-sm">
        <MapView center={mapCenter}>
          {currentLocation && <MapCenter center={[currentLocation.lat, currentLocation.lng]} />}
          <LocationPicker onLocationSelect={handleLocationSelect} />
          <RoutePolyline positions={route} />
          {pickup && (
            <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
              <Popup>{pickup.address || ru.home.pickup}</Popup>
            </Marker>
          )}
          {dropoff && (
            <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon}>
              <Popup>{dropoff.address || ru.home.dropoff}</Popup>
            </Marker>
          )}
        </MapView>

        {/* Подсказка на карте */}
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur rounded-xl px-4 py-2 shadow-md">
          <p className="text-sm text-text-secondary">
            {selectingFor === 'pickup'
              ? '👆 Нажмите на карту — выберите точку А'
              : '👆 Нажмите на карту — выберите точку Б'
            }
          </p>
        </div>

        {loadingRoute && (
          <div className="absolute top-4 right-4 z-[1000] bg-white rounded-xl px-4 py-2 shadow-md flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-text-secondary">Маршрут...</span>
          </div>
        )}
      </div>
    </div>
  );
};
