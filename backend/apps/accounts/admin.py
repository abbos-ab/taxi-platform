from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.accounts.models import User, OTPCode


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["phone", "first_name", "last_name", "role", "is_active"]
    list_filter = ["role", "is_active"]
    search_fields = ["phone", "first_name", "last_name"]
    ordering = ["-created_at"]
    fieldsets = (
        (None, {"fields": ("phone", "password")}),
        ("Личные данные", {"fields": ("first_name", "last_name", "avatar")}),
        ("Роль", {"fields": ("role",)}),
        ("Права доступа", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("phone", "role", "password1", "password2")}),
    )


@admin.register(OTPCode)
class OTPCodeAdmin(admin.ModelAdmin):
    list_display = ["phone", "code", "is_used", "expires_at", "created_at"]
    list_filter = ["is_used"]
    search_fields = ["phone"]
