from checkout import views
from django.urls import path
from .views import Customer,CustomerPurchase,TransferData


urlpatterns = [
    path('manage-customer/' , Customer.as_view()),
    path('purchase-history/',CustomerPurchase.as_view()),
    path('transfer-data/',TransferData.as_view()),

]