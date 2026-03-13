from rest_framework import serializers
from apps.pricing.models import Tariff


class TariffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tariff
        fields = ["id", "name", "base_fare", "per_km", "per_min", "min_fare", "is_active"]
        read_only_fields = ["id"]
