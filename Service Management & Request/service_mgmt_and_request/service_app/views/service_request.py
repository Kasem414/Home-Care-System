from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ..serializers.service_request_serializer import ServiceRequestSerializer
from ..repositories.service_request_repository import ServiceRequestRepository, ServiceRequestAttachmentRepository
from ..models import ServiceRequest
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
class ServiceRequestViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  # API Gateway handles authentication

    def list(self, request):
        requests = ServiceRequestRepository.get_all()
        serializer = ServiceRequestSerializer(requests,context={'request':request}, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        request_obj = ServiceRequestRepository.get_by_id(pk)
        if not request_obj:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ServiceRequestSerializer(request_obj,context={'request':request})
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        success = ServiceRequestRepository.delete_request(pk)
        if success:
            return Response({'detail': 'Deleted successfully'})
        return Response({'detail': 'Not found'}, status=404)



class ServiceRequestCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]
    @swagger_auto_schema(request_body=ServiceRequestSerializer)
    def post(self, request):
        user_id = request.headers.get('X-User-Id')
        user_role = request.headers.get('X-User-Role')

        if user_role != 'Customer' or not user_id:
            return Response({'detail': 'Only customers can submit requests.'}, status=403)

        # Handle request data
        form_data = request.data.copy()
        form_data['customer_id'] = user_id

        serializer = ServiceRequestSerializer(data=form_data)
        if serializer.is_valid():
            # Create request
            request_instance = ServiceRequestRepository.create_service_request(serializer.validated_data)
        if not serializer.is_valid():   
            return Response(serializer.errors, status=400)
        # Handle file uploads
        files = request.FILES.getlist('attachments')
        saved_files = []
        for file in files:
            attachment = ServiceRequestAttachmentRepository.create_attachment(request_instance, file)
            saved_files.append({'id': attachment.id, 'image': attachment.image.url})

        return Response({
            'request': ServiceRequestSerializer(request_instance,context={'request':request}).data,
            'attachments': saved_files
        }, status=201)
    

class ServiceRequestUpdateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    @swagger_auto_schema(request_body=ServiceRequestSerializer)
    def put(self, request, request_id):
        instance = ServiceRequestRepository.get_by_id(request_id)
        if not instance:
            return Response({'detail': 'ServiceRequest not found.'}, status=404)

        request_data = request.data.copy()
        serializer = ServiceRequestSerializer(instance, data=request_data,partial=True)
        if serializer.is_valid():
            updated = ServiceRequestRepository.update_request(request_id, serializer.validated_data)

            # Delete existing attachments
            ServiceRequestAttachmentRepository.clear_attachments_for_request(request_id)

            # Add new ones (if provided)
            files = request.FILES.getlist('attachments')
            new_attachments = []
            for file in files:
                attachment = ServiceRequestAttachmentRepository.create_attachment(updated, file)
                new_attachments.append({'id': attachment.id, 'image': attachment.image.url})

            return Response({
                'request': ServiceRequestSerializer(updated,context={'request': request}).data,
                'attachments': new_attachments
            })

        return Response(serializer.errors, status=400)
    @swagger_auto_schema(request_body=ServiceRequestSerializer)
    def patch(self,request,request_id):
        return self.put(request,request_id)