from django.contrib.gis.db import models as gis_models
from django.db import models

from core.models import BaseModel


class Ride(BaseModel):
    class Status(models.TextChoices):
        SEARCHING = "searching", "Поиск водителя"
        ACCEPTED = "accepted", "Принят"
        ARRIVED = "arrived", "Водитель на месте"
        IN_PROGRESS = "in_progress", "В пути"
        COMPLETED = "completed", "Завершён"
        CANCELLED = "cancelled", "Отменён"

    passenger = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="rides_as_passenger"
    )
    driver = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True, related_name="rides_as_driver"
    )

    pickup_location = gis_models.PointField(srid=4326)
    pickup_address = models.CharField(max_length=255)
    dropoff_location = gis_models.PointField(srid=4326)
    dropoff_address = models.CharField(max_length=255)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SEARCHING)

    estimated_price = models.DecimalField(max_digits=10, decimal_places=2)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    estimated_distance = models.FloatField(help_text="km")
    estimated_duration = models.IntegerField(help_text="minutes")
    route_polyline = models.TextField(blank=True)

    accepted_at = models.DateTimeField(null=True, blank=True)
    arrived_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.CharField(max_length=255, blank=True)
    cancelled_by = models.CharField(max_length=10, blank=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Поездка"
        verbose_name_plural = "Поездки"

    def __str__(self):
        return f"Поездка {self.id} — {self.get_status_display()}"
