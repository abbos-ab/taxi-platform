from dataclasses import dataclass

from app.domain.enums import TariffType, WeatherType


@dataclass
class FareInput:
    distance_km: float
    delay_minutes: int
    weather: WeatherType
    tariff: TariffType


class PricingPolicy:
    tariffs = {
        TariffType.economy: {
            "min_fare": 8,
            "per_km": 1.5,
            "delay_rate": 0.2,
        },
        TariffType.comfort: {
            "min_fare": 10,
            "per_km": 2.0,
            "delay_rate": 0.25,
        },
        TariffType.business: {
            "min_fare": 14,
            "per_km": 3.0,
            "delay_rate": 0.35,
        },
    }

    weather_extra = {
        WeatherType.clear: 0,
        WeatherType.rain: 0.5,
        WeatherType.snow: 1,
    }

    def calculate(self, data: FareInput) -> int:
        tariff = self.tariffs[data.tariff]

        price = (
            data.distance_km * tariff["per_km"]
            + data.delay_minutes * tariff["delay_rate"]
            + self.weather_extra[data.weather]
        )

        price = max(tariff["min_fare"], price)

        return self.round_price(price)

    def round_price(self, value: float) -> int:
        return round(value)