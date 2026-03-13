from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.pricing.models import Tariff
from apps.pricing.serializers import TariffSerializer


class TariffViewSet(viewsets.ModelViewSet):
    serializer_class = TariffSerializer
    queryset = Tariff.objects.filter(is_active=True)
    permission_classes = [IsAuthenticated]
