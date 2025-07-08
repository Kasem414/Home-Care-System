from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from not_app.models import Notification
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from not_app.repositories.notification_repository import NotificationRepository
# from not_app.utils.jwt_utils import get_user_from_token
from rest_framework.permissions import AllowAny

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


# class BulkMarkAsReadView(APIView):

#     def post(self, request):
#         user_id, _ = get_user_from_token(request)
#         nots = NotificationRepository.mark_all_as_read(user_id=user_id)
#         return Response({
#             "message": f"{nots} notifications marked as read.",
#             "status_code": status.HTTP_200_OK
#         }, status=status.HTTP_200_OK)
    
