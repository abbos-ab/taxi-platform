from django.db import models
from core.models import BaseModel


class Notification(BaseModel):
    class Type(models.TextChoices):
        RIDE_ACCEPTED = "ride_accepted", "Поездка принята"
        RIDE_ARRIVED = "ride_arrived", "Водитель на месте"
        RIDE_COMPLETED = "ride_completed", "Поездка завершена"
        RIDE_CANCELLED = "ride_cancelled", "Поездка отменена"
        NEW_MESSAGE = "new_message", "Новое сообщение"
        NEW_RIDE_REQUEST = "new_ride_request", "Новый заказ"

    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=30, choices=Type.choices)
    title = models.CharField(max_length=200)
    body = models.TextField()
    data = models.JSONField(default=dict)
    is_read = models.BooleanField(default=False)

    class Meta(BaseModel.Meta):
        verbose_name = "Уведомление"
        verbose_name_plural = "Уведомления"

    def __str__(self):
        return f"{self.get_type_display()} для {self.user.phone}"
