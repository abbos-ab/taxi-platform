from rest_framework import serializers
from apps.chat.models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.full_name", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "sender_name", "text", "is_read", "created_at"]
        read_only_fields = ["id", "sender", "sender_name", "is_read", "created_at"]
