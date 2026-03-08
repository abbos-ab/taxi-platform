"use client";

import { useEffect } from "react";
import L, { LeafletMouseEvent } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type MapPoint = {
  lat: number;
  lng: number;
};

type TaxiMapProps = {
  pickup: MapPoint | null;
  dropoff: MapPoint | null;
  routePoints: [number, number][];
  onSelectPoints: (pickup: MapPoint | null, dropoff: MapPoint | null) => void;
};

function ClickHandler({
  pickup,
  dropoff,
  onSelectPoints,
}: {
  pickup: MapPoint | null;
  dropoff: MapPoint | null;
  onSelectPoints: (pickup: MapPoint | null, dropoff: MapPoint | null) => void;
}) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const point = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      if (!pickup) {
        onSelectPoints(point, null);
        return;
      }

      if (!dropoff) {
        onSelectPoints(pickup, point);
        return;
      }

      onSelectPoints(point, null);
    },
  });

  return null;
}

function FitBounds({
  pickup,
  dropoff,
}: {
  pickup: MapPoint | null;
  dropoff: MapPoint | null;
}) {
  const map = useMapEvents({});

  useEffect(() => {
    if (pickup && dropoff) {
      map.fitBounds(
        [
          [pickup.lat, pickup.lng],
          [dropoff.lat, dropoff.lng],
        ],
        { padding: [40, 40] }
      );
    }
  }, [pickup, dropoff, map]);

  return null;
}

export default function TaxiMap({
  pickup,
  dropoff,
  routePoints,
  onSelectPoints,
}: TaxiMapProps) {
  return (
    <MapContainer
      center={[40.2833, 69.6222]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler
        pickup={pickup}
        dropoff={dropoff}
        onSelectPoints={onSelectPoints}
      />

      <FitBounds pickup={pickup} dropoff={dropoff} />

      {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
      {dropoff && <Marker position={[dropoff.lat, dropoff.lng]} />}

      {routePoints.length > 0 && (
        <Polyline positions={routePoints} pathOptions={{ weight: 6 }} />
      )}
    </MapContainer>
  );
}