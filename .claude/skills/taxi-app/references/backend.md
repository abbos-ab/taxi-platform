# Backend Reference — Django + DRF

## Table of Contents
1. [Base Models and Core](#base-models-and-core)
2. [Accounts Module](#accounts-module)
3. [Rides Module](#rides-module)
4. [Drivers Module](#drivers-module)
5. [Geo Module](#geo-module)
6. [Chat Module](#chat-module)
7. [Notifications Module](#notifications-module)
8. [Pricing Module](#pricing-module)
9. [Dashboard Module](#dashboard-module)
10. [Settings Configuration](#settings-configuration)
11. [API Endpoint Details](#api-endpoint-details)

---

## Base Models and Core

Location: `core/`

### BaseModel

Every model inherits from this:

```python
# core/models.py
import uuid
from django.db import models

class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]
```

### Base Permissions

```python
# core/permissions.py
from rest_framework.permissions import BasePermission

class IsPassenger(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "passenger"

class IsDriver(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "driver"

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "admin"

class IsRideParticipant(BasePermission):
    """Доступ только участникам поездки (пассажир или водитель)."""
    def has_object_permission(self, request, view, obj):
        return obj.passenger == request.user or obj.driver == request.user
```

### Service Pattern

Every module follows fat-service, thin-view approach:

```python
# Example: apps/rides/services.py
from django.db import transaction
from apps.rides.models import Ride
from apps.notifications.services import NotificationService

class RideService:
    @staticmethod
    @transaction.atomic
    def create_ride(*, passenger, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng):
        """Создать новую поездку."""
        from apps.pricing.services import PricingService
        from apps.geo.services import GeoService

        route = GeoService.get_route(pickup_lat, pickup_lng, dropoff_lat, dropoff_lng)
        price = PricingService.calculate_fare(
            distance_km=route["distance_km"],
            duration_min=route["duration_min"]
        )

        ride = Ride.objects.create(
            passenger=passenger,
            pickup_location=Point(pickup_lng, pickup_lat, srid=4326),
            dropoff_location=Point(dropoff_lng, dropoff_lat, srid=4326),
            estimated_price=price,
            estimated_distance=route["distance_km"],
            estimated_duration=route["duration_min"],
            route_polyline=route["polyline"],
            status=Ride.Status.SEARCHING,
        )

        # Уведомить ближайших водителей через Socket.IO
        from apps.drivers.selectors import DriverSelector
        nearby = DriverSelector.get_nearby_online(pickup_lat, pickup_lng, radius_km=5)
        NotificationService.notify_new_ride(ride, nearby)

        return ride
```

### Selectors Pattern

```python
# Example: apps/drivers/selectors.py
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from apps.drivers.models import DriverProfile

class DriverSelector:
    @staticmethod
    def get_nearby_online(lat, lng, radius_km=5):
        """Найти ближайших онлайн-водителей в радиусе."""
        point = Point(lng, lat, srid=4326)
        return (
            DriverProfile.objects
            .filter(is_online=True, is_verified=True)
            .annotate(distance=Distance("current_location", point))
            .filter(distance__lte=radius_km * 1000)  # метры
            .order_by("distance")
        )
```

---

## Accounts Module

### Models

```python
# apps/accounts/models/user.py
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from core.models import BaseModel

class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Role(models.TextChoices):
        PASSENGER = "passenger", "Пассажир"
        DRIVER = "driver", "Водитель"
        ADMIN = "admin", "Администратор"

    phone = models.CharField(max_length=15, unique=True)  # +992XXXXXXXXX
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.PASSENGER)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []

    objects = UserManager()

# apps/accounts/models/otp.py
class OTPCode(BaseModel):
    phone = models.CharField(max_length=15)
    code = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
```

### API Endpoints

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/v1/auth/register/` | Register with phone | Public |
| POST | `/api/v1/auth/verify-otp/` | Verify OTP code | Public |
| POST | `/api/v1/auth/token/` | Get JWT pair | Public |
| POST | `/api/v1/auth/token/refresh/` | Refresh JWT | Public |
| GET | `/api/v1/profile/` | Get profile | Auth |
| PUT | `/api/v1/profile/` | Update profile | Auth |

### Request/Response Schemas

**Register:**
```json
// POST /api/v1/auth/register/
// Request:
{ "phone": "+992901234567" }
// Response 201:
{ "detail": "OTP отправлен", "phone": "+992901234567" }
```

**Verify OTP:**
```json
// POST /api/v1/auth/verify-otp/
// Request:
{ "phone": "+992901234567", "code": "123456" }
// Response 200:
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": { "id": "uuid", "phone": "+992901234567", "role": "passenger" }
}
```

---

## Rides Module

### Models

```python
# apps/rides/models/ride.py
from django.contrib.gis.db import models as gis_models
from core.models import BaseModel

class Ride(BaseModel):
    class Status(models.TextChoices):
        SEARCHING = "searching", "Поиск водителя"
        ACCEPTED = "accepted", "Принят"
        ARRIVED = "arrived", "Водитель на месте"
        IN_PROGRESS = "in_progress", "В пути"
        COMPLETED = "completed", "Завершён"
        CANCELLED = "cancelled", "Отменён"

    passenger = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="rides_as_passenger")
    driver = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True, related_name="rides_as_driver")

    pickup_location = gis_models.PointField(srid=4326)
    pickup_address = models.CharField(max_length=255)
    dropoff_location = gis_models.PointField(srid=4326)
    dropoff_address = models.CharField(max_length=255)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SEARCHING)

    estimated_price = models.DecimalField(max_digits=10, decimal_places=2)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    estimated_distance = models.FloatField(help_text="km")
    estimated_duration = models.IntegerField(help_text="minutes")
    route_polyline = models.TextField(blank=True)

    accepted_at = models.DateTimeField(null=True)
    arrived_at = models.DateTimeField(null=True)
    started_at = models.DateTimeField(null=True)
    completed_at = models.DateTimeField(null=True)
    cancelled_at = models.DateTimeField(null=True)
    cancel_reason = models.CharField(max_length=255, blank=True)
    cancelled_by = models.CharField(max_length=10, blank=True)  # "passenger" or "driver"

# apps/rides/models/rating.py
class Rating(BaseModel):
    ride = models.OneToOneField(Ride, on_delete=models.CASCADE, related_name="rating")
    score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    rated_by = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
```

### State Transitions (enforce in services.py)

```python
VALID_TRANSITIONS = {
    "searching": ["accepted", "cancelled"],
    "accepted": ["arrived", "cancelled"],
    "arrived": ["in_progress", "cancelled"],
    "in_progress": ["completed"],
    "completed": [],
    "cancelled": [],
}
```

### API Endpoints

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/v1/rides/` | Create ride | Passenger |
| GET | `/api/v1/rides/` | Ride history (paginated) | Auth |
| GET | `/api/v1/rides/{id}/` | Ride detail | Participant |
| POST | `/api/v1/rides/{id}/accept/` | Accept ride | Driver |
| POST | `/api/v1/rides/{id}/arrive/` | Mark arrived | Driver |
| POST | `/api/v1/rides/{id}/start/` | Start ride | Driver |
| POST | `/api/v1/rides/{id}/complete/` | Complete ride | Driver |
| POST | `/api/v1/rides/{id}/cancel/` | Cancel ride | Participant |
| POST | `/api/v1/rides/{id}/rate/` | Rate ride | Passenger |

### Create Ride Request/Response

```json
// POST /api/v1/rides/
// Request:
{
  "pickup_lat": 38.5598,
  "pickup_lng": 68.7740,
  "pickup_address": "ул. Рудаки 45, Душанбе",
  "dropoff_lat": 38.5481,
  "dropoff_lng": 68.8039,
  "dropoff_address": "Гипрозем, Душанбе"
}
// Response 201:
{
  "id": "uuid",
  "status": "searching",
  "estimated_price": "25.00",
  "estimated_distance": 4.2,
  "estimated_duration": 12,
  "pickup_address": "ул. Рудаки 45, Душанбе",
  "dropoff_address": "Гипрозем, Душанбе"
}
```

---

## Drivers Module

### Models

```python
# apps/drivers/models/profile.py
class DriverProfile(BaseModel):
    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE, related_name="driver_profile")
    license_number = models.CharField(max_length=30)
    license_photo = models.ImageField(upload_to="licenses/")
    is_verified = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)
    current_location = gis_models.PointField(srid=4326, null=True)
    rating = models.FloatField(default=5.0)
    total_rides = models.IntegerField(default=0)

# apps/drivers/models/vehicle.py
class Vehicle(BaseModel):
    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name="vehicles")
    make = models.CharField(max_length=50)      # Марка
    model = models.CharField(max_length=50)      # Модель
    year = models.IntegerField()
    color = models.CharField(max_length=30)
    plate_number = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
```

---

## Geo Module

### Services

```python
# apps/geo/services.py
import requests
from django.conf import settings

class GeoService:
    OSRM_BASE = settings.OSRM_URL  # http://localhost:5000

    @staticmethod
    def get_route(from_lat, from_lng, to_lat, to_lng):
        """Получить маршрут через OSRM."""
        url = f"{GeoService.OSRM_BASE}/route/v1/driving/{from_lng},{from_lat};{to_lng},{to_lat}"
        resp = requests.get(url, params={
            "overview": "full",
            "geometries": "polyline",
            "steps": "false"
        })
        data = resp.json()
        route = data["routes"][0]
        return {
            "distance_km": route["distance"] / 1000,
            "duration_min": route["duration"] / 60,
            "polyline": route["geometry"],
        }

    @staticmethod
    def reverse_geocode(lat, lng):
        """Обратное геокодирование через Nominatim."""
        resp = requests.get("https://nominatim.openstreetmap.org/reverse", params={
            "lat": lat, "lon": lng, "format": "json", "accept-language": "ru"
        }, headers={"User-Agent": "TaxiApp/1.0"})
        data = resp.json()
        return data.get("display_name", "")
```

---

## Chat Module

### Models

```python
# apps/chat/models/message.py
class Message(BaseModel):
    ride = models.ForeignKey("rides.Ride", on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    text = models.TextField()
    is_read = models.BooleanField(default=False)
```

Chat is primarily handled via Socket.IO. REST endpoints exist for history retrieval only.

---

## Notifications Module

### Models

```python
# apps/notifications/models/device.py
class Device(BaseModel):
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="devices")
    fcm_token = models.TextField()
    platform = models.CharField(max_length=10)  # "android" / "ios"
    is_active = models.BooleanField(default=True)

# apps/notifications/models/notification.py
class Notification(BaseModel):
    class Type(models.TextChoices):
        RIDE_ACCEPTED = "ride_accepted"
        RIDE_ARRIVED = "ride_arrived"
        RIDE_COMPLETED = "ride_completed"
        RIDE_CANCELLED = "ride_cancelled"
        NEW_MESSAGE = "new_message"
        NEW_RIDE_REQUEST = "new_ride_request"

    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=30, choices=Type.choices)
    title = models.CharField(max_length=200)
    body = models.TextField()
    data = models.JSONField(default=dict)
    is_read = models.BooleanField(default=False)
```

### Push Service (Celery task)

```python
# apps/notifications/tasks.py
from celery import shared_task
import firebase_admin
from firebase_admin import messaging

@shared_task
def send_push(user_id, title, body, data=None):
    """Отправить push через FCM."""
    devices = Device.objects.filter(user_id=user_id, is_active=True)
    tokens = [d.fcm_token for d in devices]
    if not tokens:
        return

    message = messaging.MulticastMessage(
        tokens=tokens,
        notification=messaging.Notification(title=title, body=body),
        data=data or {},
    )
    messaging.send_each_for_multicast(message)
```

---

## Pricing Module

### Models

```python
# apps/pricing/models/tariff.py
class Tariff(BaseModel):
    name = models.CharField(max_length=50)          # "Стандарт", "Комфорт"
    base_fare = models.DecimalField(max_digits=8, decimal_places=2)  # начальная цена
    per_km = models.DecimalField(max_digits=8, decimal_places=2)     # за км
    per_min = models.DecimalField(max_digits=8, decimal_places=2)    # за минуту
    min_fare = models.DecimalField(max_digits=8, decimal_places=2)   # мин. стоимость
    is_active = models.BooleanField(default=True)
```

### Service

```python
# apps/pricing/services.py
class PricingService:
    @staticmethod
    def calculate_fare(distance_km, duration_min, tariff_name="Стандарт"):
        tariff = Tariff.objects.get(name=tariff_name, is_active=True)
        fare = tariff.base_fare + (tariff.per_km * distance_km) + (tariff.per_min * duration_min)
        return max(fare, tariff.min_fare)
```

---

## Settings Configuration

```python
# config/settings/base.py key settings:
AUTH_USER_MODEL = "accounts.User"

INSTALLED_APPS = [
    # django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.gis",         # PostGIS
    # third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "drf_spectacular",
    "corsheaders",
    "django_filters",
    "django_celery_beat",
    # apps
    "apps.accounts",
    "apps.rides",
    "apps.drivers",
    "apps.geo",
    "apps.chat",
    "apps.notifications",
    "apps.pricing",
    "apps.dashboard",
]

DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": env("DB_NAME", default="taxi_db"),
        "USER": env("DB_USER", default="postgres"),
        "PASSWORD": env("DB_PASSWORD", default="postgres"),
        "HOST": env("DB_HOST", default="localhost"),
        "PORT": env("DB_PORT", default="5432"),
    }
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
}

CELERY_BROKER_URL = env("REDIS_URL", default="redis://localhost:6379/0")
CELERY_RESULT_BACKEND = CELERY_BROKER_URL
OSRM_URL = env("OSRM_URL", default="http://localhost:5000")
```

### Requirements (base.txt)

```
Django>=5.0,<6.0
djangorestframework>=3.15
djangorestframework-simplejwt
drf-spectacular
django-cors-headers
django-filter
django-environ
psycopg2-binary
celery[redis]
django-celery-beat
firebase-admin
factory-boy
pytest
pytest-django
gunicorn
Pillow
requests
```
