from app.core.config import settings
from app.domain.pricing import PricingPolicy, FareInput
from app.schemas.fare import FareQuoteRequest, FareQuoteResponse


class FareService:

    def __init__(self):
        self.pricing = PricingPolicy()

    def calculate(self, request: FareQuoteRequest):

        fare_input = FareInput(
            distance_km=request.distance_km,
            delay_minutes=request.delay_minutes,
            weather=request.weather,
            tariff=request.tariff
        )

        price = self.pricing.calculate(fare_input)

        return FareQuoteResponse(
            city=settings.default_city,
            currency=settings.default_currency,
            final_price=price
        )