from django.db import transaction
from django.utils import timezone
from django.contrib.gis.geos import Point
from rest_framework.exceptions import ValidationError

from apps.rides.models import Ride, Rating


VALID_TRANSITIONS = {
    "searching": ["accepted", "cancelled"],
    "accepted": ["arrived", "cancelled"],
    "arrived": ["in_progress", "cancelled"],
    "in_progress": ["completed"],
    "completed": [],
    "cancelled": [],
}


class RideService:
    @staticmethod
    def _validate_transition(ride, new_status):
        """Валидация перехода статуса."""
        allowed = VALID_TRANSITIONS.get(ride.status, [])
        if new_status not in allowed:
            raise ValidationError(
                {"status": f"Нельзя перейти из '{ride.status}' в '{new_status}'"}
            )

    @staticmethod
    @transaction.atomic
    def create_ride(*, passenger, pickup_lat, pickup_lng, pickup_address,
                    dropoff_lat, dropoff_lng, dropoff_address):
        """Создать новую поездку."""
        from apps.geo.services import GeoService
        from apps.pricing.services import PricingService

        route = GeoService.get_route(pickup_lat, pickup_lng, dropoff_lat, dropoff_lng)
        price = PricingService.calculate_fare(
            distance_km=route["distance_km"],
            duration_min=route["duration_min"],
        )

        ride = Ride.objects.create(
            passenger=passenger,
            pickup_location=Point(pickup_lng, pickup_lat, srid=4326),
            pickup_address=pickup_address,
            dropoff_location=Point(dropoff_lng, dropoff_lat, srid=4326),
            dropoff_address=dropoff_address,
            estimated_price=price,
            estimated_distance=route["distance_km"],
            estimated_duration=route["duration_min"],
            route_polyline=route.get("polyline", ""),
            status=Ride.Status.SEARCHING,
        )

        return ride

    @staticmethod
    @transaction.atomic
    def accept_ride(*, ride_id, driver):
        """Водитель принимает поездку."""
        ride = Ride.objects.select_for_update().get(id=ride_id)
        RideService._validate_transition(ride, "accepted")

        ride.status = Ride.Status.ACCEPTED
        ride.driver = driver
        ride.accepted_at = timezone.now()
        ride.save(update_fields=["status", "driver", "accepted_at", "updated_at"])
        return ride

    @staticmethod
    @transaction.atomic
    def arrive(*, ride_id):
        """Водитель прибыл на место посадки."""
        ride = Ride.objects.select_for_update().get(id=ride_id)
        RideService._validate_transition(ride, "arrived")

        ride.status = Ride.Status.ARRIVED
        ride.arrived_at = timezone.now()
        ride.save(update_fields=["status", "arrived_at", "updated_at"])
        return ride

    @staticmethod
    @transaction.atomic
    def start_ride(*, ride_id):
        """Начать поездку."""
        ride = Ride.objects.select_for_update().get(id=ride_id)
        RideService._validate_transition(ride, "in_progress")

        ride.status = Ride.Status.IN_PROGRESS
        ride.started_at = timezone.now()
        ride.save(update_fields=["status", "started_at", "updated_at"])
        return ride

    @staticmethod
    @transaction.atomic
    def complete_ride(*, ride_id):
        """Завершить поездку."""
        ride = Ride.objects.select_for_update().get(id=ride_id)
        RideService._validate_transition(ride, "completed")

        ride.status = Ride.Status.COMPLETED
        ride.completed_at = timezone.now()
        ride.final_price = ride.estimated_price  # TODO: пересчитать по факту
        ride.save(update_fields=["status", "completed_at", "final_price", "updated_at"])
        return ride

    @staticmethod
    @transaction.atomic
    def cancel_ride(*, ride_id, user, reason=""):
        """Отменить поездку."""
        ride = Ride.objects.select_for_update().get(id=ride_id)
        RideService._validate_transition(ride, "cancelled")

        ride.status = Ride.Status.CANCELLED
        ride.cancelled_at = timezone.now()
        ride.cancel_reason = reason
        ride.cancelled_by = user.role
        ride.save(update_fields=[
            "status", "cancelled_at", "cancel_reason", "cancelled_by", "updated_at"
        ])
        return ride

    @staticmethod
    @transaction.atomic
    def rate_ride(*, ride_id, user, score, comment=""):
        """Оценить поездку."""
        ride = Ride.objects.get(id=ride_id)
        if ride.status != Ride.Status.COMPLETED:
            raise ValidationError({"detail": "Можно оценить только завершённую поездку"})

        Rating.objects.create(ride=ride, rated_by=user, score=score, comment=comment)
