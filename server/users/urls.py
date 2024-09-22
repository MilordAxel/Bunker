from django.urls import path
from . import views


app_name = "users"
urlpatterns = [
    path("user_report", views.UserReportView.as_view(), name="user_report")
]