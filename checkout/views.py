from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import F
from rest_framework import authentication, permissions
from django.shortcuts import  get_object_or_404
from django_project.settings import FRONTEND_CHECKOUT_SUCCESS_URL,FRONTEND_CHECKOUT_FAILED_URL
from post.serializer import CartSerializer
import stripe 
from rest_framework import status
from environs import Env
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import jwt
from django_project import settings
from django.contrib.sessions.models import Session
import json 
from post.models import OrderItem ,Cart, Product
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.template import loader
from pathlib import Path
import datetime
from django.http import HttpResponseRedirect
from django.urls import reverse
from post.serializer import PostSerializer

BASE_DIR = Path(__file__).resolve().parent.parent
# Create your views here.
env = Env()
env.read_env()
stripe.api_key = env("DOCKER_STRIPE")
endpoint_secret = env('DOCKER_ENDPOINT_SK')

class Webhook(APIView):
    def post(self,request):
        payload = request.body


        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None

        try:
            event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            # Invalid payload
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return HttpResponse(status=400)
        # Handle the checkout.session.completed event
        # Handle the checkout.session.completed event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']

            #print('this is triggered', session)

            # Save an order in your database, marked as 'awaiting payment'
            create_order(session)

            # Check if the order is already paid (for example, from a card payment)
            #
            # A delayed notification payment will have an `unpaid` status, as
            # you're still waiting for funds to be transferred from the customer's
            # account.
            if session.payment_status == "paid":
            # Fulfill the purchase
   
                try:
                    fulfill_order(session)
                except Exception as e:
                    Response(e,status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif event['type'] == 'checkout.session.async_payment_succeeded':
            session = event['data']['object']

            # Fulfill the purchase
            try:

                fulfill_order(session)
            except Exception as e:
                Response(e,status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif event['type'] == 'checkout.session.async_payment_failed':
            session = event['data']['object']

            # Send an email to the customer asking them to retry their order
            email_customer_about_failed_payment(session)
                

        # Passed signature verification
        return HttpResponse(status=200)

def fulfill_order(session):
    # TODO: fill me in
    #Will use this to delete the cart info

    checkoutID = session['id']
    customerInfo = stripe.checkout.Session.retrieve(checkoutID)

    metadata = customerInfo
    customerInfo = metadata['metadata']['userInfo']
    loggedInInfo = metadata['metadata']['loggedIn']

     
    if loggedInInfo ==  'True':

            OrderItem.objects.filter(user=int(customerInfo)).delete()
            Cart.objects.filter(user=int(customerInfo)).delete()

    else:
            OrderItem.objects.filter(session_key=customerInfo).delete()
            Cart.objects.filter(session_key=customerInfo).delete()

    print('here is')
    customerEmail = session['customer_details']['email']
    customerName = session['customer_details']['name']
    paymentAmount = session['amount_total'] * .01
    currencyUsed = session['currency']
    paymentID = session['payment_intent'] 
    customerID = session['customer']

    paymentData = stripe.Charge.list(customer=customerID, payment_intent=paymentID)

    paymentReceipt = paymentData['data'][0]['receipt_url']
    paymentDate = paymentData['data'][0]['created']
    #Deleting Product on the servers
    #Data is saved in stripe as a customer
   
    #Email Making
    html_message = loader.render_to_string(
        'email_order_success.html',
        {
            'name' : customerName,
            'email' : customerEmail,
            'paymentID' : paymentID,
            'website' : 'La Patisserie Du Coeur',
            'payment' : '{:.2f}'.format(paymentAmount),
            'receipt' : paymentReceipt,
            'date'  : str(datetime.datetime.fromtimestamp(paymentDate,None))[:11],


        }
    )
    #Reduce product
    try:
        id_list = [int (x) for x in metadata['metadata']['product'].split(',')]
        quantities_to_reduce =  [ int(x) for x in metadata['metadata']['product_quantity'].split(',')]
    except Exception as e:
        print(e)    
    length = len(id_list)
    print("list",quantities_to_reduce, 'list2',id_list)
    try:
        #Did all of this to see where the error is for updating the product.
        #The error is that quantity to reduce was a string which i wasnt aware of
        #In production i would remove this but in development i will keep it to remember what i learned
        for x in range(length):
            print(x,":", id_list[x])
            productInstance = Product.objects.get(id=id_list[x])
            
            try:
                productInstanceValue = int(productInstance.quantity)
                print(productInstanceValue)
                print(quantities_to_reduce[x])
                math = int(productInstance.quantity) - int(quantities_to_reduce[x])
                print(math)
            except Exception as e:
                print('Math aint mathing:', e)
            if math <= 0:
                updateDict = {
                        'name': productInstance.name, 
                        'category': productInstance.category, 
                        'slug': productInstance.slug, 
                        'price': productInstance.price, 
                        "quantity" : 0
                    }
            else:
                updateDict = {
                        'name': productInstance.name, 
                        'category': productInstance.category,
                        'slug': productInstance.slug,
                        'price': productInstance.price, 
                        "quantity" : math
                    }
            try:
                serializer = PostSerializer(instance=productInstance,data=updateDict)
            except Exception as e:
                print("serializer aint gonn let it up", e)
            try:
                if serializer.is_valid():

                    serializer.update(productInstance,serializer.validated_data)
                    print("Success!")
                else:
                    print('Failure!')
                    print("Invalid data:", serializer.errors)
            except Exception as e:
                print("everything above is fine",e)
    except Exception as e:
        print("Failed", e)
    send_mail(subject='Receipt From La Patisserie Du Coeur',message='',from_email= settings.DEFAULT_FROM_EMAIL,recipient_list= [customerEmail],html_message=html_message)




def create_order(session):
  # TODO: fill me in
  print("Creating order")

def email_customer_about_failed_payment(session):
  # TODO: fill me in
    checkoutID = session['id']

    metadata = customerInfo
    customerInfo = metadata['metadata']['userInfo']
    loggedInInfo = metadata['metadata']['loggedIn']
    customerEmail = session['customer_details']['email']
    paymentAmount = session['amount_total'] * .01
    customerName = session['customer_details']['name']
    html_message = loader.render_to_string(
        'email_order_failure.html',
        {
            'name' : customerName,
            'email' : customerEmail,
            'website' : 'La Patisserie Du Coeur',
            'payment' : '{:.2f}'.format(paymentAmount),

        }
    )
    send_mail(subject='Failed Purchase:La Patisserie Du Coeur',message='',from_email= settings.DEFAULT_FROM_EMAIL,recipient_list= [customerEmail],html_message=html_message)

class CreateCheckoutSession(APIView):
    

    def get(self,request,*args,**kwargs):
        #change this
        charge = stripe.checkout.Session.list(customer='') #Change this
        return Response(charge)
              
    def post(self,request,*args,**kwargs): 
        #Setting up a cart of products
        counter = 0
        line_items = []
        cart = None
        item = None
        customerID = None
        userData = None
        loggedIn = False

        passInInfo = None
        passInProduct = []
        passInQuantity = []
        try:
            #Trying to decode on the backend more for security purposes
            #Created a solution for redirecting with a post
            #print(self.request.session.session_key)<-this doesn't work

            #So I passed on hidden inputs of the user data which contains:
            #Who they are, if they are logged in, their stripe customer ID
            #With this data I make checkout 

            if request.data['userID'] != '':

                loggedIn = True
                userData = jwt.decode(str(request.data['userID']),key=settings.SECRET_KEY,algorithms=["HS256"])
                #This used to be costumerID = userData['customer_id']
                #Problem was that access tokens doesn't automatically change whatever data they have, even on refresh token
                #Unless the user logs out, honestly dont understand how it works fully but this below was the alternative
                #This actually ended up being better and gave me new ideas
                customerID = get_user_model().objects.filter(id=userData['user_id']).values_list('customer_id',flat=True)
                customerID = customerID[0]
            
            
            if request.data['userID'] != '':
                user = Cart.objects.filter(user=userData['user_id'])
                
                cart = user.values_list('orders__item',flat=True)
                item = user.values_list('orders__quantity',flat=True)


            if request.data['userID'] == '' and request.data['sessionKey'] != '': 
                #print('this triggered')
                sessionUser = Cart.objects.filter(session_key=request.data['sessionKey'])

                cart = sessionUser.values_list('orders__item',flat=True)
                item = sessionUser.values_list('orders__quantity',flat=True)
                customerID = Session.objects.get(pk=request.data['sessionKey'])
                customerID = customerID.get_decoded()
                customerID = customerID[str(request.data['sessionKey'])]
        
                
            for cart_items in cart:
                
                line_items.append(
                    {
                    'price_data' : {
                        'currency': 'usd',
                        #Strip interestingly set up prices as ints, so 7.00 is 7.00* 100= 700 
                            'unit_amount':  int(Product.objects.filter(id=cart_items).values_list('price',flat=True)[0] * 100),
                    'product_data': {
                        'name': Product.objects.filter(id=cart_items).values_list('name',flat=True)[0],
                    },
                    },
                    'quantity': item[counter],
                        })
                passInProduct.append(cart_items)
                passInQuantity.append( item[counter])
                counter+=1
    
            if line_items == []:
                return Response('Error!',status.HTTP_500_INTERNAL_SERVER_ERROR)
            #Creating a dict of product data to pass on data to the payment intent
            #This idea failed, lead there was a 500 character limit
            #counter = 0
            #print('this is line items',line_items)
            """        
                for product in line_items:
                tmp = {str(counter) : product['product_data']}
                itemDict.update(tmp)
                counter+=1"""
            #print('This is dict of items',itemDict)

            #itemDict = dict(zip(cart,item))

            #Instead of doing what is above I realized
            #Using user customerID i can get PaymentIntent->CheckoutData->LineItems
            #Perfect for purchase history
            #Using Charge I should get the reciept for the user
        except Exception as e:
            return Response(e,status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            if loggedIn:
                passInInfo = int(userData['user_id'])
                
            else:
                passInInfo = request.data['sessionKey']
            #print(passInInfo)
            checkout_session = stripe.checkout.Session.create(
                #So I know who they are for webhook purposes
                metadata={
                    "userInfo":passInInfo,
                    #Will use a delimiter to convert this into a list again
                    "product_quantity" : str(passInQuantity)[1:-1].replace(" ", ""),
                    "product": str(passInProduct)[1:-1].replace(" ", ""),
                    "loggedIn" : loggedIn,
                },
                        
                        
                        line_items=line_items,
                        customer = customerID,
                        mode='payment',
                        #So I can document more info on what the products are 
                    
                        success_url=FRONTEND_CHECKOUT_SUCCESS_URL,
                        cancel_url=FRONTEND_CHECKOUT_FAILED_URL,
                    )


            
            return HttpResponse(checkout_session.url)
        except Exception as e:
            print(e)
            return Response(e,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
      