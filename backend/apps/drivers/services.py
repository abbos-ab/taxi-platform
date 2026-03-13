from apps.drivers.models import DriverProfile


class DriverService:
    @staticmethod
    def go_online(*, user):
        """Водитель выходит на линию."""
        profile = DriverProfile.objects.get(user=user)
        profile.is_online = True
        profile.save(update_fields=["is_online", "updated_at"])
        return profile

    @staticmethod
    def go_offline(*, user):
        """Водитель уходит с линии."""
        profile = DriverProfile.objects.get(user=user)
        profile.is_online = False
        profile.save(update_fields=["is_online", "updated_at"])
        return profile
