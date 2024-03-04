from django.contrib.sessions.backends.db import SessionStore
from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from .permission import IsAdminOrReadOnly, IsPremiumOnly
from .serializer import PostSerializer, UserSerializer, OrderItemSerializer, CartSerializer
from rest_framework.permissions import IsAdminUser, AllowAny  # new,
from django.http import HttpResponse
from rest_framework import viewsets
from django.contrib.auth import get_user_model
from .models import Category, Product, OrderItem, Cart
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from rest_framework import status
from itertools import chain
from django.conf import settings
import json
from customer.views import Customer
import stripe
from time import sleep

# Create your views here.


class ShopViewSet(viewsets.ModelViewSet):  # new
    permission_classes = [AllowAny]
    queryset = Product.objects.all().order_by('category')
    serializer_class = PostSerializer
    lookup_field = 'id'



class UserViewSet(viewsets.ModelViewSet):  # new
    permission_classes = [IsAdminUser]
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = CartSerializer

    # Adding condition of what type of carts you should see
    def get_queryset(self):
        # If its a non logged in user with a cart

        if self.request.session.session_key and self.request.user.is_authenticated == False:

            queryset = Cart.objects.filter(
                session_key=self.request.session.session_key)
            # Had an issue with editing the order viewset for the user
            # If I made a nested serializer it would create a situation where the user need to
            # upload data such as the product image etc just to get the product quantity
            # Instead im testing out the idea of sending "chain querysets"
            # Failed, trying serializer ideas instead
            # Serializer idea worked with get_product_quantity

            # print(OrderItem.objects.filter(session_key=self.request.session.session_key).values_list('item',flat=True))

            #my_list = list(OrderItem.objects.filter(session_key=self.request.session.session_key).values_list('item',flat=True))
            #print('this is my list:', my_list)
            #print('This is my product:',Product.objects.filter(id__in=my_list))
            #queryset2 = Product.objects.filter(id__in=my_list)

        # If its a logged in user with a cart
        elif self.request.user.is_authenticated == True:
            queryset = Cart.objects.filter(user=self.request.user)

        else:
            # If its a non logged in user with no cart
            queryset = None
            

        return queryset


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # This was created because the request.POST['item'],etc results in an empty dict
        # I have no idea as to why and it cost me 3 days of sleep
        # Request.body is a great alternative I that never knew existed that I will never forget

            form_data = dict(request.data)
            # Testing how to call a post of another view
            # Testing ways to reset customer data
            # get_user_model().objects.filter(id=request.user.id).update(customer_id=None)
            # stripe.Customer.delete("cus_O8wjW8UccIUUkS")
            # Customer.post(self,request)
            checkProduct = get_object_or_404(
                    Product, id=int(form_data['item']) )
            
            if(checkProduct.quantity < 1 or  int(form_data['quantity']) < 1):
                return Response("ERROR! Product is sold out or no quantity selected",status.HTTP_405_METHOD_NOT_ALLOWED)
            
            # The idea below was inspire by reading what the create doc says below
            """if request.user.is_authenticated():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)"""

            # Creates an order if not created, gets an order if created
            
            if (request.user.is_authenticated):
                productObject = get_object_or_404(
                    Product, id=int(form_data['item']))
                order_item, created = OrderItem.objects.get_or_create(
                    user=request.user,
                    item=productObject
                )

                # Condition to add quantity if the order already exist or not
                # Need to transform this with an error validation
                if OrderItem.objects.filter(user=request.user, item=productObject).exists():
                    if int(form_data['quantity']) + int(order_item.quantity) <= int(productObject.quantity):
                                order_item.quantity = int(form_data['quantity']) + int(order_item.quantity)
                                order_item.save()
                    else:
                        return Response("ERROR! Added order is above the product quantity. Current amount is " + str(order_item.quantity) +  "!",status.HTTP_405_METHOD_NOT_ALLOWED)

                else:
                    order_item.quantity = int(form_data['quantity'])
                    order_item.save()

                userCart = Cart.objects.get_or_create(
                    user=request.user,
                    orders=order_item
                )
                if request.user.customer_id is None:
                    sleep(0.05)
                    Customer.post(self, request)
                    
                    return Response(data='Customer object created!' + order_item.item.name + ' added to cart.Current Quantity:' + str(order_item.quantity),status=status.HTTP_201_CREATED)
                else:
                    return Response(data=order_item.item.name + ' added to cart.Current Quantity:' + str(order_item.quantity) ,status=status.HTTP_201_CREATED)

            else:

                if not request.session.session_key:
                    sessionid = request.session.create()
                    # The session key data will be used to check if they
                    # have a customer id or not
                    # By default it will be blank then reactjs will do a call
                    # to the customer view which will create customer for session user
                    # if session user data = '' else, do nothing
                    # idk if the best way but ima brute force the solution

                    request.session[request.session.session_key] = ''
                    session_key = request.session.session_key
                    productObject = get_object_or_404(
                        Product, id=int(form_data['item']))
                    order_item, created = OrderItem.objects.get_or_create(
                        user=None,
                        item=productObject,
                        session_key=session_key
                    )
                    if OrderItem.objects.filter(user=None, item=productObject, session_key=session_key).exists():
                        if int(form_data['quantity']) + order_item.quantity <= productObject.quantity:
                                order_item.quantity = int(form_data['quantity']) + int(order_item.quantity)
                                order_item.save()

                        else:
                            return Response("ERROR! Added order is above the product quantity. Current amount is " + str(order_item.quantity) +  "!",status.HTTP_405_METHOD_NOT_ALLOWED)
                    else:
                        order_item.quantity = int(form_data['quantity'])
                        order_item.save()

                    userCart = Cart.objects.get_or_create(
                        user=None,
                        orders=order_item,
                        session_key=session_key
                    )
                    if request.session[request.session.session_key] == '':
                        sleep(0.08)
                        try:
                            Customer.post(self, request)
                        except:
                            return Response('Server error on order creation!',status.HTTP_500_INTERNAL_SERVER_ERROR)
                        return Response(data='Customer object created!' + order_item.item.name + ' added to cart.Current Quantity:' + str(order_item.quantity),status=status.HTTP_201_CREATED)
                    else:
                        return Response(data=order_item.item.name + ' added to cart.Current Quantity:' + str(order_item.quantity) ,status=status.HTTP_201_CREATED)
                else:
                    session_key = request.session.session_key

                    productObject = get_object_or_404(
                        Product, id=int(form_data['item']))
                    order_item, created = OrderItem.objects.get_or_create(
                        user=None,
                        item=productObject,
                        session_key=session_key
                    )
                    if OrderItem.objects.filter(user=None, item=productObject, session_key=session_key).exists():
                        if int(form_data['quantity']) + order_item.quantity <= productObject.quantity:
                            try:
                                order_item.quantity = int(form_data['quantity']) + int(order_item.quantity)
                                order_item.save()
                            except Exception as e:
                                    print(e)
                        else:
                            return Response("ERROR! Added order is above the product quantity. Current amount is " + str(order_item.quantity) +  "!",status.HTTP_405_METHOD_NOT_ALLOWED)
                    else:
                        order_item.quantity = int(form_data['quantity'])
                        order_item.save()

                    userCart = Cart.objects.get_or_create(
                        user=None,
                        orders=order_item,
                        session_key=session_key
                    )
                    if request.session[request.session.session_key] == '':
                        sleep(0.05)
                        Customer.post(self, request)
                        return Response(data='Customer object created!' + order_item.item.name + ' added to cart.Current Quantity:' + str(order_item.quantity),status=status.HTTP_201_CREATED)
                    else:
                        return Response(data=order_item.item.name + ' added to cart.Current Quantity:' + str(order_item.quantity) ,status=status.HTTP_201_CREATED)


 
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['roles'] = user.roles
        token['id'] = user.id
        token['customer'] = user.customer_id
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
