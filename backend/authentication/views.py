
from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .permissions import HasRole
from rest_framework.permissions import IsAuthenticated as Isauthenticated

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permisssion_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class loginView(generics.GenericAPIView):
    serializer_class=LoginSerializer
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)
            return Response({
                'refresh':str(refresh),
                'access':str(refresh.access_token),
                'user':user_serializer.data
            })
        else:
            return Response({
                'error':'Invalid Credentials'
            },status=401)
        


class DashboardView(generics.RetrieveAPIView):
    permission_classes = (Isauthenticated,)
    
    def get(self , request):
        user = request.user
        user_serializer = UserSerializer(user)
        return Response({
            'message':'Welcome to the dashboard',
            'user':user_serializer.data
        },200)
    

