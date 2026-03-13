import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '../../components/map/MapView';
import { RoutePolyline } from '../../components/map/RoutePolyline';
import { TariffSelector } from '../../components/ride/TariffSelector';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useRideStore } from '../../store/useRideStore';
import { useCalculateFare } from '../../api/hooks/usePricing';
import { useCreateRide } from '../../api/hooks/useRides';
import { getRoute } from '../../api/geo';
import { ru } from '../../i18n/ru';
import { Marker } from 'react-leaflet';

export const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { pickup, dropoff, fareQuotes, selectedTariffId, setFareQuotes, setSelectedTariffId, setCurrentRide } = useRideStore();
  const calculateFare = useCalculateFare();
  const createRide = useCreateRide();
  const [route, setRoute] = React.useState<[number, number][]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!pickup || !dropoff) {
      navigate('/');
      return;
    }

    const fetchRoute = async () => {
      try {
        const res = await getRoute(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
        setRoute(res.data.geometry);

        const quotes = await calculateFare.mutateAsync({
          distance_km: res.data.distance_km,
          duration_min: res.data.duration_min,
        });
        setFareQuotes(quotes);
        if (quotes.length > 0) setSelectedTariffId(quotes[0].tariff_id);
      } catch {
        // Fallback: show without route
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [pickup, dropoff]);

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
      // TODO: show error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <LoadingSpinner text="Рассчитываем маршрут..." />
      </div>
    );
  }

  const selectedQuote = fareQuotes.find((q) => q.tariff_id === selectedTariffId);
  const center: [number, number] = pickup
    ? [pickup.lat, pickup.lng]
    : [38.5598, 68.774];

  return (
    <div className="flex flex-col h-[calc(100vh-56px-56px)] sm:h-[calc(100vh-56px)]">
      <div className="flex-1 relative">
        <MapView center={center} zoom={13}>
          <RoutePolyline positions={route} />
          {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
          {dropoff && <Marker position={[dropoff.lat, dropoff.lng]} />}
        </MapView>
      </div>

      <div className="bg-white border-t border-border p-4 max-h-[50vh] overflow-auto">
        <h2 className="text-lg font-bold text-primary mb-3">{ru.order.selectTariff}</h2>

        {fareQuotes.length > 0 ? (
          <TariffSelector
            quotes={fareQuotes}
            selectedId={selectedTariffId}
            onSelect={setSelectedTariffId}
          />
        ) : (
          <p className="text-text-secondary text-center py-4">Тарифы недоступны</p>
        )}

        <div className="mt-4">
          <Button
            fullWidth
            onClick={handleOrder}
            loading={createRide.isPending}
            disabled={!selectedTariffId}
          >
            {ru.order.order}
            {selectedQuote && ` — ${selectedQuote.price.toFixed(0)} с.`}
          </Button>
        </div>
      </div>
    </div>
  );
};
