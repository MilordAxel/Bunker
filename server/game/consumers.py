from json.decoder import JSONDecodeError

from django.core.cache import caches
from redis.exceptions import NoPermissionError
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from . import serializers, filters


class GameWaitingListConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add(
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

        await self.send_json(content=serialized_games_waiting_list)

    async def broadcast_new_game(self, event):
        await self.send_json(content=event.get("content", {}))
    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            "game_waiting_list",
            self.channel_name
        )


class GamePlayersListConsumer(AsyncJsonWebsocketConsumer):
    _redis_cache = caches["default"]

    async def _send_error(self, message):
        await self.send_json(
            {
                "status": "ERROR",
                "message": message
            }
        )

    async def connect(self):
        await self.accept()
    
    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        if bytes_data:
            await self._send_error(
                "This WebSocket can't receive binary data."
            )
            return

        try:
            if text_data:
                json_content = await self.decode_json(text_data)
            else:
                await self._send_error("Text data is not provided.")
                return
        except JSONDecodeError:
            await self._send_error(
                "Sent JSON-like text can't be decode. Check your sent text data."
            )
            return
        
        await self.receive_json(json_content)

    async def receive_json(self, content, **kwargs):
        game_code = content.get("gameCode")

        if not game_code:
            await self._send_error(
                "The 'gameCode' parametr is not provided."
            )
            return
        
        try:
            game = self._redis_cache.get(f"game:{game_code}")
        except NoPermissionError:
            await self._send_error("Invalid game code.")
            return
        
        if game is None:
            await self._send_error(
                f"The game with the code {game_code} is not exists."
            )
        else:
            serialized_players = serializers.PlayerSerializer(
                game.players,
                many=True
            ).data

            await self.channel_layer.group_add(
                f"game_{game_code}",
                self.channel_name
            )

            await self.send_json(
                content={
                    "status": "OK",
                    "dataType": "playersList",
                    "playersList": serialized_players
                }
            )
