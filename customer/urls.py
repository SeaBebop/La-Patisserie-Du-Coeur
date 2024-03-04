from checkout import views
from django.urls import path
from .views import Customer,CustomerPurchase,TransferData


urlpatterns = [
    path('manage-customer/' , Customer.as_view(),name='manage-customer'),
    path('purchase-history/',CustomerPurchase.as_view(),name='purchase-history'),
    path('transfer-data/',TransferData.as_view(),name='transfer-data'),

]