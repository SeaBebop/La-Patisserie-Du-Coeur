from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.core.validators import MinLengthValidator
from django.contrib.postgres.fields import ArrayField

# Create your models here.


class CustomUser(AbstractUser):
    ADMIN = 0
    IS_PREMIUM = 1
    IS_STANDARD = 2
    IS_WHALE = 3
    USER_LEVEL_CHOICES = (
        (ADMIN, 'ADMIN'), (IS_PREMIUM, 'IS_PREMIUM'), (IS_STANDARD, 'IS_STANDARD'), (IS_WHALE, 'IS_WHALE'),)

    name = models.CharField(null=True, blank=True, max_length=100)
    username = models.CharField(unique=True, null=False, blank=False, max_length=25,
                                validators=[
                                    RegexValidator(regex='^[a-zA-Z][a-zA-Z0-9_]{3,24}$',
                                                   message='Username must start with a letter and must be 4-25 characters long',
                                                   code='invalid_username'), MinLengthValidator(4)])

    password = models.CharField(unique=True, null=False, blank=False, max_length=130,
                                validators=[
                                    RegexValidator(regex='(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%)])',
                                                   message='Password must have a lowercase letter, a uppercase letter, a special character and must be 7 characters long',
                                                   code='invalid_password'), MinLengthValidator(7)])

    roles = models.IntegerField(
        choices=USER_LEVEL_CHOICES, blank=True, default=IS_STANDARD)

    def is_Admin(self):
        if self.roles == 0:
            return True
        return False

    def is_Premium(self):
        if self.roles == 1:
            return True
        else:
            return False

    def is_Standard(self):
        if self.roles == 2:
            return True
        return False

    def is_Whale(self):
        if self.roles == 3:
            return True
        return False
