import requests
from django.conf import settings


class GeoService:
    OSRM_BASE = None

    @classmethod
    def _get_osrm_url(cls):
        if cls.OSRM_BASE is None:
            cls.OSRM_BASE = settings.OSRM_URL
        return cls.OSRM_BASE

    @staticmethod
    def get_route(from_lat, from_lng, to_lat, to_lng):
        """Получить маршрут через OSRM."""
        base = GeoService._get_osrm_url()
        url = f"{base}/route/v1/driving/{from_lng},{from_lat};{to_lng},{to_lat}"
        resp = requests.get(url, params={
            "overview": "full",
            "geometries": "polyline",
            "steps": "false",
        })
        data = resp.json()
        route = data["routes"][0]
        return {
            "distance_km": round(route["distance"] / 1000, 2),
            "duration_min": round(route["duration"] / 60, 1),
            "polyline": route["geometry"],
        }

    @staticmethod
    def reverse_geocode(lat, lng):
        """Обратное геокодирование через Nominatim."""
        resp = requests.get(
            "https://nominatim.openstreetmap.org/reverse",
            params={"lat": lat, "lon": lng, "format": "json", "accept-language": "ru"},
            headers={"User-Agent": "TurbTaxi/1.0"},
        )
        data = resp.json()
        return data.get("display_name", "")
