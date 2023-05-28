from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.shortcuts import redirect
from django_project.settings import FRONTEND_CHECKOUT_SUCCESS_URL,FRONTEND_CHECKOUT_FAILED_URL
from post.serializer import CartSerializer
import stripe 
from post.models import Cart,Product

# Create your views here.

class CreateCheckoutSession(APIView):
    
    
    def post(self,request,*args,**kwargs):
        counter = 0
        line_items = []
        cart = Cart.objects.filter(user=request.user).values_list('orders__item',flat=True)
        item = Cart.objects.filter(user=request.user).values_list('orders__quantity',flat=True)
        for cart_items in cart:
            
            line_items.append(
                {
                 'price_data' : {
                      'currency': 'usd',
                        'unit_amount':  str(Product.objects.filter(id=cart_items).values_list('price',flat=True)[0]),
                'product_data': {
                    'name': Product.objects.filter(id=cart_items).values_list('name',flat=True)[0],
                },
                },
                'quantity': item[counter],
                    })
            counter+=1

        if request.user.is_authenticated:
            
            print(line_items)
        
        try:
            
            checkout_session = stripe.checkout.Session.create(
                        line_items=line_items,
                metadata={
                    "cart_id":request.user
                },
                        mode='payment',
                        success_url=FRONTEND_CHECKOUT_SUCCESS_URL,
                        cancel_url=FRONTEND_CHECKOUT_FAILED_URL,
                    )


            


            return redirect(checkout_session.url, code=303)
        except Exception as e:
            print(e)      
            
            return Response('Negation')
      