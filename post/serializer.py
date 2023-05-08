from django.db.models import Sum,F
from decimal import *
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.forms import SetPasswordForm, PasswordResetForm
from django.urls import exceptions as url_exceptions
from rest_framework import exceptions, serializers
from rest_framework.exceptions import ValidationError
from .models import Category,Product,OrderItem,Cart
from django_project import settings
try:
    from allauth.account import app_settings as allauth_settings
    from allauth.utils import (email_address_exists,
                               get_username_max_length)
    from allauth.account.adapter import get_adapter
    from allauth.account.utils import setup_user_email
    from allauth.socialaccount.helpers import complete_social_login
    from allauth.socialaccount.models import SocialAccount
    from allauth.socialaccount.providers.base import AuthProcess
except ImportError:
    raise ImportError("allauth needs to be added to INSTALLED_APPS.")

from .forms import CustomResetPasswordForm

UserModel = get_user_model()

class CategorySerialier(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name',)
class PostSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Product
        fields = ('name','category','description', 'slug', 'price',
        'quantity','image','id')
        lookup_field = 'id'
        extra_kwargs = {
            'url': {'lookup_field': 'id'}
        }
        
class OrderItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderItem
        fields = '__all__'
    def update(self, instance, validated_data):
        #idea from https://stackoverflow.com/questions/62847000/write-an-explicit-update-method-for-serializer
        #Solution to the problem: If you update a viewset with a nested serializer you need to customize
        #the update function
        
        #Made it so that it only changes the quantity and ordered so nothing malicious happens
        
        product_data = validated_data.pop('item')
        product = instance.item

        instance.quantity = validated_data.get('quantity',instance.quantity)
        instance.ordered = validated_data.get('ordered',instance.ordered)
        instance.session_key = instance.session_key
        instance.user = instance.user
        instance.save()

        #Product 
        product.name =  product.name
        product.category =  product.category
        product.description =  product.description
        product.slug =   product.slug 
        product.price =  product.price
        product.quantity =  product.quantity
        product.image =  product.image
        product.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("id","username","email",'roles')

class CartSerializer(serializers.ModelSerializer):
    #Nested Serializer
    orders = OrderItemSerializer()
    #Also learned how to make custom fields like this one
    order_price = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    product_quantity = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()
    product_category = serializers.SerializerMethodField()
    def get_product_quantity(self,instance):
        #print(instance.orders.item)
        #print(Product.objects.filter(name=instance.orders.item).values_list('quantity',flat=True))
        my_list = Product.objects.filter(name=instance.orders.item).values_list('quantity',flat=True)
        #print(my_list[0])
        return my_list[0]
    def get_product_name(self,instance):
        my_list = Product.objects.filter(name=instance.orders.item).values_list('name',flat=True)
        return my_list[0]
    def get_product_category(self,instance):
        my_list = Product.objects.filter(name=instance.orders.item).values_list('category',flat=True)
        return my_list[0]
    def get_product_image(self,instance):
        my_list = Product.objects.filter(name=instance.orders.item).values_list('image',flat=True)
        return 'http://localhost:8000/products/' + my_list[0]
    def get_order_price(self,instance):
        return '{0:.2f}'.format(instance.orders.item.price * instance.orders.quantity)
    def get_total_price(self,instance):
        #Experimented alot on how to do math inbetween models
        #Learned so much about serializers, views,context, and objects
        #sum = 0
        #filtered_cart = Cart.objects.filter(user=self.context['request'].user.id).values_list('id',flat=True)
        #for x in filtered_cart:
        #    print(Cart.objects.filter(id=x).values())

        if self.context['request'].user.is_authenticated:
           
            test = Cart.objects.filter(orders__user= self.context['request'].user.id).aggregate(
                total_price=Sum(F('orders__item__price') * F('orders__quantity')))
            #print(test['total_price'])
            sum = str(test['total_price'])
            return sum
        elif self.context['request'].session.session_key and self.context['request'].user.is_anonymous == True:
            test = Cart.objects.filter(session_key= self.context['request'].session.session_key).aggregate(
                total_price=Sum(F('orders__item__price') * F('orders__quantity')))
            #print(test['total_price'])
            sum = str(test['total_price'])
            return sum
    class Meta:
        model = Cart
        fields = '__all__'
        #Tried the code below to get data of foreign key
        #Ended up doxxing accounts during production
        #Then I learned what a nested Serializer was
        #depth = 1 

#Code below is minor edits to libraries, such as adding Regex to passwords etc
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=get_username_max_length(),
        min_length=allauth_settings.USERNAME_MIN_LENGTH,
        required=allauth_settings.USERNAME_REQUIRED
    )
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    password1 = serializers.RegexField('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%)])',max_length=25, min_length=7,style={'input_type':'password'})
    password2 = serializers.RegexField('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%)])',max_length=25, min_length=7,style={'input_type':'password'})

    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        return username

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    ("A user is already registered with this e-mail address."))
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(("The two password fields didn't match."))
        return data

    def custom_signup(self, request, user):
        pass

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', '')
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        self.custom_signup(request, user)
        setup_user_email(request, user, [])
        return user

