from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.drivers.models import DriverProfile
from apps.drivers.serializers import DriverProfileSerializer
from apps.drivers.services import DriverService
from core.permissions import IsDriver


class DriverViewSet(viewsets.ModelViewSet):
    serializer_class = DriverProfileSerializer
    queryset = DriverProfile.objects.all()

    @action(detail=False, methods=["post"], permission_classes=[IsDriver])
    def go_online(self, request):
        profile = DriverService.go_online(user=request.user)
        return Response(DriverProfileSerializer(profile).data)

    @action(detail=False, methods=["post"], permission_classes=[IsDriver])
    def go_offline(self, request):
        profile = DriverService.go_offline(user=request.user)
        return Response(DriverProfileSerializer(profile).data)

    @action(detail=False, methods=["get"])
    def nearby(self, request):
        lat = float(request.query_params.get("lat", 0))
        lng = float(request.query_params.get("lng", 0))
        radius = float(request.query_params.get("radius", 5))
        from apps.drivers.selectors import DriverSelector
        drivers = DriverSelector.get_nearby_online(lat, lng, radius_km=radius)
        return Response(DriverProfileSerializer(drivers, many=True).data)
