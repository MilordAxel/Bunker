from rest_framework import serializers

from .models import UserReport


class UserReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReport
        fields = ["id", "text"]
