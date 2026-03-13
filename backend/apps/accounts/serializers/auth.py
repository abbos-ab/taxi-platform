from rest_framework import serializers
from apps.accounts.models import User


class RegisterSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)


class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    code = serializers.CharField(max_length=6)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "phone", "first_name", "last_name", "avatar", "role"]
        read_only_fields = ["id", "phone", "role"]
