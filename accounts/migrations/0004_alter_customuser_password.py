# Generated by Django 4.1.2 on 2022-11-09 15:38

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_alter_customuser_password_alter_customuser_username"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="password",
            field=models.CharField(
                max_length=25,
                unique=True,
                validators=[
                    django.core.validators.RegexValidator(
                        code="invalid_password",
                        message="Password must have a lowercase letter, a uppercase letter, a special character and must be 7-25 characters long",
                        regex="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%)])",
                    ),
                    django.core.validators.MinLengthValidator(7),
                ],
            ),
        ),
    ]
