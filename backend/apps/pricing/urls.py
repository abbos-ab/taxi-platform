from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.pricing.views import TariffViewSet

router = DefaultRouter()
router.register("", TariffViewSet, basename="tariff")

urlpatterns = [
    path("", include(router.urls)),
]
