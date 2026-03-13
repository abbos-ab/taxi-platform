import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapView } from '../../components/map/MapView';
import { LocationPicker } from '../../components/map/LocationPicker';
import { Button } from '../../components/ui/Button';
import { useRideStore } from '../../store/useRideStore';
import { useLocationStore } from '../../store/useLocationStore';
import { useGeolocation } from '../../hooks/useGeolocation';
import { reverseGeocode } from '../../api/geo';
import { ru } from '../../i18n/ru';

const pickupIcon = L.divIcon({
  html: '<div style="background:#22c55e;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const dropoffIcon = L.divIcon({
  html: '<div style="background:#ef4444;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const MapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { pickup, dropoff, setPickup, setDropoff } = useRideStore();
  const currentLocation = useLocationStore((s) => s.currentLocation);
  const [selectingFor, setSelectingFor] = useState<'pickup' | 'dropoff'>('pickup');

  useGeolocation();

  const handleLocationSelect = useCallback(async (lat: number, lng: number) => {
    let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    try {
      const res = await reverseGeocode(lat, lng);
      address = res.data.address || address;
    } catch {
      // fallback to coordinates
    }

    const loc = { lat, lng, address };
    if (selectingFor === 'pickup') {
      setPickup(loc);
      setSelectingFor('dropoff');
    } else {
      setDropoff(loc);
    }
  }, [selectingFor, setPickup, setDropoff]);

  const canOrder = pickup && dropoff;

  const mapCenter: [number, number] = currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : [38.5598, 68.774];

  return (
    <div className="h-[calc(100vh-56px-56px)] sm:h-[calc(100vh-56px)] relative">
      <MapView center={mapCenter}>
        {currentLocation && <MapCenter center={[currentLocation.lat, currentLocation.lng]} />}
        <LocationPicker onLocationSelect={handleLocationSelect} />
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

      {/* Floating panel */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="space-y-3">
            <button
              onClick={() => setSelectingFor('pickup')}
              className={`w-full text-left px-4 py-3 rounded-xl border ${
                selectingFor === 'pickup' ? 'border-accent bg-sky-50' : 'border-border'
              }`}
            >
              <span className="text-xs text-text-secondary block">{ru.home.pickup}</span>
              <span className="text-sm text-primary font-medium">
                {pickup?.address || 'Нажмите на карту'}
              </span>
            </button>
            <button
              onClick={() => setSelectingFor('dropoff')}
              className={`w-full text-left px-4 py-3 rounded-xl border ${
                selectingFor === 'dropoff' ? 'border-accent bg-sky-50' : 'border-border'
              }`}
            >
              <span className="text-xs text-text-secondary block">{ru.home.dropoff}</span>
              <span className="text-sm text-primary font-medium">
                {dropoff?.address || ru.home.searchPlaceholder}
              </span>
            </button>
          </div>

          {canOrder && (
            <div className="mt-3">
              <Button fullWidth onClick={() => navigate('/order')}>
                {ru.order.title}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
