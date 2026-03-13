from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "TURBO TAXI API"

    default_city: str = "Khujand"
    default_currency: str = "TJS"

    min_fare: float = 8.0
    per_km_rate: float = 1.5
    delay_minute_rate: float = 0.2

    weather_clear_extra: float = 0
    weather_rain_extra: float = 0.5
    weather_snow_extra: float = 1.0

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()