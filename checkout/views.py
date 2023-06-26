from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.shortcuts import redirect
from django_project.settings import FRONTEND_CHECKOUT_SUCCESS_URL,FRONTEND_CHECKOUT_FAILED_URL
from post.serializer import CartSerializer
import stripe 
from environs import Env
from post.models import Cart,Product
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import jwt
from django_project import settings
from django.contrib.sessions.models import Session

# Create your views here.
env = Env()
env.read_env()
stripe.api_key = env("DOCKER_STRIPE")
endpoint_secret = env('DOCKER_ENDPOINT_SK')

class Webhook(APIView):
    def post(self,request):
        payload = request.body
        print('This is payload',payload)
        print('')
        
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

            print('this is user', self.request.user)

            # Save an order in your database, marked as 'awaiting payment'
            create_order(session)

            # Check if the order is already paid (for example, from a card payment)
            #
            # A delayed notification payment will have an `unpaid` status, as
            # you're still waiting for funds to be transferred from the customer's
            # account.
            if session.payment_status == "paid":
            # Fulfill the purchase
                fulfill_order(session)

        elif event['type'] == 'checkout.session.async_payment_succeeded':
            session = event['data']['object']

            # Fulfill the purchase
            fulfill_order(session)

        elif event['type'] == 'checkout.session.async_payment_failed':
            session = event['data']['object']

            # Send an email to the customer asking them to retry their order
            email_customer_about_failed_payment(session)
                

        # Passed signature verification
        return HttpResponse(status=200)

def fulfill_order(session):
  # TODO: fill me in
  print("Fulfilling order")

def create_order(session):
  # TODO: fill me in
  print("Creating order")

def email_customer_about_failed_payment(session):
  # TODO: fill me in
  print("Emailing customer")

class CreateCheckoutSession(APIView):
    
    def get(self,request,*args,**kwargs):

            return Response('')
        
    def post(self,request,*args,**kwargs): 
        #Setting up a cart of products
        counter = 0
        line_items = []
        cart = None
        item = None
        customerID = None
        userData = None
        #Trying to decode on the backend more for security purposes
        #Created a solution for redirecting with a post

        print(self.request.session.session_key)
        if request.data['userID'] != '':
            print('this shouldnt')
            userData = jwt.decode(str(request.data['userID']),key=settings.SECRET_KEY,algorithms=["HS256"])
            customerID = userData['customer']
        
        
        if request.data['userID'] != '':
            cart = Cart.objects.filter(user=userData['user_id']).values_list('orders__item',flat=True)
            item = Cart.objects.filter(user=userData['user_id']).values_list('orders__quantity',flat=True)

            customerID = customerID
        if request.data['userID'] == '' and request.data['sessionKey'] != '': 
            print('this triggered')
            cart = Cart.objects.filter(session_key=request.data['sessionKey']).values_list('orders__item',flat=True)
            item = Cart.objects.filter(session_key=request.data['sessionKey']).values_list('orders__quantity',flat=True)
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
            counter+=1


            
        print(line_items)
        
        try:
            
            checkout_session = stripe.checkout.Session.create(
                        line_items=line_items,
                        customer = customerID,
                        mode='payment',
                        success_url=FRONTEND_CHECKOUT_SUCCESS_URL,
                        cancel_url=FRONTEND_CHECKOUT_FAILED_URL,
                    )


            
            
            return redirect(checkout_session.url, code=303)
        except Exception as e:
            print(e)      
        return Response('')
           
      