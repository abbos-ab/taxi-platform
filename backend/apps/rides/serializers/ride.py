from rest_framework import serializers
from apps.rides.models import Ride


class CreateRideSerializer(serializers.Serializer):
    pickup_lat = serializers.FloatField()
    pickup_lng = serializers.FloatField()
    pickup_address = serializers.CharField(max_length=255)
    dropoff_lat = serializers.FloatField()
    dropoff_lng = serializers.FloatField()
    dropoff_address = serializers.CharField(max_length=255)


class RideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ride
        fields = [
            "id", "status", "pickup_address", "dropoff_address",
            "estimated_price", "final_price", "estimated_distance",
            "estimated_duration", "created_at", "completed_at",
        ]
        read_only_fields = fields
