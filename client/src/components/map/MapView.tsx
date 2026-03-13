import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_TILE_URL } from '../../constants/config';

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  children,
  className = 'h-full w-full',
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url={MAP_TILE_URL} maxZoom={19} />
      {children}
    </MapContainer>
  );
};
