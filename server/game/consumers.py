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
