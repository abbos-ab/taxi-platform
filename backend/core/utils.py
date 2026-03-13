import random
import string


def generate_otp(length=6):
    """Генерация OTP-кода."""
    return "".join(random.choices(string.digits, k=length))
