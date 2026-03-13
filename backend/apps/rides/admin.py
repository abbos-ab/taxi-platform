from django.contrib import admin
from apps.rides.models import Ride, Rating


@admin.register(Ride)
class RideAdmin(admin.ModelAdmin):
    list_display = ["id", "passenger", "driver", "status", "estimated_price", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["passenger__phone", "driver__phone"]
    readonly_fields = ["id", "created_at", "updated_at"]


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ["ride", "score", "rated_by", "created_at"]
    list_filter = ["score"]
