from django.urls import path
from apps.chat.views import ChatMessageView

urlpatterns = [
    path("<uuid:ride_id>/", ChatMessageView.as_view(), name="chat-messages"),
]
