export type Coordinate = {
  lat: number;
  lng: number;
};

export type RouteResult = {
  distanceKm: number;
  durationMin: number;
  geometry: [number, number][];
};

export async function getRoute(
  start: Coordinate,
  end: Coordinate
): Promise<RouteResult> {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Route service error");
  }

  const data = await res.json();

  if (!data.routes || !data.routes.length) {
    throw new Error("Route topilmadi");
  }

  const route = data.routes[0];

  return {
    distanceKm: Number((route.distance / 1000).toFixed(1)),
    durationMin: Math.round(route.duration / 60),
    geometry: route.geometry.coordinates.map(
      (item: [number, number]) => [item[1], item[0]]
    ),
  };
}