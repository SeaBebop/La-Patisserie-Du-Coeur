"""
Django settings for django_project project.

Generated by 'django-admin startproject' using Django 4.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings Wand their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""


from pathlib import Path
import os
from environs import Env
from datetime import timedelta
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
env = Env()
env.read_env()

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('DOCKER_KEY')
booleanDebug = env("DJANGO_DEBUG")
DEVELOPER_MODE = env("DEVELOPMENT")

if booleanDebug == "True":
    booleanDebug = True
else:
    booleanDebug = False
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = booleanDebug
if DEVELOPER_MODE == 'True':
    ALLOWED_HOSTS = [  "localhost:3000",  "127.0.0.1", "localhost:8000","localhost"]
else:
    ALLOWED_HOSTS = [   "lacoeurbakery.xyz"]


ACCOUNT_EMAIL_CONFIRMATION_COOLDOWN = 30
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
# Application definition
ACCOUNT_EMAIL_REQUIRED = 'True'
ACCOUNT_AUTHENTICATION_METHOD = 'username_email'
ACCOUNT_USERNAME_REQUIRED = 'False'
ACCOUNT_UNIQUE_EMAIL = True

AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    "django.contrib.auth.backends.ModelBackend",
    # `allauth` specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend"
)
 

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites", # new

    #Third
    "rest_framework",
    "corsheaders",
    "rest_framework.authtoken",
    "allauth", # new
    "allauth.account", # new
    "allauth.socialaccount", # new
    "dj_rest_auth",
    'rest_framework_simplejwt.token_blacklist',
    'rest_framework_jwt',
    #'django_inlinecss', somehow got an error some im not using it
    "dj_rest_auth.registration", # new
    "drf_spectacular", # new
    'celery',

    #Local
    "checkout.apps.CheckoutConfig",
    "accounts.apps.AccountsConfig",
    "post.apps.PostConfig",
    'customer.apps.CustomerConfig',
]

REST_AUTH_SERIALIZERS = {
'PASSWORD_RESET_SERIALIZER' : 'post.serializer.CustomPasswordResetSerializer',
'JWT_TOKEN_CLAIMS_SERIALIZER' : 'post.views.MyTokenObtainPairSerializer',
"USER_DETAILS_SERIALIZER" :'post.serializer.UserDetailsSerializer',
'LOGIN_SERIALIZER' : 'post.serializer.LoginSerializer',

}

REST_AUTH_REGISTER_SERIALIZERS  = {
    'REGISTER_SERIALIZER' : 'post.serializer.RegisterSerializer',
}

AUTH_USER_MODEL = "accounts.CustomUser" # new
REST_FRAMEWORK = { # new
"DEFAULT_PERMISSION_CLASSES": [
      
 


],
"DEFAULT_AUTHENTICATION_CLASSES": [
        'rest_framework.authentication.BasicAuthentication',
"rest_framework.authentication.SessionAuthentication",
"rest_framework.authentication.TokenAuthentication", # new
  'rest_framework_simplejwt.authentication.JWTAuthentication', 



],
"DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema", # new

}
JWT_AUTH_COOKIE_USE_CSRF = True
SPECTACULAR_SETTINGS = {
"TITLE": "Blog API Project",
"DESCRIPTION": "A sample blog to learn about DRF",
"VERSION": "1.0.0",
# OTHER SETTINGS
}
SWAGGER_SETTINGS = {
    'LOGIN_URL': 'login',
    'LOGOUT_URL': 'logout',
}

REST_USE_JWT = True
JWT_AUTH_COOKIE = 'Access'
JWT_AUTH_REFRESH_COOKIE = 'Refresh'

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware", # new
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'csp.middleware.CSPMiddleware',
    'accounts.middleware.MoveJWTCookieIntoTheBody',
    'accounts.middleware.MoveJWTRefreshCookieIntoTheBody',
]
# new
if DEVELOPER_MODE == "True":
    CORS_ALLOWED_ORIGINS  = (
    "https://checkout.stripe.com",
    "http://localhost:3000",
    "http://localhost:8000",
    "https://localhost:3000",
    "https://localhost:8000",
    "http://localhost:80",
    "http://localhost:8000",
    "http://web:8000",
    "https://web:8000",
    'localhost:80',
    )
else:
    CORS_ALLOWED_ORIGINS  = (
"https://checkout.stripe.com",
"http://localhost:3000",
"https://lacoeurbakery.xyz",
"http://lacoeurbakery.xyz",
"http://localhost:8000",
"https://localhost:3000",
"https://localhost:8000",
    )

if DEVELOPER_MODE == "True":
    CSRF_TRUSTED_ORIGINS = ["http://localhost:3000","http://localhost:8000","https://checkout.stripe","https://localhost:3000",
    "https://checkout.stripe.com",
    "http://localhost",'localhost',
    "https://localhost:8000",] # new
else:
    CSRF_TRUSTED_ORIGINS = ["http://localhost:3000","http://localhost:8000","https://checkout.stripe","https://localhost:3000",
    "https://checkout.stripe.com",
    "http://lacoeurbakery.xyz",
    "https://lacoeurbakery.xyz",
    "https://localhost:8000",] # new
SIMPLE_JWT = {
'AUTH_HEADER_TYPES': ('JWT',),

}
ROOT_URLCONF = "django_project.urls"
JWT_AUTH_SAMESITE = None
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / 'templates'],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "django.template.context_processors.request", # new

            ],
        },
    },
]

DEFAULT_FROM_EMAIL = env('DOCKER_DEFAULT_FROM_EMAIL')
EMAIL_FROM =  env('DOCKER_DEFAULT_FROM_EMAIL')
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend" # new
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_HOST_USER = 'apikey'
EMAIL_HOST_PASSWORD = env('DOCKER_EMAIL_HOST_PASSWORD')
EMAIL_PORT = 587


SITE_ID = 1 # new

WSGI_APPLICATION = "django_project.wsgi.application"

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=60),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer','JWT'),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}
# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DB_Name = env("DB_Name")
DB_User = "postgres"
DB_PASSWORD = env("DB_PASSWORD")
DB_Host = env("DB_Host")
DB_Port = env("DB_Port")
DATABASES =  {
    "default": {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': DB_Name, 
        'USER': DB_User,
        'PASSWORD': DB_PASSWORD,
        'HOST': DB_Host, 
        'PORT': int(DB_Port),
    }
}

CART_SESSION_ID = 'cart'

SESSION_SAVE_EVERY_REQUEST = True
SESSION_COOKIE_HTTPONLY = True 
SESSION_COOKIE_SAMESITE = 'None'

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]

#HTTPS
if DEVELOPER_MODE != "True":
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_SSL_REDIRECT = True
    CSRF_COOKIE_SECURE = True 
    SECURE_HSTS_PRELOAD = True 
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SESSION_COOKIE_SECURE = True
    CSP_HEADER = {
    'default-src': ("'self'",),
    'script-src': ("'self'", 'https://checkout.stripe.com'),}
else:
    SECURE_SSL_REDIRECT = False
    # Ensure that session and CSRF cookies are not limited to secure connections
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = False
#CSP



# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

#Stripe setup
STRIPE_SECRET_KEY = env('DOCKER_STRIPE')
if DEVELOPER_MODE == "True": 
    FRONTEND_CHECKOUT_SUCCESS_URL = 'http://localhost/cart/checkout/true/'
    FRONTEND_CHECKOUT_FAILED_URL = 'http://localhost/cart/checkout/false/'
else:
    FRONTEND_CHECKOUT_SUCCESS_URL = 'https://lacoeurbakery.xyz/cart/checkout/true/'
    FRONTEND_CHECKOUT_FAILED_URL = 'https://lacoeurbakery.xyz/cart/checkout/false/'
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'products/'


# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

