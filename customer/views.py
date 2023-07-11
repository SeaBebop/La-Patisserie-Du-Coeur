from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import stripe
from rest_framework.permissions import IsAdminUser, AllowAny  # new,
from django.contrib.auth import get_user_model
from post.models import Product
from decimal import *
import datetime

# Create your views here.


class Customer(APIView):
    # Maybe create a permission for session user,admin and users only
    # Also making everything a response 200 OK doesn't make sense, need to change that
    permission_classes = [AllowAny]
    # Testing updating model from apiview
    # get_user_model().objects.filter(id=request.user.id).update(customer_id=None)<-Results in null which
    # means I can test with none conditions

    def post(self, request):
        # Generally idea
        # If there is a user and they dont have a customer id,(else) make one. If they do have a customer id,(return) dont make one
        # Else if there is a session user with no customer id,(else) make one. If they do have a customer id,(return) dont make one
        if request.user.is_authenticated:

            if request.user.customer_id == None:
                stripeCustomer = stripe.Customer.create(
                    description='API created authenticated user customer'
                )
                get_user_model().objects.filter(id=request.user.id).update(
                    customer_id=stripeCustomer.id)
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

    def get(self, request):
        # Default get
        stripeCustomer = None
        # General idea
        #
        if request.user.is_superuser:
            customerList = stripe.Customer.list()
            return Response(customerList)

        if request.user.is_authenticated:
            if request.user.customer_id is not None:
                value = get_user_model().objects.filter(
                    id=request.user.id).values_list('customer_id', flat=True)
                stripeCustomer = stripe.Customer.retrieve(value[0])
                return Response(stripeCustomer)
        elif request.session.session_key and not request.user.is_authenticated:
            if request.session[request.session.session_key] != '':
                stripeCustomer = stripe.Customer.retrieve(
                    request.session[request.session.session_key])
                return Response(stripeCustomer)
        else:
            return Response("No customer data found")


class CustomerPurchase(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        customerID = None
        paymentList = {}
        eachPaymentLineItem = []
        receiptData = []
        responseData = []
        if self.request.user.is_authenticated and self.request.user.customer_id != None:
            print('this is customer id', request.user.customer_id)
            customerID = request.user.customer_id
        elif (self.request.session.session_key and not self.request.user.is_authenticated
              and self.request.session[self.request.session.session_key] != ''):
            customerID = self.request.session[self.request.session.session_key]
        else:

            return Response('No customer data found or purchases have been made!')

        # Aligning the purchase history
        # There is probably a better way to align considering each of these arrays has a foreign key to it
        # However brute force first as always
        # receiptComprehension = [{'reciept' : d['receipt_url']} for d in  ]

        # Getting all the checkout per paymentIntentDetails
        """
        for payments in range(len(paymentIntentDetails)):
            paymentList.append(stripe.checkout.Session.list(
                payment_intent=paymentIntentDetails['data'][payments]['id']))
            receiptData.append(stripe.Charge.list(
                customer=customerID, payment_intent=paymentIntentDetails['data'][payments]['id']))
        for paymentItems in range(len(paymentList)):
            eachPaymentLineItem.append(
                stripe.checkout.Session.list_line_items(paymentList[paymentItems]['data'][0]['id']))

        for counter in range(len(paymentList)):
            responseData.append({'customerID': customerID, 'productsPurchased': eachPaymentLineItem[counter]['data'],
                                           'reciept': receiptData[counter]['data'][0]['receipt_url']})            
            """

        # Brute Force way takes 7 seconds to load, aint no way im using that AND its too confusing
        # I haven't used list comphrension in a long time
        # But wow it is very effective but perhaps unreadable compared to for loops
        #From 7000ms~ to 800ms~, great improvement
     
        paymentIntentDetails = stripe.checkout.Session.list(
            customer=customerID)
        paymentIntentDetails = paymentIntentDetails['data']

        # List comprehension think in terms of [the_result_you_want looping_through_original conditions/filters_if_any]
        
        paymentComprehension = [{'payment_intent': d['payment_intent'], 'customerID':d['customer'], 'checkoutID':d['id'], 'productsName': [Product.objects.filter(id=(int(x))).values_list('name', flat=True)[0] for x in d['metadata']['product'].split(',')],
                                 'productsPrice': ["%.2f" % round(float(Product.objects.filter(id=(int(x))).values_list('price', flat=True)[0]),2) for x in d['metadata']['product'].split(',')], 'productsQuantity':[int(x) for x in d['metadata']['product_quantity'].split(',')],
                                 'productImages': [ 'http://localhost:8000/products/'+ Product.objects.filter(id=(int(x))).values_list('image', flat=True)[0] for x in d['metadata']['product'].split(',')],
                                 'userInfo':  d['metadata']['userInfo'], 'amount_total': "%.2f" %  float(round(Decimal(0.01) * Decimal(d['amount_total']),2))} for d in paymentIntentDetails if d['payment_status'] == 'paid']
        paymentIntentDetails = [stripe.Charge.list(customer=customerID, payment_intent=d['payment_intent'])[
            'data'] for d in paymentComprehension]
        receiptComprehension = [{'reciept': d[0]['receipt_url'],'date' : str(datetime.datetime.fromtimestamp(d[0]['created'],None))[:11],
        'dateUnix' : int(str(datetime.datetime.fromtimestamp(d[0]['created'], datetime.timezone.utc).date().strftime("%s")))}
                                for d in paymentIntentDetails]
        
        #I want to remove strftime somehow, it is making the program slower
        #Have an idea to do the min and max bounds of the user here
        # This comprehension acts a function that combines both receiptComprehsion and paymentComprehension onto paymentComprehension
        # This is all the details I want to use for printing out checkouts of a user
        combiningComprehension = [paymentComprehension[d].update(
            receiptComprehension[d]) for d in range(len(paymentComprehension))]
            
        # Tried hard to make this work, it does but it is too slow and too complex, decided to instead pass in the product id from checkout
        #lineItemsComprehension = [{'name' : d[i]['description'],'quantity' :d[i]['quantity'], 'total_amount': d[i]['amount_total']} for d in lineItemsComprehension for i in range(len(d)) ]

        return Response(paymentComprehension)
