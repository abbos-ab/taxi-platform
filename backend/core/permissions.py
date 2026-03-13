from rest_framework.permissions import BasePermission


class IsPassenger(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "passenger"


class IsDriver(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "driver"


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin"


class IsRideParticipant(BasePermission):
    """Доступ только участникам поездки (пассажир или водитель)."""

    def has_object_permission(self, request, view, obj):
        return obj.passenger == request.user or obj.driver == request.user
