import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { useRideStore } from '../store/useRideStore';
import { useNavigate } from 'react-router-dom';

export const useRideSocket = (rideId?: string) => {
  const ridesSocket = useSocket('/rides');
  const trackingSocket = useSocket('/tracking');
  const { setRideStatus, setDriverLocation, setCurrentRide, currentRide } = useRideStore();
  const navigate = useNavigate();

  useEffect(() => {
    const s = ridesSocket.current;
    if (!s || !rideId) return;

    s.emit('ride:subscribe', { ride_id: rideId });

    s.on('ride:accepted', (data) => {
      setRideStatus('accepted');
      if (currentRide) {
        setCurrentRide({ ...currentRide, driver: data.driver, status: 'accepted' });
      }
    });

    s.on('ride:arrived', () => setRideStatus('arrived'));
    s.on('ride:started', () => setRideStatus('in_progress'));
    s.on('ride:completed', (data) => {
      setRideStatus('completed');
      navigate(`/ride/${rideId}/rate`);
    });
    s.on('ride:cancelled', () => {
      setRideStatus('cancelled');
      navigate('/');
    });

    return () => {
      s.removeAllListeners();
    };
  }, [rideId]);

  useEffect(() => {
    const ts = trackingSocket.current;
    if (!ts || !rideId) return;

    ts.emit('ride:subscribe', { ride_id: rideId });
    ts.on('driver:location:update', (data) => {
      setDriverLocation({ lat: data.lat, lng: data.lng });
    });

    return () => {
      ts.removeAllListeners();
    };
  }, [rideId]);

  return { ridesSocket, trackingSocket };
};
