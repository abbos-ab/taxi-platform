from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.rides.models import Ride
from apps.rides.serializers import RideSerializer, CreateRideSerializer, RatingSerializer
from apps.rides.services import RideService
from core.permissions import IsPassenger, IsDriver, IsRideParticipant


class RideViewSet(viewsets.ModelViewSet):
    serializer_class = RideSerializer
    queryset = Ride.objects.all()

    def get_permissions(self):
        if self.action == "create":
            return [IsPassenger()]
        if self.action in ["accept", "arrive", "start", "complete"]:
            return [IsDriver()]
        return [IsRideParticipant()]

    def create(self, request):
        serializer = CreateRideSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ride = RideService.create_ride(passenger=request.user, **serializer.validated_data)
        return Response(RideSerializer(ride).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        ride = RideService.accept_ride(ride_id=pk, driver=request.user)
        return Response(RideSerializer(ride).data)

    @action(detail=True, methods=["post"])
    def arrive(self, request, pk=None):
        ride = RideService.arrive(ride_id=pk)
        return Response(RideSerializer(ride).data)

    @action(detail=True, methods=["post"])
    def start(self, request, pk=None):
        ride = RideService.start_ride(ride_id=pk)
        return Response(RideSerializer(ride).data)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        ride = RideService.complete_ride(ride_id=pk)
        return Response(RideSerializer(ride).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        reason = request.data.get("reason", "")
        ride = RideService.cancel_ride(ride_id=pk, user=request.user, reason=reason)
        return Response(RideSerializer(ride).data)

    @action(detail=True, methods=["post"])
    def rate(self, request, pk=None):
        serializer = RatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        RideService.rate_ride(
            ride_id=pk, user=request.user,
            score=serializer.validated_data["score"],
            comment=serializer.validated_data.get("comment", ""),
        )
        return Response({"detail": "Оценка сохранена"})
