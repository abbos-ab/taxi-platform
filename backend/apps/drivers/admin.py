from django.contrib import admin
from apps.drivers.models import DriverProfile, Vehicle


@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "is_verified", "is_online", "rating", "total_rides"]
    list_filter = ["is_verified", "is_online"]
    search_fields = ["user__phone", "user__first_name"]


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ["make", "model", "plate_number", "driver", "is_active"]
    list_filter = ["is_active"]
    search_fields = ["plate_number"]
