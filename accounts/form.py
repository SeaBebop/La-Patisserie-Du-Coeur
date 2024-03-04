from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomChangeForm(UserChangeForm):
    class Meta:
        fields = UserChangeForm.Meta.fields 
        model = CustomUser 

class CustomCreationForm(UserCreationForm):
    class Meta:
        fields = UserCreationForm.Meta.fields + ("name",'roles')
        model = CustomUser 
