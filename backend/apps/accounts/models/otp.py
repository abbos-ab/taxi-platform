from django.db import models
from core.models import BaseModel


class OTPCode(BaseModel):
    phone = models.CharField(max_length=15)
    code = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()

    class Meta(BaseModel.Meta):
        verbose_name = "OTP-код"
        verbose_name_plural = "OTP-коды"

    def __str__(self):
        return f"OTP для {self.phone}"
