from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from not_app.serializers.notification_serializer import NotificationSerializer
from not_app.repositories.notification_repository import NotificationRepository

class NotificationCreateView(APIView):
    @swagger_auto_schema(
        request_body=NotificationSerializer,
        responses={201: NotificationSerializer}
    )
    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            notification = NotificationRepository.create_notification(serializer.validated_data)
            return Response(NotificationSerializer(notification).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NotificationListView(APIView):
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('user_id', openapi.IN_QUERY, description="User ID", type=openapi.TYPE_INTEGER),
            openapi.Parameter('user_role', openapi.IN_QUERY, description="User role (customer/provider)", type=openapi.TYPE_STRING),
        ],
        responses={200: NotificationSerializer(many=True)}
    )
    def get(self, request):
        user_id = request.query_params.get('user_id')
        user_role = request.query_params.get('user_role')

        if not user_id or not user_role:
            return Response({"detail": "user_id and user_role are required."}, status=400)

        notifications = NotificationRepository.get_notifications_for_user(user_id, user_role)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=200)