"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path
from django.contrib import admin
from django.urls import path
from authentication.views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static
from chat.views import *

urlpatterns = [
   path('admin/', admin.site.urls),
    path('api/auth/register/', RegisterView.as_view(), name='auth_register_'),
    path('api/auth/login/', loginView.as_view(), name='auth_login_'),
    path('api/auth/dashboard/', DashboardView.as_view(), name='auth_dashboard_'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    #chat

    path('api/mychat/<int:user_id>/',MyInbox.as_view(),name="myInbox"),
    path('api/get-message/<int:sender_id>/<int:receiver_id>/',GetMessage.as_view(),name="myInbox"),
    path('api/send-message/',SendMessage.as_view(),name="Send-Message"),

    #UserProfile

    path("api/profile/<int:pk>",Profiledetail.as_view(),name="Profile-detail"),
    path("api/searchuser/<str:username>/",SearchUser.as_view(),name="Search-User"),
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
