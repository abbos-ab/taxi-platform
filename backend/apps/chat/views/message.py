from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.chat.models import Message
from apps.chat.serializers import MessageSerializer


class ChatMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ride_id):
        """Получить историю сообщений поездки."""
        messages = Message.objects.filter(ride_id=ride_id).order_by("created_at")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, ride_id):
        """Сохранить сообщение (internal, от realtime-сервиса)."""
        serializer = MessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(ride_id=ride_id, sender=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
