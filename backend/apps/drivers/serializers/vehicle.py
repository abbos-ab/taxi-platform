from rest_framework import serializers
from apps.drivers.models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ["id", "make", "model", "year", "color", "plate_number", "is_active"]
        read_only_fields = ["id"]
