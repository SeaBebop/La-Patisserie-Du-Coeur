from checkout import views
from django.urls import path
from .views import *


urlpatterns = [
    path('create-checkout-session/' , views.CreateCheckoutSession.as_view()),
    #I forgot that as_view() isn't for function views  
    path('webhook/stripe/',views.Webhook.as_view()),
]