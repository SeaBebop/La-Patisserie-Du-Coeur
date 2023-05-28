"""django_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include,re_path
from django.views.generic.base import TemplateView
from drf_spectacular.views import SpectacularAPIView , SpectacularRedocView ,SpectacularSwaggerView# new
from dj_rest_auth.registration.views import VerifyEmailView
from allauth.account.views import ConfirmEmailView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    #PASSWORD
    path("password-reset/confirm/<uidb64>/<token>/",
       TemplateView.as_view(template_name="password_reset_confirm.html"),
       name='password_reset_confirm'),
    #ADMIN
    path("admin/", admin.site.urls),

    #API
    path("api/v1/",include("post.urls")),
    path("api-auth/", include("rest_framework.urls")), # new
    path("api/v1/dj-rest-auth/", include("dj_rest_auth.urls")), # new
    path('api/v1/dj-rest-auth/registration/account-confirm-email/<str:key>/', ConfirmEmailView.as_view(), name='account_confirm_email'),
    path("api/v1/dj-rest-auth/registration/", # new
        include("dj_rest_auth.registration.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"), # new
    path("api/schema/redoc/", SpectacularRedocView.as_view(
    url_name="schema"), name="redoc",), # new
    path("api/schema/swagger-ui/", SpectacularSwaggerView.as_view(
url_name="schema"), name="swagger-ui"), # new
    #stripe
    path("api/v1/checkout/",include('checkout.urls'))
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)