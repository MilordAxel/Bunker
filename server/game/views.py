from random import choice

from django.core.cache import caches
from django.core.exceptions import ValidationError

from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

from asgiref.sync import async_to_sync

from channels.layers import get_channel_layer

from . import models, serializers


REDIS_CACHE = caches["default"]


class GameViewSet(ViewSet):
    lookup_url_kwarg = "game_code"

    def create(self, request):
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
            game_host.full_clean(exclude=["id"])
        except ValidationError as valid_exc:
            return Response(
                data=valid_exc.message_dict,
                status=status.HTTP_400_BAD_REQUEST
            )

        new_game.add_players(game_host)

        serialized_game_host = serializers.PlayerSerializer(
            game_host
        ).data

        REDIS_CACHE.set(f"game:{new_game.code}", new_game)

        serialized_new_game = serializers.GameSerializer(new_game).data
        async_to_sync(get_channel_layer().group_send)(
            "game_waiting_list",
            {
                "type": "broadcast.new.game",
                "content": serialized_new_game
            }
        )

        response = Response(
            data={
                "gameCode": new_game.code,
                "hostPlayerID": game_host.id
            },
            status=status.HTTP_201_CREATED
        )
        response.set_cookie("playerID", serialized_game_host.get("id"))
        return response

    @action(methods=["patch"], detail=False, url_path="add_player" , url_name="add_player")
    def add_player_to_game(self, request):
        game_code = request.data.get("gameCode")

        if not game_code:
            return Response(
                data={"gameCode": ["This field cannot be blank."]},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif len(game_code) != 10:
            return Response(
                data={"gameCode": ["Invalid code."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        game = REDIS_CACHE.get(f"game:{game_code}")
        
        if game is None:
            return Response(
                data={"gameCode": ["This game does not exist."]},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif game.status != "wait":
            return Response(
                data={"gameCode": ["This game has already begun."]},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        new_player = models.Player(
            nickname=request.data.get("playerNickname")
        )

        try:
            new_player.full_clean(exclude=["id"])
        except ValidationError as valid_exc:
            return Response(
                data=valid_exc.message_dict,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        game.add_players(new_player)

        REDIS_CACHE.set(f"game:{game.code}", game)

        serialized_new_player = serializers.PlayerSerializer(
            new_player
        ).data
        async_to_sync(get_channel_layer().group_send)(
            f"game_{game.code}",
            {
                "type": "new.player",
                "content": {"new_player": serialized_new_player}
            }
        )

        host_player = None
        for player in game.players:
            if player.game_host:
                host_player = player
                break

        response = Response(
            data={
                "gameName": game.name,
                "hostPlayerID": str(host_player.id)
            },
            status=status.HTTP_200_OK
        )
        response.set_cookie("playerID", serialized_new_player.get("id"))
        return response

    @action(methods=["delete"], detail=False, url_name="del_player", url_path="del_player")
    def delete_player_from_game(self, request):
        game_code = request.data.get("gameCode")
        del_other_player = request.data.get("delOtherPlayer")

        if del_other_player:
            player_id = request.data.get("playerID")
        else:
            player_id = request.COOKIES.get("playerID")
        
        game = REDIS_CACHE.get(f"game:{game_code}")

        for player in game.players:
            serialized_player = serializers.PlayerSerializer(
                player
            ).data

            if serialized_player.get("id") == player_id:
                game.players.remove(player)

                async_to_sync(get_channel_layer().group_send)(
                    f"game_{game_code}",
                    {
                        "type": "delete.player",
                        "content": { "player_id": player_id }
                    }
                )

                if player.game_host and game.players:
                    new_host_player = choice(game.players)
                    new_host_player.game_host = True

                    async_to_sync(get_channel_layer().group_send)(
                        f"game_{game_code}",
                        {
                            "type": "host.changed",
                            "content": { "host_player_id": str(new_host_player.id) }
                        }
                    )

                break
        else:
            return Response(
                data={
                    "message": f"Player with ID {player_id} player is not in this game"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if game.players:
            REDIS_CACHE.set(f"game:{game_code}", game)
        else:
            REDIS_CACHE.delete(f"game:{game_code}")

        return Response(
            status=status.HTTP_200_OK
        )
