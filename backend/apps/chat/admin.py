from django.contrib import admin
from apps.chat.models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["ride", "sender", "text", "is_read", "created_at"]
    list_filter = ["is_read"]
    search_fields = ["text"]
