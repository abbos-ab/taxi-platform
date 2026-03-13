from rest_framework import serializers
from apps.notifications.models import Device


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ["id", "fcm_token", "platform", "is_active"]
        read_only_fields = ["id", "is_active"]
