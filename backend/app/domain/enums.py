from enum import Enum


class TariffType(str, Enum):
    economy = "economy"
    comfort = "comfort"
    business = "business"


class WeatherType(str, Enum):
    clear = "clear"
    rain = "rain"
    snow = "snow"