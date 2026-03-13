import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useRideStore } from '../../store/useRideStore';
import { useRideSocket } from '../../hooks/useRideSocket';
import { useCancelRide } from '../../api/hooks/useRides';
import { ru } from '../../i18n/ru';

export const SearchingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRide, rideStatus } = useRideStore();
  const cancelRide = useCancelRide();

  useRideSocket(currentRide?.id);

  React.useEffect(() => {
    if (rideStatus === 'accepted' && currentRide) {
      navigate(`/ride/${currentRide.id}`);
    }
  }, [rideStatus, currentRide, navigate]);

  const handleCancel = async () => {
    if (!currentRide) return;
    try {
      await cancelRide.mutateAsync({ id: currentRide.id, reason: 'Отменено пассажиром' });
      useRideStore.getState().reset();
      navigate('/');
    } catch {
      // TODO: show error
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] bg-background p-6">
      {/* Pulsing animation */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-accent/20 rounded-full animate-ping absolute" />
        <div className="w-24 h-24 bg-accent/40 rounded-full animate-pulse absolute" style={{ animationDelay: '0.5s' }} />
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center relative">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-bold text-primary mb-2">{ru.ride.searching}</h2>
      <p className="text-text-secondary text-center mb-8">{ru.ride.searchingDesc}</p>

      <Button variant="danger" onClick={handleCancel} loading={cancelRide.isPending}>
        {ru.ride.cancel}
      </Button>
    </div>
  );
};
