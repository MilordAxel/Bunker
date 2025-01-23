from rest_framework import serializers
from . import models


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Player
        exclude = ["id"]
        depth = 1
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        characteristic_types = [
            "physique", "profession", "disease", "fear", "hobby", "inventory"
        ]
        for type in characteristic_types:
            representation[type] = getattr(instance, type).value
        
        return representation


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Game
        exclude = ["id"]
