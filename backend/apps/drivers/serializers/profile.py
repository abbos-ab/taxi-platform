from rest_framework import serializers
from apps.drivers.models import DriverProfile


class DriverProfileSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source="user.phone", read_only=True)
    full_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = DriverProfile
        fields = [
            "id", "phone", "full_name", "license_number",
            "is_verified", "is_online", "rating", "total_rides",
        ]
        read_only_fields = ["id", "is_verified", "rating", "total_rides"]
