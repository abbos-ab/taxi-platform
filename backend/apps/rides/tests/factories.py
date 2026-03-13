import factory
from django.contrib.gis.geos import Point
from apps.rides.models import Ride
from apps.accounts.tests.factories import UserFactory


class RideFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Ride

    passenger = factory.SubFactory(UserFactory)
    pickup_location = factory.LazyFunction(lambda: Point(68.7740, 38.5598, srid=4326))
    pickup_address = "ул. Рудаки 45, Душанбе"
    dropoff_location = factory.LazyFunction(lambda: Point(68.8039, 38.5481, srid=4326))
    dropoff_address = "Гипрозем, Душанбе"
    estimated_price = 25.00
    estimated_distance = 4.2
    estimated_duration = 12
    status = Ride.Status.SEARCHING
