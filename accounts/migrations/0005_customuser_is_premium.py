# Generated by Django 4.1.2 on 2022-11-22 22:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0004_alter_customuser_password"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="is_Premium",
            field=models.BooleanField(default=False),
        ),
    ]
