import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapView } from '../../components/map/MapView';
import { DriverMarker } from '../../components/map/DriverMarker';
import { DriverInfoCard } from '../../components/ride/DriverInfoCard';
import { RideStatusBar } from '../../components/ride/RideStatusBar';
import { Button } from '../../components/ui/Button';
import { useRideStore } from '../../store/useRideStore';
import { useRideSocket } from '../../hooks/useRideSocket';
import { ru } from '../../i18n/ru';
import { Marker } from 'react-leaflet';

export const RidePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRide, rideStatus, driverLocation } = useRideStore();

  useRideSocket(id);

  const status = rideStatus || currentRide?.status || 'accepted';
  const driver = currentRide?.driver;

  const center: [number, number] = driverLocation
    ? [driverLocation.lat, driverLocation.lng]
    : currentRide?.pickup
      ? [currentRide.pickup.lat, currentRide.pickup.lng]
      : [38.5598, 68.774];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 relative">
        <MapView center={center} zoom={15}>
          {driverLocation && (
            <DriverMarker
              position={[driverLocation.lat, driverLocation.lng]}
              name={driver?.name}
            />
          )}
          {currentRide?.pickup && (
            <Marker position={[currentRide.pickup.lat, currentRide.pickup.lng]} />
          )}
          {currentRide?.dropoff && (
            <Marker position={[currentRide.dropoff.lat, currentRide.dropoff.lng]} />
          )}
        </MapView>
      </div>

      <div className="bg-white border-t border-border p-4 space-y-3">
        <RideStatusBar status={status} />

        {driver && <DriverInfoCard driver={driver} />}

        <div className="flex gap-3">
          {id && (
            <Button variant="secondary" fullWidth onClick={() => navigate(`/ride/${id}/chat`)}>
              {ru.ride.chat}
            </Button>
          )}
          {(status === 'accepted' || status === 'arrived') && (
            <Button variant="danger" fullWidth onClick={() => navigate('/')}>
              {ru.ride.cancel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
