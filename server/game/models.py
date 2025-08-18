import uuid

from string import ascii_letters, digits
from random import choice, randint

from django.db import models
from django.core.validators import (
    RegexValidator,
    MinLengthValidator
)
from django.core.exceptions import ValidationError


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
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    nickname = models.CharField(max_length=40)
    game_host = models.BooleanField(default=False)

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
    name = models.CharField(
        max_length=255
    )
    code = models.CharField(
        max_length=10,
        default=gen_game_code
    )
    private = models.BooleanField()
    password = models.CharField(
        max_length=40,
        validators=[MinLengthValidator(8)],
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=7,
        validators=[
            RegexValidator(r"wait|start|current|finish")
        ],
        default="wait"
    )
    players = models.JSONField(blank=True, null=True, default=list)

    def clean(self):
        super().clean()
        if self.private and not self.password:
            raise ValidationError({"password": "This field cannot be blank"})

    def add_players(self, *players: Player):
        for player in players:
            self.players.append(player)
