from rest_framework import generics
from .serializers import UserReportSerializer


class UserReportView(generics.CreateAPIView):
    serializer_class = UserReportSerializer
