from django.db import models
from core.models import BaseModel


class Message(BaseModel):
    ride = models.ForeignKey("rides.Ride", on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    text = models.TextField()
    is_read = models.BooleanField(default=False)

    class Meta(BaseModel.Meta):
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"

    def __str__(self):
        return f"Сообщение от {self.sender} в поездке {self.ride_id}"
