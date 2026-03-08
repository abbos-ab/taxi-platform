from fastapi import FastAPI

from app.api.fare import router as fare_router
from app.core.config import settings

app = FastAPI(title=settings.app_name)

app.include_router(fare_router)


@app.get("/")
def root():
    return {"message": "Khujand Taxi API running"}