from decimal import Decimal
from apps.pricing.models import Tariff


class PricingService:
    @staticmethod
    def calculate_fare(distance_km, duration_min, tariff_name="Стандарт"):
        """Рассчитать стоимость поездки."""
        tariff = Tariff.objects.get(name=tariff_name, is_active=True)
        fare = (
            tariff.base_fare
            + (tariff.per_km * Decimal(str(distance_km)))
            + (tariff.per_min * Decimal(str(duration_min)))
        )
        return max(fare, tariff.min_fare)
