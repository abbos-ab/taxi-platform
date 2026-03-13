from django.db import models
from core.models import BaseModel


class Tariff(BaseModel):
    name = models.CharField(max_length=50, verbose_name="Название")
    base_fare = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Начальная цена")
    per_km = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="За км")
    per_min = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="За минуту")
    min_fare = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Мин. стоимость")
    is_active = models.BooleanField(default=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Тариф"
        verbose_name_plural = "Тарифы"

    def __str__(self):
        return self.name
