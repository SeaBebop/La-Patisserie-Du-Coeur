from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import stripe
from rest_framework.permissions import IsAdminUser,AllowAny# new,
from django.contrib.auth import get_user_model


# Create your views here.
class Customer(APIView):
    #Maybe create a permission for session user,admin and users only
    #Also making everything a response 200 OK doesn't make sense, need to change that
    permission_classes = [AllowAny]
            #Testing updating model from apiview
            #get_user_model().objects.filter(id=request.user.id).update(customer_id=None)<-Results in null which
            #means I can test with none conditions
    def post(self,request):
        #Generally idea
        #If there is a user and they dont have a customer id,(else) make one. If they do have a customer id,(return) dont make one
        #Else if there is a session user with no customer id,(else) make one. If they do have a customer id,(return) dont make one
        if request.user.is_authenticated:

            if request.user.customer_id == None:
                stripeCustomer = stripe.Customer.create(
                    description= 'API created authenticated user customer'
                )
                get_user_model().objects.filter(id=request.user.id).update(customer_id=stripeCustomer.id)
            else:
                return Response('Customer object was not created')
                
        elif request.session.session_key and not request.user.is_authenticated:
            if request.session[request.session.session_key] == '':
                stripeCustomer = stripe.Customer.create(
                    description='API created session customer'
                )
                request.session[request.session.session_key] = stripeCustomer.id
            else:
                return Response('Session user Customer object was not created')
        else: 
            return Response('Customer object was not created')
        return Response('Customer object already exists')
    def get(self,request):
        #Default get
        stripeCustomer = None
        #General idea 
        #
        if request.user.is_superuser:
            customerList = stripe.Customer.list()
            return Response(customerList)

        if request.user.is_authenticated:
            if request.user.customer_id is not None:
                value = get_user_model().objects.filter(id=request.user.id).values_list('customer_id',flat=True)
                stripeCustomer = stripe.Customer.retrieve(value[0])
                return Response(stripeCustomer)
        elif request.session.session_key and not request.user.is_authenticated:
            if request.session[request.session.session_key] != '':
                stripeCustomer = stripe.Customer.retrieve(request.session[request.session.session_key])
                return Response(stripeCustomer)
        else:
            return Response("No customer data found")
        


