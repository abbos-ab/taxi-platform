from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from core.models import BaseModel


class Rating(BaseModel):
    ride = models.OneToOneField("rides.Ride", on_delete=models.CASCADE, related_name="rating")
    score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    rated_by = models.ForeignKey("accounts.User", on_delete=models.CASCADE)

    class Meta(BaseModel.Meta):
        verbose_name = "Оценка"
        verbose_name_plural = "Оценки"

    def __str__(self):
        return f"Оценка {self.score}/5 для поездки {self.ride_id}"
