from django.contrib import admin
from apps.pricing.models import Tariff


@admin.register(Tariff)
class TariffAdmin(admin.ModelAdmin):
    list_display = ["name", "base_fare", "per_km", "per_min", "min_fare", "is_active"]
    list_filter = ["is_active"]
