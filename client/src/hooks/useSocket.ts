import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import { SOCKET_URL } from '../constants/config';

export const useSocket = (namespace: string) => {
  const socketRef = useRef<Socket | null>(null);
  const token = useAuthStore((s) => s.token);

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

    return () => {
      socket.disconnect();
    };
  }, [token, namespace]);

  return socketRef;
};
