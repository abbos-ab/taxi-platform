import { useEffect } from 'react';
import { useLocationStore } from '../store/useLocationStore';

export const useGeolocation = () => {
  const { setLocation, setLocating, setError } = useLocationStore();

  const locate = () => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    locate();
  }, []);

  return { locate };
};
