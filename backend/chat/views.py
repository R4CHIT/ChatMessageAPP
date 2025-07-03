from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from .models import*
from .serializers import*
from django.db.models import Subquery,Q,OuterRef

# Create your views here.
class MyInbox(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        # Get unique user pairs where this user is involved
        other_users = User.objects.exclude(id=user_id)

        latest_messages = ChatMessage.objects.filter(
            Q(sender=OuterRef('pk'), receiver=user_id) |
            Q(sender=user_id, receiver=OuterRef('pk'))
        ).order_by('-id')

        return ChatMessage.objects.filter(
            id__in=Subquery(
                other_users.annotate(
                    last_msg_id=Subquery(latest_messages.values('id')[:1])
                ).values('last_msg_id')
            )
        ).order_by('-id')

    

class GetMessage(generics.ListAPIView):
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        sender_id = self.kwargs['sender_id']
        receiver_id = self.kwargs['receiver_id']

        return ChatMessage.objects.filter(
            sender__in=[sender_id, receiver_id],
            receiver__in=[sender_id, receiver_id]
        ).order_by('date')
    
class SendMessage(generics.CreateAPIView):
    serializer_class=ChatMessageSerializer

class Profiledetail(generics.RetrieveUpdateAPIView):
    serializer_class = profileSerializer
    queryset_classes=Profile.objects.all()
    permission_classes=[IsAuthenticated]

class SearchUser(generics.ListAPIView):
    serializer_class = profileSerializer
    queryset = Profile.objects.all()
    # permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        username = self.kwargs['username']
        print(f"Search username: {username}")
        logged_in_user = self.request.user

        users = Profile.objects.filter(
                Q(user__username__icontains=username) |
                Q(full_name__icontains=username) |
                Q(user__email__icontains=username)
        )
        if not users.exists():
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
