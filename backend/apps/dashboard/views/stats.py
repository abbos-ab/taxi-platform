from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.rides.models import Ride
from apps.drivers.models import DriverProfile
from core.permissions import IsAdmin


class DashboardStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)

        stats = {
            "active_rides": Ride.objects.filter(
                status__in=["searching", "accepted", "arrived", "in_progress"]
            ).count(),
            "online_drivers": DriverProfile.objects.filter(is_online=True).count(),
            "today_rides": Ride.objects.filter(created_at__date=today).count(),
            "today_revenue": str(
                Ride.objects.filter(
                    status="completed", completed_at__date=today
                ).aggregate(total=Sum("final_price"))["total"] or 0
            ),
        }
        return Response(stats)


class DashboardRidesView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        """Список поездок для админки с фильтрацией."""
        from apps.rides.serializers import RideSerializer
        queryset = Ride.objects.all()

        status_filter = request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = RideSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
