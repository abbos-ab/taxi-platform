from django.contrib.gis.db import models as gis_models
from django.db import models

from core.models import BaseModel


class DriverProfile(BaseModel):
    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE, related_name="driver_profile")
    license_number = models.CharField(max_length=30)
    license_photo = models.ImageField(upload_to="licenses/")
    is_verified = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)
    current_location = gis_models.PointField(srid=4326, null=True, blank=True)
    rating = models.FloatField(default=5.0)
    total_rides = models.IntegerField(default=0)

    class Meta(BaseModel.Meta):
        verbose_name = "Профиль водителя"
        verbose_name_plural = "Профили водителей"

    def __str__(self):
        return f"Водитель {self.user.phone}"
