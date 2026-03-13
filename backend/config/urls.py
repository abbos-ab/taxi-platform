from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    # API v1
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/rides/", include("apps.rides.urls")),
    path("api/v1/drivers/", include("apps.drivers.urls")),
    path("api/v1/geo/", include("apps.geo.urls")),
    path("api/v1/chat/", include("apps.chat.urls")),
    path("api/v1/notifications/", include("apps.notifications.urls")),
    path("api/v1/pricing/", include("apps.pricing.urls")),
    path("api/v1/dashboard/", include("apps.dashboard.urls")),
    path("api/v1/profile/", include("apps.accounts.profile_urls")),
    # Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
