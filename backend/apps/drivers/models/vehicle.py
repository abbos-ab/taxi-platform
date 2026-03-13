from django.db import models
from core.models import BaseModel


class Vehicle(BaseModel):
    driver = models.ForeignKey("drivers.DriverProfile", on_delete=models.CASCADE, related_name="vehicles")
    make = models.CharField(max_length=50, verbose_name="Марка")
    model = models.CharField(max_length=50, verbose_name="Модель")
    year = models.IntegerField(verbose_name="Год выпуска")
    color = models.CharField(max_length=30, verbose_name="Цвет")
    plate_number = models.CharField(max_length=15, verbose_name="Номер")
    is_active = models.BooleanField(default=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Транспорт"
        verbose_name_plural = "Транспорт"

    def __str__(self):
        return f"{self.make} {self.model} ({self.plate_number})"
