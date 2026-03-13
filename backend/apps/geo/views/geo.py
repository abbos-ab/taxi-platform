from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.geo.services import GeoService


class RouteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from_lat = float(request.query_params["from_lat"])
        from_lng = float(request.query_params["from_lng"])
        to_lat = float(request.query_params["to_lat"])
        to_lng = float(request.query_params["to_lng"])
        route = GeoService.get_route(from_lat, from_lng, to_lat, to_lng)
        return Response(route)


class GeocodeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lat = float(request.query_params["lat"])
        lng = float(request.query_params["lng"])
        address = GeoService.reverse_geocode(lat, lng)
        return Response({"address": address})
