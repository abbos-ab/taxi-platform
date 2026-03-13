from django.contrib import admin
from apps.notifications.models import Device, Notification


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ["user", "platform", "is_active", "created_at"]
    list_filter = ["platform", "is_active"]


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["user", "type", "title", "is_read", "created_at"]
    list_filter = ["type", "is_read"]
