import React from 'react';
import { Polyline } from 'react-leaflet';

interface RoutePolylineProps {
  positions: [number, number][];
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({ positions }) => {
  if (positions.length < 2) return null;

  return (
    <Polyline
      positions={positions}
      pathOptions={{ color: '#0ea5e9', weight: 5, opacity: 0.8 }}
    />
  );
};
