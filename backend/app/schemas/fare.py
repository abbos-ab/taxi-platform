from pydantic import BaseModel

from app.domain.enums import TariffType, WeatherType


class FareQuoteRequest(BaseModel):
    origin: str
    destination: str
    distance_km: float
    delay_minutes: int = 0
    weather: WeatherType = WeatherType.clear
    tariff: TariffType = TariffType.economy


class FareQuoteResponse(BaseModel):
    city: str
    currency: str
    final_price: float