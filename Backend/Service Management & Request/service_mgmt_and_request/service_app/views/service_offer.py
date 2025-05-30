from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ..serializers.service_offer_serializer import ServiceOfferSerializer
from ..repositories.service_offer_repository import ServiceOfferRepository
from ..repositories.service_request_repository import ServiceRequestRepository
from ..pagination import CustomPagePagination
from service_app.events.event_publisher import publish_event
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


pagination_parameters = [
    openapi.Parameter('page', openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER),
    openapi.Parameter('limit', openapi.IN_QUERY, description="Items per page", type=openapi.TYPE_INTEGER),
]


class ServiceOfferViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  
    @swagger_auto_schema(request_body=ServiceOfferSerializer)
    def create(self, request):
        serializer = ServiceOfferSerializer(data=request.data)
        if serializer.is_valid():
            request_instance = ServiceRequestRepository.get_by_id(request_id=serializer.validated_data["request_id"])
            if not request_instance:
                return Response({
                "status_code": status.HTTP_404_NOT_FOUND,
                "message": "Request not found.",
                }, status=status.HTTP_404_NOT_FOUND)
            offer = ServiceOfferRepository.create_offer(serializer.validated_data)
            # Event Publishing: offer.created
            payload = {
                "event_type": "Offer_Created",
                "id": offer.id,
                "request_id": offer.request.id,
                "provider_id": offer.provider_id,
                "price": str(offer.price),
                "available_date": str(offer.available_date),
                "available_time": str(offer.available_time),
                "estimated_duration": float(offer.estimated_duration),
                "status": offer.status
            }
            publish_event(payload,routing_key="offer.created")
            return Response({
                "status_code": status.HTTP_201_CREATED,
                "message": "Offer created successfully.",
                "id": offer.id
            }, status=status.HTTP_201_CREATED)

        return Response({
            "status_code": status.HTTP_400_BAD_REQUEST,
            "message": "Invalid data.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        offer = ServiceOfferRepository.get_by_id(pk)
        if offer:
            serializer = ServiceOfferSerializer(offer,context={'request':request})
            return Response(serializer.data,status=status.HTTP_200_OK)

        return Response({
            "message": "Offer not found."
        }, status=status.HTTP_404_NOT_FOUND)
    @swagger_auto_schema(request_body=ServiceOfferSerializer)
    def update(self, request, pk=None):
        offer = ServiceOfferRepository.get_by_id(pk)
        if not offer:
            return Response({
                "status_code": status.HTTP_404_NOT_FOUND,
                "message": "Offer not found."
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceOfferSerializer(offer, data=request.data,partial=True)
        if serializer.is_valid():
            updated_offer = ServiceOfferRepository.update_offer(pk, serializer.validated_data)
            updated_data = ServiceOfferSerializer(updated_offer,context={'request': request})
            payload = {
                "event_type": "Offer_Updated",
                "id": updated_offer.id,
                "request_id": updated_offer.request.id,
                "provider_id": updated_offer.provider_id,
                "price": str(updated_offer.price),
                "available_date": str(updated_offer.available_date),
                "available_time": str(updated_offer.available_time),
                "estimated_duration": float(updated_offer.estimated_duration),
                "status": updated_offer.status
            }
            publish_event(payload,routing_key="offer.updated")
            return Response({
                "status_code": status.HTTP_200_OK,
                "message": "Offer updated successfully.",
                "data": serializer.validated_data
            }, status=status.HTTP_200_OK)

        return Response({
            "message": "Invalid data.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    @swagger_auto_schema(request_body=ServiceOfferSerializer)
    def partial_update(self,request,pk=None):
        return self.update(request,pk)

    def destroy(self, request, pk=None):
        success = ServiceOfferRepository.delete_offer(pk)
        if success:
            # payload = {
            #     "event_type": "Offer_Deleted",
            #     "request_id": success.request.id,
            #     "provider_id": success.provider_id
            # }
            # publish_event(payload,routing_key="offer.deleted")
            return Response({
                "message": "Offer deleted successfully.",
            }, status=status.HTTP_200_OK)

        return Response({
            "message": "Offer not found."
        }, status=status.HTTP_404_NOT_FOUND)
    @swagger_auto_schema(
        manual_parameters=pagination_parameters,
        operation_description="Retrieve a paginated list of offers."
    )
    def list(self, request):
        # Optional filter by status
        status_filter = request.query_params.get('status')
        queryset = ServiceOfferRepository.get_by_status(status_filter)

        # Pagination
        paginator = CustomPagePagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = ServiceOfferSerializer(page, many=True, context={'request': request})

        # Wrap into your envelope
        return paginator.get_paginated_response({
            "offers": serializer.data
        })
