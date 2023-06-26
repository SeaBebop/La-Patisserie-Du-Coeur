from checkout import views
from django.urls import path
from .views import Customer


urlpatterns = [
    path('manage-customer/' , Customer.as_view()),
]