# Generated by Django 4.1.2 on 2022-11-23 16:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0007_remove_customuser_is_premium"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="status",
            field=models.IntegerField(
                blank=True,
                choices=[
                    (0, "ADMIN"),
                    (1, "IS_PREMIUM"),
                    (2, "IS_STANDARD"),
                    (3, "IS_WHALE"),
                ],
                default=2,
            ),
        ),
    ]
