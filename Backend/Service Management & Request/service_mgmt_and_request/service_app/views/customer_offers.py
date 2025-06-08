from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from service_app.serializers.service_offer_serializer import ServiceOfferSerializer
from service_app.models import ServiceOffer,ServiceRequest
from service_app.pagination import CustomPagePagination
from service_app.repositories.service_request_repository import ServiceRequestRepository
from service_app.events.event_publisher import publish_event
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

pagination_parameters = [
    openapi.Parameter('page', openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER),
    openapi.Parameter('limit', openapi.IN_QUERY, description="Items per page", type=openapi.TYPE_INTEGER),
]
class CustomerOffersView(APIView):
    @swagger_auto_schema(
        operation_summary="List offers for a specific request",
        operation_description="",
        manual_parameters=[
            openapi.Parameter(
                'requestId',
                openapi.IN_QUERY,
                description="",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                'page',
                openapi.IN_QUERY,
                description="Page number for pagination",
                type=openapi.TYPE_INTEGER
            ),
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Number of items per page",
                type=openapi.TYPE_INTEGER
            )
        ],
        responses={
            200: openapi.Response(
                description="List of offers related to a specific request", 
            )
        }
    )
    def get(self, request):
        request_id = request.query_params.get('requestId')

        if not request_id:
            return Response({
                "message": "Missing requestId in query parameters.",
                "status_code": status.HTTP_400_BAD_REQUEST
            }, status=status.HTTP_400_BAD_REQUEST)

        offers = ServiceOffer.objects.filter(request_id=request_id)

        paginator = CustomPagePagination()
        paginated_offers = paginator.paginate_queryset(offers, request)
        serializer = ServiceOfferSerializer(paginated_offers, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)
    

class RequestOffersListView(APIView):
    def get(self, request, request_id):
        try:
            service_request = ServiceRequestRepository.get_by_id(request_id=request_id)
        except ServiceRequest.DoesNotExist:
            return Response({
                "message": "Service request not found.",
                "status_code": status.HTTP_404_NOT_FOUND
            }, status=status.HTTP_404_NOT_FOUND)

        offers_qs = ServiceOffer.objects.filter(request=service_request).order_by('-created_at')

        paginator = CustomPagePagination()
        paginated_offers = paginator.paginate_queryset(offers_qs, request)
        serializer = ServiceOfferSerializer(paginated_offers, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)
    

class AcceptOfferView(APIView):
    def put(self, request, request_id, offer_id):
        try:
            # Ensure the offer exists and belongs to the request
            offer = ServiceOffer.objects.get(id=offer_id, request__id=request_id)
        except ServiceOffer.DoesNotExist:
            return Response({
                "message": "Offer not found for this request.",
                "status_code": 404
            }, status=status.HTTP_404_NOT_FOUND)

        # Check if already accepted
        if offer.status == "accepted":
            return Response({
                "message": "Offer already accepted.",
                "status_code": 400
            }, status=status.HTTP_400_BAD_REQUEST)

        # Update selected offer
        offer.status = "accepted"
        offer.save()

        # Reject other offers for the same request
        ServiceOffer.objects.filter(request_id=request_id).exclude(id=offer_id).update(status="rejected")

        # Update the ServiceRequest
        service_request = offer.request
        service_request.matched_provider_id = offer.provider_id
        service_request.status = "in_progress"
        service_request.save()
        # Payload event
        payload = {
            "event_type": "Offer.Accepted",
            "offer_id": offer.id,
            "request_id": request_id,
            "provider_id": offer.provider_id,
            "customer_id": service_request.customer_id,
            "price": str(offer.price),
            "available_date": str(offer.available_date),
            "available_time": str(offer.available_time),
            "estimated_duration": str(offer.estimated_duration)
        }
        publish_event(payload=payload,routing_key="offer.accepted")
        return Response({
            "message": "Offer accepted successfully.",
            "status_code": 200,
            "matched_provider_id": offer.provider_id
        }, status=status.HTTP_200_OK)