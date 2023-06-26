from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser
from .form import CustomChangeForm, CustomCreationForm
# Register your models here.


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    add_form = CustomCreationForm
    form = CustomChangeForm
    list_display = [
        "email",
        "username",
        "name",
        "is_staff",
        'roles',


    ]
    fieldsets = UserAdmin.fieldsets + ((None, {"fields": ("name", 'roles')}),)
    add_fieldsets = UserAdmin.add_fieldsets + \
        ((None, {"fields": ("name", 'roles')}),)


admin.site.register(CustomUser, CustomUserAdmin)
