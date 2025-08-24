from json.decoder import JSONDecodeError

from django.core.cache import caches
from redis.exceptions import NoPermissionError
from channels.generic.websocket import JsonWebsocketConsumer

from . import serializers, filters


class GameWaitingListConsumer(JsonWebsocketConsumer):
    def connect(self):
        self.accept()
        self.channel_layer.group_add(
            "game_waiting_list",
            self.channel_name
        )

        game_waiting_list = filters.CachedGamesFilterBackend.by_field(
            key_regex="game:??????????",
            field_name="status",
            field_value="wait"
        )

        serialized_games_waiting_list = serializers.GameSerializer(
            game_waiting_list,
            many=True
        ).data

        self.send_json(content=serialized_games_waiting_list)

    def broadcast_new_game(self, event):
        self.send_json(content=event.get("content", {}))
    
    def disconnect(self, code):
        self.channel_layer.group_discard(
            "game_waiting_list",
            self.channel_name
        )


class GamePlayersListConsumer(JsonWebsocketConsumer):
    _redis_cache = caches["default"]

    def _send_error(self, message):
        self.send_json(
            {
                "status": "ERROR",
                "message": message
            }
        )

    def connect(self):
        self.accept()
    
    def receive(self, text_data=None, bytes_data=None, **kwargs):
        if bytes_data:
            self._send_error(
                "This WebSocket can't receive binary data."
            )
            return

        try:
            if text_data:
                json_content = self.decode_json(text_data)
            else:
                self._send_error("Text data is not provided.")
                return
        except JSONDecodeError:
            self._send_error(
                "Sent JSON-like text can't be decode. Check your sent text data."
            )
            return
        
        self.receive_json(json_content)

    def receive_json(self, content, **kwargs):
        game_code = content.get("gameCode")

        if not game_code:
            self._send_error(
                "The 'gameCode' parametr is not provided."
            )
            return
        
        try:
            game = self._redis_cache.get(f"game:{game_code}")
        except NoPermissionError:
            self._send_error("Invalid game code.")
            return
        
        if game is None:
            self._send_error(
                f"The game with the code {game_code} is not exists."
            )
        else:
            serialized_players = serializers.PlayerSerializer(
                game.players,
                many=True
            ).data

            self.channel_layer.group_add(
                f"game_{game_code}",
                self.channel_name
            )

            self.send_json(
                content={
                    "status": "OK",
                    "dataType": "playersList",
                    "playersList": serialized_players
                }
            )

    def new_player(self, event):
        if event.get("content"):
            self.send_json(
                content={
                    "dataType": "newPlayer",
                    "newPlayer": event["content"].get("new_player")
                }
            )
