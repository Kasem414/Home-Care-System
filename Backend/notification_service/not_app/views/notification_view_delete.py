from rest_framework.views import APIView
from not_app.models import Notification
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from not_app.repositories.notification_repository import NotificationRepository


class NotificationDeleteView(APIView):

    @swagger_auto_schema(
        operation_description="Delete a notification by ID.",
        responses={
            200: openapi.Response(
                description="Notification deleted successfully.",
                examples={"application/json": {"message": "Notification deleted successfully."}}
            ),
            404: openapi.Response(description="Notification not found.")
        }
    )
    def delete(self, request,pk):
            success = NotificationRepository.delete_notification(notification_id=pk)
            if success:
                return Response({
                    "message": "Notification deleted successfully."
                }, status=status.HTTP_200_OK)
            return Response({
                "message": "Notification not found."
            }, status=status.HTTP_404_NOT_FOUND)