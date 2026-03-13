from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point

from apps.drivers.models import DriverProfile


class DriverSelector:
    @staticmethod
    def get_nearby_online(lat, lng, radius_km=5):
        """Найти ближайших онлайн-водителей в радиусе."""
        point = Point(lng, lat, srid=4326)
        return (
            DriverProfile.objects.filter(is_online=True, is_verified=True)
            .annotate(distance=Distance("current_location", point))
            .filter(distance__lte=radius_km * 1000)
            .order_by("distance")
        )
