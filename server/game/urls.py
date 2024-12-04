from django.urls import path
from . import views


app_name = "game"
urlpatterns = [
    path("create_game", views.CreateGameView.as_view(), name="create_game")
]