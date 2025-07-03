from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class profileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id')
    class Meta:
        model = Profile
        fields = ('id', 'username', 'email', 'full_name','profile_picture')

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_profile = profileSerializer(read_only=True)
    receiver_profile = profileSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id','user','sender_profile','sender','receiver', 'receiver_profile', 'message', 'is_seen', 'date']