class UserDetailsSerializer(serializers.ModelSerializer):
    """
    User model w/o password
    """

    @staticmethod
    def validate_username(username):
        if 'allauth.account' not in settings.INSTALLED_APPS:
            # We don't need to call the all-auth
            # username validator unless its installed
            return username

        from allauth.account.adapter import get_adapter
        username = get_adapter().clean_username(username)
        return username

    class Meta:
        extra_fields = []
        # see https://github.com/iMerica/dj-rest-auth/issues/181
        # UserModel.XYZ causing attribute error while importing other
        # classes from `serializers.py`. So, we need to check whether the auth model has
        # the attribute or not
        if hasattr(UserModel, 'USERNAME_FIELD'):
            extra_fields.append(UserModel.USERNAME_FIELD)
        if hasattr(UserModel, 'EMAIL_FIELD'):
            extra_fields.append(UserModel.EMAIL_FIELD)
        #Added Roles from the custom model
        if hasattr(UserModel, 'roles'):
            extra_fields.append('roles')
 
        model = UserModel
        fields = ('pk', *extra_fields)
        read_only_fields = ('email',)

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(style={'input_type': 'password'})

    def authenticate(self, **kwargs):
        return authenticate(self.context['request'], **kwargs)

    def _validate_email(self, email, password):
        if email and password:
            user = self.authenticate(email=email, password=password)
        else:
            msg = ('Must include "email" and "password".')
            raise exceptions.ValidationError(msg)

        return user

    def _validate_username(self, username, password):
        if username and password:
            user = self.authenticate(username=username, password=password)
        else:
            msg = ('Must include "username" and "password".')
            raise exceptions.ValidationError(msg)

        return user

    def _validate_username_email(self, username, email, password):
        if email and password:
            user = self.authenticate(email=email, password=password)
        elif username and password:
            user = self.authenticate(username=username, password=password)
        else:
            msg = ('Must include either "username" or "email" and "password".')
            raise exceptions.ValidationError(msg)

        return user

    def get_auth_user_using_allauth(self, username, email, password):
        from allauth.account import app_settings

        # Authentication through email
        if app_settings.AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.EMAIL:
            return self._validate_email(email, password)

        # Authentication through username
        if app_settings.AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.USERNAME:
            return self._validate_username(username, password)

        # Authentication through either username or email
        return self._validate_username_email(username, email, password)

    def get_auth_user_using_orm(self, username, email, password):
        if email:
            try:
                username = UserModel.objects.get(email__iexact=email).get_username()
            except UserModel.DoesNotExist:
                pass

        if username:
            return self._validate_username_email(username, '', password)

        return None

    def get_auth_user(self, username, email, password):
        """
        Retrieve the auth user from given POST payload by using
        either `allauth` auth scheme or bare Django auth scheme.

        Returns the authenticated user instance if credentials are correct,
        else `None` will be returned
        """
        if 'allauth' in settings.INSTALLED_APPS:

            # When `is_active` of a user is set to False, allauth tries to return template html
            # which does not exist. This is the solution for it. See issue #264.
            try:
                return self.get_auth_user_using_allauth(username, email, password)
            except url_exceptions.NoReverseMatch:
                msg = ('Please check that your e-mail/username and password are correct.')
                raise exceptions.ValidationError(msg)
        return self.get_auth_user_using_orm(username, email, password)

    @staticmethod
    def validate_auth_user_status(user):
        if not user.is_active:
            msg = ('User account is disabled.')
            raise exceptions.ValidationError(msg)

    @staticmethod
    def validate_email_verification_status(user):
        from allauth.account import app_settings
        if (
            app_settings.EMAIL_VERIFICATION == app_settings.EmailVerificationMethod.MANDATORY
            and not user.emailaddress_set.filter(email=user.email, verified=True).exists()
        ):
            raise serializers.ValidationError(('E-mail is not verified.'))

    def validate(self, attrs):
        username = attrs.get('username')
        email = attrs.get('email')
        password = attrs.get('password')
        user = self.get_auth_user(username, email, password)

        if not user:
            msg = ('Please check that your e-mail/username and password are correct.')
            raise exceptions.ValidationError(msg)

        # Did we get back an active user?
        self.validate_auth_user_status(user)

        # If required, is the email verified?
        if 'dj_rest_auth.registration' in settings.INSTALLED_APPS:
            self.validate_email_verification_status(user)

        attrs['user'] = user
        return attrs

# serializers.py
from dj_rest_auth.serializers import PasswordResetSerializer

class CustomPasswordResetSerializer(PasswordResetSerializer):
    
    password_reset_form_class = CustomResetPasswordForm
