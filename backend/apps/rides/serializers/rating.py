from rest_framework import serializers
from apps.rides.models import Rating


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["id", "score", "comment", "created_at"]
        read_only_fields = ["id", "created_at"]
