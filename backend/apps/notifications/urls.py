from django.urls import path
from apps.notifications.views import RegisterDeviceView, NotificationListView

urlpatterns = [
    path("register-device/", RegisterDeviceView.as_view(), name="register-device"),
    path("", NotificationListView.as_view(), name="notifications"),
]
