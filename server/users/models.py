from django.db import models


class UserReport(models.Model):
    text = models.TextField(verbose_name="Report")
    is_check = models.BooleanField(verbose_name="Checked", default=False)
    created = models.DateTimeField(auto_now_add=True)
