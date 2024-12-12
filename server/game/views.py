from django.core.cache import caches
from django.core.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from . import models, serializers


REDIS_CACHE = caches["default"]


class CreateGameView(APIView):
    def post(self, request):        
        new_game = models.Game(
            name=request.data.get("gameName"),
            private=request.data.get("privateGame"),
            password=request.data.get("gamePassword")
        )

        try:
            new_game.full_clean()
        except ValidationError as valid_exc:
            valid_exc.message_dict
            fields_errors_dict = {
                f"game{key.capitalize()}": value for key, value in valid_exc.message_dict.items()
            }

            return Response(
                data=fields_errors_dict,
                status=status.HTTP_400_BAD_REQUEST
            )

        game_host = models.Player(
            nickname=request.data.get("playerNickname"),
            game_host=True
        )

        try:
            game_host.full_clean()
        except ValidationError as valid_exc:
            return Response(
                data=valid_exc.message_dict,
                status=status.HTTP_400_BAD_REQUEST
            )

        new_game.add_players(game_host)

        serialized_game = serializers.GameSerializer(new_game).data

        REDIS_CACHE.set(f"game:{new_game.code}", new_game)

        return Response(
            {
                "gameCode": new_game.code,
                "players": serialized_game.get("players")
            },
            status=status.HTTP_201_CREATED
        )
