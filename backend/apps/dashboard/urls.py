from django.urls import path
from apps.dashboard.views import DashboardStatsView, DashboardRidesView

urlpatterns = [
    path("stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("rides/", DashboardRidesView.as_view(), name="dashboard-rides"),
]
