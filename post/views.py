from django.contrib.sessions.backends.db import SessionStore
from django.shortcuts import render,get_object_or_404
from rest_framework import generics
from .permission import IsAdminOrReadOnly,IsPremiumOnly
from .serializer import PostSerializer,UserSerializer,OrderItemSerializer,CartSerializer
from rest_framework.permissions import IsAdminUser,AllowAny# new,
from django.http import HttpResponse
from rest_framework import viewsets
from django.contrib.auth import get_user_model
from .models import Category,Product, OrderItem,Cart
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from rest_framework import status
from django.conf import settings

# Create your views here.

class ShopViewSet(viewsets.ModelViewSet): # new
    permission_classes = [AllowAny]
    queryset = Product.objects.all().order_by('category')
    serializer_class = PostSerializer
    lookup_field = 'slug'
class UserViewSet(viewsets.ModelViewSet): # new
    permission_classes = [IsAdminUser]
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()
    permission_classes = [AllowAny]
    

    def create(self, request, *args, **kwargs):
            """if request.user.is_authenticated():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)"""

            #Creates an order if not created, gets an order if created
            if(request.user.is_authenticated):
                productObject = get_object_or_404(Product,id=request.POST['item'])
                order_item, created = OrderItem.objects.get_or_create(
                        user=request.user,
                        item = productObject
                        
                    )
                #Condition to add quantity
                #Need to transform this with an error validation 
                if OrderItem.objects.filter(user=request.user,item=productObject).exists():
                    if(int(request.POST['quantity']) <= productObject.quantity):
                        order_item.quantity = int(request.POST['quantity'])
                        order_item.save()
                    else:
                        print('ERROR!')
                else:
                    order_item.quantity = int(request.POST['quantity'])
                    order_item.save()
                
                userCart = Cart.objects.get_or_create(
                    user = request.user,
                    orders = order_item 
                )
            else:
                

                shop = SessionStore()
                if 'cart' not in request.session:
                    shop['cart'] = 'sadas'
                    shop.create()

                    productObject = get_object_or_404(Product,id=request.POST['item'])
                    order_item, created = OrderItem.objects.get_or_create(
                            user=None,
                            item = productObject, 
                            session_key = shop.session_key
                        )
                    if OrderItem.objects.filter(user=None,item=productObject,session_key = shop.session_key).exists():
                        if(int(request.POST['quantity']) <= productObject.quantity):
                            order_item.quantity = int(request.POST['quantity'])
                            order_item.save()
                        else:
                            print('ERROR!')
                    else:
                        order_item.quantity = int(request.POST['quantity'])
                        order_item.save()
                    
                    userCart = Cart.objects.get_or_create(
                        user = None,
                        orders = order_item,
                        session_key = shop.session_key
                    )   
                else:
                    print('did not have a key')
                    key = request.session_key
                    productObject = get_object_or_404(Product,id=request.POST['item'])
                    order_item, created = OrderItem.objects.get_or_create(
                            user=None,
                            item = productObject, 
                            session_key = key
                        )
                    if OrderItem.objects.filter(user=None,item=productObject,session_key = key).exists():
                        if(int(request.POST['quantity']) <= productObject.quantity):
                            order_item.quantity = int(request.POST['quantity'])
                            order_item.save()
                        else:
                            print('ERROR!')
                    else:
                        order_item.quantity = int(request.POST['quantity'])
                        order_item.save()
                    
                    userCart = Cart.objects.get_or_create(
                        user = None,
                        orders = order_item,
                        session_key = key
                    )   
                    


            return Response()
        

                



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['roles'] = user.roles
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer