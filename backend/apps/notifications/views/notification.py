from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.notifications.models import Device, Notification
from apps.notifications.serializers import DeviceSerializer, NotificationSerializer


class RegisterDeviceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeviceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        Device.objects.update_or_create(
            user=request.user,
            fcm_token=serializer.validated_data["fcm_token"],
            defaults={"platform": serializer.validated_data["platform"], "is_active": True},
        )
        return Response({"detail": "Устройство зарегистрировано"}, status=status.HTTP_201_CREATED)


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
