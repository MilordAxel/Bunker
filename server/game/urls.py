from django.urls import path, include

from rest_framework import routers

from . import views
from . import consumers


app_name = "game"

rest_router = routers.DefaultRouter(trailing_slash=False)
rest_router.register("game", views.GameViewSet, basename="game")

urlpatterns = [
    path("", include(rest_router.urls))
]

websocket_urlpatterns = [
    path("game_waiting_list", consumers.GameWaitingListConsumer.as_asgi(), name="game_waiting_list")
]
