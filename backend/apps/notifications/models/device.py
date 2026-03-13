from django.db import models
from core.models import BaseModel


class Device(BaseModel):
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="devices")
    fcm_token = models.TextField()
    platform = models.CharField(max_length=10)  # "android" / "ios"
    is_active = models.BooleanField(default=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Устройство"
        verbose_name_plural = "Устройства"

    def __str__(self):
        return f"{self.platform} — {self.user.phone}"
