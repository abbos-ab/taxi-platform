from django.urls import path
from apps.geo.views import RouteView, GeocodeView

urlpatterns = [
    path("route/", RouteView.as_view(), name="route"),
    path("geocode/", GeocodeView.as_view(), name="geocode"),
]
