from django.apps import AppConfig


class RidesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.rides"
    verbose_name = "Поездки"

    def ready(self):
        import apps.rides.signals  # noqa: F401
