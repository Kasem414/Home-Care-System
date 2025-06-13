from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from not_app.models import Notification
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from not_app.repositories.notification_repository import NotificationRepository

class MarkNotificationAsReadView(APIView):
    @swagger_auto_schema(
        operation_summary="Mark a single notification as read",
        responses={
            200: openapi.Response(description="Notification marked as read successfully"),
            404: "Notification not found"
        }
    )
    def patch(self, request, notification_id):
            success = NotificationRepository.mark_as_read(notification_id=notification_id)
            if success:
                return Response({"message": "Notification marked as read."}, status=status.HTTP_200_OK)
            return Response({"message": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)


class BulkMarkAsReadView(APIView):

    @swagger_auto_schema(
        operation_description="Mark multiple notifications as read.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "notification_ids": openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(type=openapi.TYPE_INTEGER),
                    description="List of notification IDs to mark as read."
                )
            },
            required=["notification_ids"]
        ),
        responses={
            200: openapi.Response(description="Success"),
            400: openapi.Response(description="Invalid request")
        }
    )
    def patch(self, request):
        ids = request.data.get("notification_ids", [])
        if not isinstance(ids, list):
            return Response({
                "message": "notification_ids must be a list."
            }, status=status.HTTP_400_BAD_REQUEST)

        updated_count = Notification.objects.filter(id__in=ids).update(is_read=True)
        return Response({
            "message": "Notifications marked as read.",
            "updated_count": updated_count
        }, status=status.HTTP_200_OK)
    
