from apps.rides.models import Ride


class RideSelector:
    @staticmethod
    def get_active_ride(user):
        """Получить активную поездку пользователя."""
        return Ride.objects.filter(
            models.Q(passenger=user) | models.Q(driver=user),
            status__in=["searching", "accepted", "arrived", "in_progress"],
        ).first()
