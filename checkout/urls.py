from checkout import views
from django.urls import path
from .views import *


urlpatterns = [
    path('create-checkout-session/' , views.CreateCheckoutSession.as_view()),  
]