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
