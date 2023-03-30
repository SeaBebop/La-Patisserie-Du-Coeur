from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import UserViewSet, ShopViewSet,MyTokenObtainPairView, OrderViewSet,CartViewSet

router = SimpleRouter()
router.register("users", UserViewSet, basename="users")
router.register("shop", ShopViewSet, basename="shop")
router.register("order",OrderViewSet,basename='order')
router.register("cart",CartViewSet,basename='cart')
urlpatterns = router.urls
