import { useEffect } from 'react';
import { useLocationStore } from '../store/useLocationStore';

export const useCurrentLocation = () => {
  const setLocation = useLocationStore((s) => s.setLocation);

  useEffect(() => {
    // TODO: Подключить @react-native-community/geolocation
    // Geolocation.getCurrentPosition(
    //   (position) => {
    //     setLocation({
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude,
    //     });
    //   },
    //   (error) => console.error('GPS error:', error),
    //   { enableHighAccuracy: true }
    // );
  }, [setLocation]);

  return useLocationStore((s) => s.currentLocation);
};
