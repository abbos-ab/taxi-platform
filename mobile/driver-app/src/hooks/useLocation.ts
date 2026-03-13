import { useEffect } from 'react';
import { useLocationStore } from '../store/useLocationStore';
import { Socket } from 'socket.io-client';

export const useDriverLocation = (socket: Socket | null) => {
  const store = useLocationStore();

  useEffect(() => {
    if (!store.isOnline || !socket) return;

    // TODO: Подключить @react-native-community/geolocation
    // const watchId = Geolocation.watchPosition(
    //   (position) => {
    //     const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
    //     store.setLocation(loc);
    //     socket.emit('driver:location', {
    //       lat: loc.lat, lng: loc.lng,
    //       heading: position.coords.heading,
    //       speed: position.coords.speed,
    //     });
    //   },
    //   (error) => console.error('GPS error:', error),
    //   { enableHighAccuracy: true, distanceFilter: 20, interval: 5000 }
    // );
    // store.setWatchId(watchId);
    // return () => Geolocation.clearWatch(watchId);
  }, [store.isOnline, socket]);
};
