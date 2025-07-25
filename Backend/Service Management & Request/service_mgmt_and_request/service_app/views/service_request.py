from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from datetime import datetime
from ..serializers.service_request_serializer import ServiceRequestSerializer
from ..repositories.service_request_repository import (
    ServiceRequestRepository,
    ServiceRequestAttachmentRepository
)
from ..models import ServiceRequest
from service_app.events.event_publisher import publish_event
from service_app.pagination import CustomPagePagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

pagination_parameters = [
    openapi.Parameter('page', openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER),
    openapi.Parameter('limit', openapi.IN_QUERY, description="Items per page", type=openapi.TYPE_INTEGER),
]


class ServiceRequestViewSet(viewsets.ViewSet):
    

    @swagger_auto_schema(
        manual_parameters=pagination_parameters,
        operation_description="Retrieve a paginated list of service requests."
    )
    def list(self, request):
        queryset = ServiceRequestRepository.get_all()
        paginator = CustomPagePagination()
        result_page = paginator.paginate_queryset(queryset,request)
        serializer = ServiceRequestSerializer(result_page, context={'request': request}, many=True)
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        request_obj = ServiceRequestRepository.get_by_id(pk)
        if not request_obj:
            return Response({'message': 'Service request not found.', 'status_code': status.HTTP_404_NOT_FOUND},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = ServiceRequestSerializer(request_obj, context={'request': request})
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        success = ServiceRequestRepository.delete_request(pk)
        if success:
            return Response({'message': 'Service request deleted successfully.', 'status_code': status.HTTP_200_OK})
        return Response({'message': 'Service request not found.', 'status_code': status.HTTP_404_NOT_FOUND},
                        status=status.HTTP_404_NOT_FOUND)


class ServiceRequestCreateView(APIView):
    # These parsers allow handling form data and file uploads (multipart requests)
    parser_classes = [MultiPartParser, FormParser]
        
    @swagger_auto_schema(
        request_body=ServiceRequestSerializer,
        manual_parameters=[
            openapi.Parameter('customer_id', openapi.IN_FORM, type=openapi.TYPE_INTEGER, required=True),
            openapi.Parameter('service_type', openapi.IN_FORM, type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('city', openapi.IN_FORM, type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('region', openapi.IN_FORM, type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('preferred_date', openapi.IN_FORM, type=openapi.TYPE_STRING, format='date', required=False),
            openapi.Parameter('preferred_time', openapi.IN_FORM, type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('attachments[]', openapi.IN_FORM, type=openapi.TYPE_FILE, required=False, description="Multiple file input"),
        ],
        consumes=["multipart/form-data"],
        operation_description="Create a new service request with optional image attachments"
    )
    def post(self, request):
        # user_id = request.data.get('customerId')
        # user_role = request.headers.get('X-User-Role')

        # if  not user_id:
        #     return Response({'message': 'Only customers can submit requests.', 'status_code': status.HTTP_403_FORBIDDEN},
        #                      status=status.HTTP_403_FORBIDDEN)
        # Clone the submitted form data so it can be edited if needed
        form_data = request.data.copy()
        # form_data['customer_id'] = user_id
        serializer = ServiceRequestSerializer(data=form_data, context={'request': request})
        if serializer.is_valid():
            request_instance = ServiceRequestRepository.create_service_request(serializer.validated_data)
            # Handle file uploads (attachments[])
            files = request.FILES.getlist('attachments[]')
            for file in files:
                # Save each attachment related to the created service request
                ServiceRequestAttachmentRepository.create_attachment(request_instance, file)
            # Build event payload
            event_data = {
                 "event": "SERVICE_REQUEST_CREATED",
                 "request_id": request_instance.id,
                 "customer_id": int(form_data['customer_id']),
                 "service_type": form_data.get("service_type"),
                 "location": {
                     "city": form_data.get("city"),
                     "region": form_data.get("region")
                 },
                 "timestamp": datetime.utcnow().isoformat()
             }
            """
                This sends a message with the routing_key = "service_request.created".
                RabbitMQ will deliver it to the correct queue if a queue is bound to that routing key via the exchange.
            """
                # Publish event
            publish_event(payload=event_data, routing_key="service_request.created")
            return Response({
                'id': request_instance.id,
                'message': 'Service request created successfully.',
                'status_code': status.HTTP_201_CREATED
            }, status=status.HTTP_201_CREATED)
            
        return Response({'message': 'Invalid request.', 'errors': serializer.errors, 'status_code': status.HTTP_400_BAD_REQUEST},
                        status=status.HTTP_400_BAD_REQUEST)
        




class ServiceRequestUpdateView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(request_body=ServiceRequestSerializer)
    def put(self, request, request_id):
        instance = ServiceRequestRepository.get_by_id(request_id)
        if not instance:
            return Response({'message': 'Service request not found.', 'status_code': status.HTTP_404_NOT_FOUND},
                            status=status.HTTP_404_NOT_FOUND)

        request_data = request.data.copy()
        serializer = ServiceRequestSerializer(instance, data=request_data, partial=True, context={'request': request})
        if serializer.is_valid():
            updated = ServiceRequestRepository.update_request(request_id, serializer.validated_data)

            ServiceRequestAttachmentRepository.clear_attachments_for_request(request_id)
            files = request.FILES.getlist('attachments')
            for file in files:
                ServiceRequestAttachmentRepository.create_attachment(updated, file)

            return Response({
                'id': updated.id,
                'message': 'Service request updated successfully.',
                'status_code': status.HTTP_200_OK
            }, status=status.HTTP_200_OK)

        return Response({'message': 'Invalid request.', 'errors': serializer.errors, 'status_code': status.HTTP_400_BAD_REQUEST},
                        status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=ServiceRequestSerializer)
    def patch(self, request, request_id):
        return self.put(request, request_id)