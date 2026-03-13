export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
export const MAP_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

// Душанбе — центр по умолчанию
export const DEFAULT_CENTER: [number, number] = [38.5598, 68.774];
export const DEFAULT_ZOOM = 14;
