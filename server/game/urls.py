from django.urls import path
from . import views
from . import consumers


app_name = "game"
urlpatterns = [
    path("create_game", views.CreateGameView.as_view(), name="create_game")
]

websocket_urlpatterns = [
    path("game_waiting_list", consumers.GameWaitingListConsumer.as_asgi(), name="game_waiting_list")
]
