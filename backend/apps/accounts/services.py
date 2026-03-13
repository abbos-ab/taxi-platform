from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import User, OTPCode
from core.utils import generate_otp


class AuthService:
    @staticmethod
    def register(*, phone):
        """Регистрация / вход по номеру телефона. Отправляет OTP."""
        otp_code = generate_otp()
        expires_at = timezone.now() + timedelta(minutes=5)

        OTPCode.objects.create(phone=phone, code=otp_code, expires_at=expires_at)

        # TODO: отправить SMS через провайдера
        # SmsService.send(phone, f"Ваш код: {otp_code}")

        return {"detail": "OTP отправлен", "phone": phone}

    @staticmethod
    def verify_otp(*, phone, code):
        """Верификация OTP-кода. Создаёт пользователя если не существует."""
        otp = (
            OTPCode.objects.filter(
                phone=phone, code=code, is_used=False, expires_at__gt=timezone.now()
            )
            .order_by("-created_at")
            .first()
        )

        if not otp:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"code": "Неверный или просроченный код"})

        otp.is_used = True
        otp.save(update_fields=["is_used"])

        user, _ = User.objects.get_or_create(phone=phone)
        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": str(user.id),
                "phone": user.phone,
                "role": user.role,
            },
        }
