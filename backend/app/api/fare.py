from fastapi import APIRouter

from app.schemas.fare import FareQuoteRequest, FareQuoteResponse
from app.services.fare_service import FareService

router = APIRouter(prefix="/fare", tags=["fare"])

service = FareService()


@router.post("/quote", response_model=FareQuoteResponse)
def quote(payload: FareQuoteRequest):
    return service.calculate(payload)