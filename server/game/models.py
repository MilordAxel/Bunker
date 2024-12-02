from string import ascii_letters, digits
from random import choice, randint

from django.db import models
from django.core.validators import (
    RegexValidator
)


class Characteristic(models.Model):
    type = models.CharField(
        max_length=255,
        validators=[
            RegexValidator(r"physique|profession|disease|fear|hobby|inventory")
        ]
    )
    value = models.CharField(max_length=255)


def gen_age(): return randint(18, 90)
def gen_gender(): return choice(["male", "female"])

def gen_game_code():
    return "".join(
        [ choice(ascii_letters + digits) for i in range(10) ]
    )

class GenCharacteristic:
    def __init__(self, characteristic_type):
        self.__type = characteristic_type

    def __call__(self):
        return choice(Characteristic.objects.filter(type=self.__type))


# Cached model
class Player(models.Model):
    nickname = models.CharField(max_length=40)

    # Characteristics
    age = models.IntegerField(
        default=gen_age
    )
    gender = models.CharField(
        max_length=6,
        default=gen_gender
    )
    physique = models.ForeignKey(
        Characteristic,
        on_delete=models.CASCADE,
        related_name="+",
        default=GenCharacteristic("physique")
    )
    profession = models.ForeignKey(
        Characteristic,
        on_delete=models.CASCADE,
        related_name="+",
        default=GenCharacteristic("profession")
    )
    disease = models.ForeignKey(
        Characteristic,
        on_delete=models.CASCADE,
        related_name="+",
        default=GenCharacteristic("disease")
    )
    fear = models.ForeignKey(
        Characteristic,
        on_delete=models.CASCADE,
        related_name="+",
        default=GenCharacteristic("fear")
    )
    hobby = models.ForeignKey(
        Characteristic,
        on_delete=models.CASCADE,
        related_name="+",
        default=GenCharacteristic("hobby")
    )
    inventory = models.ForeignKey(
        Characteristic,
        on_delete=models.CASCADE,
        related_name="+",
        default=GenCharacteristic("inventory")
    )


# Cached model
class Game(models.Model):
    code = models.CharField(
        max_length=10,
        default=gen_game_code
    )
    private = models.BooleanField()
    players = []

    def add_players(self, *players: Player):
        for player in players:
            self.players.append(player)
