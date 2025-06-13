from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from not_app.serializers.notification_serializer import NotificationSerializer
from not_app.repositories.notification_repository import NotificationRepository
from not_app.models import Notification
from not_app.utils.pagination import NotificationPagination
from django.db.models import Q

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
    pagination_class = NotificationPagination
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('user_id', openapi.IN_QUERY, description="User's ID (required)", type=openapi.TYPE_INTEGER, required=True),
            openapi.Parameter('user_role', openapi.IN_QUERY, description="User's role (e.g. customer, provider) (required)", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('is_read', openapi.IN_QUERY, description="Filter by read status (true or false)", type=openapi.TYPE_BOOLEAN),
            openapi.Parameter('search', openapi.IN_QUERY, description="Search in title or message", type=openapi.TYPE_STRING),
            openapi.Parameter('sort_by', openapi.IN_QUERY, description="Sort field (e.g. created_at or -created_at)", type=openapi.TYPE_STRING),
            openapi.Parameter('page', openapi.IN_QUERY, description="Page number for pagination", type=openapi.TYPE_INTEGER),
            openapi.Parameter('limit', openapi.IN_QUERY, description="Number of items per page", type=openapi.TYPE_INTEGER),
        ],
        responses={200: NotificationSerializer(many=True)}
    )
    def get(self, request):
        user_id = request.query_params.get('user_id')
        user_role = request.query_params.get('user_role')
        is_read = request.query_params.get('is_read')
        search = request.query_params.get('search')
        sort_by = request.query_params.get('sort_by')  # Optional: e.g., 'created_at', '-created_at'

        if not user_id or not user_role:
            return Response({'message': 'user_id and user_role are required.'}, status=status.HTTP_400_BAD_REQUEST)

        filters = {
            'user_id': user_id,
            'user_role': user_role
        }

        if is_read is not None:
            if is_read.lower() == 'true':
                filters['is_read'] = True
            elif is_read.lower() == 'false':
                filters['is_read'] = False
            else:
                return Response({'message': 'is_read must be "true" or "false".'}, status=status.HTTP_400_BAD_REQUEST)

        queryset = Notification.objects.filter(**filters)

        # 🔍 Apply search on title or message
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(message__icontains=search)
            )

        # 🔃 Apply sorting (default to -created_at if not provided)
        if sort_by:
            queryset = queryset.order_by(sort_by)
        else:
            queryset = queryset.order_by('-created_at')

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = NotificationSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

