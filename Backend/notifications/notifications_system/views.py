from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .services import NotificationService
from .serializers import NotificationSerializer
from .models import Notification

class MyNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notes = NotificationService.get_my_notifications(request.user)
        serializer = NotificationSerializer(notes, many=True)
        return Response(serializer.data)

class SendNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.data.get('user_id')
        note = request.data.get('note')
        note_type = request.data.get('type')

        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        notification = NotificationService.send_notification(target_user, note, note_type)
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class NotificationsByUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        notifications = NotificationService.get_notifications_by_user(target_user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

class ChangeNotificationStateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, note_id):
        new_state = request.data.get('state')
        if new_state not in [s[0] for s in Notification.NotificationState.choices]:
            return Response({"error": "Invalid state."}, status=status.HTTP_400_BAD_REQUEST)

        updated_note = NotificationService.change_notification_state(request.user, note_id, new_state)
        if not updated_note:
            return Response({"error": "Notification not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

        serializer = NotificationSerializer(updated_note)
        return Response(serializer.data)